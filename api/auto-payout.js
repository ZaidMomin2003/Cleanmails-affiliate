import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()
const WISE_API_TOKEN = process.env.WISE_API_TOKEN || ''
const WISE_PROFILE_ID = process.env.WISE_PROFILE_ID || ''

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Auth check — use a secret key to trigger this
  const authKey = req.headers['x-cron-secret'] || ''
  if (authKey !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const results = { processed: 0, failed: 0, skipped: 0 }

  try {
    const affiliatesSnapshot = await db.collection('affiliates')
      .where('balance', '>=', 10)
      .get()

    for (const doc of affiliatesSnapshot.docs) {
      const affiliate = doc.data()

      if (!affiliate.wiseEmail || !affiliate.wiseName) {
        results.skipped++
        continue
      }

      try {
        const amount = affiliate.balance
        const wiseTransferId = await sendWiseTransfer(
          affiliate.wiseEmail,
          affiliate.wiseName,
          amount
        )

        await db.collection('payouts').add({
          affiliateId: doc.id,
          amount,
          wiseEmail: affiliate.wiseEmail,
          wiseName: affiliate.wiseName,
          wiseTransferId,
          status: 'processing',
          reference: `PAY-${Date.now().toString(36).toUpperCase()}`,
          createdAt: FieldValue.serverTimestamp(),
        })

        await doc.ref.update({
          balance: 0,
          totalPaid: FieldValue.increment(amount),
        })

        results.processed++
      } catch (error) {
        console.error(`Payout failed for ${doc.id}:`, error.message)
        results.failed++

        await db.collection('payouts').add({
          affiliateId: doc.id,
          amount: affiliate.balance,
          wiseEmail: affiliate.wiseEmail,
          wiseName: affiliate.wiseName,
          status: 'failed',
          error: error.message,
          reference: `PAY-${Date.now().toString(36).toUpperCase()}`,
          createdAt: FieldValue.serverTimestamp(),
        })
      }
    }

    return res.status(200).json(results)

  } catch (error) {
    console.error('Auto-payout error:', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

async function sendWiseTransfer(recipientEmail, recipientName, amount) {
  const baseUrl = 'https://api.wise.com'
  const headers = {
    'Authorization': `Bearer ${WISE_API_TOKEN}`,
    'Content-Type': 'application/json',
  }

  // Create quote
  const quoteRes = await fetch(`${baseUrl}/v2/quotes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      profileId: parseInt(WISE_PROFILE_ID),
      sourceCurrency: 'USD',
      targetCurrency: 'USD',
      sourceAmount: amount,
      payOut: 'BALANCE',
    }),
  })
  const quote = await quoteRes.json()
  if (!quote.id) throw new Error(`Quote failed: ${JSON.stringify(quote)}`)

  // Create recipient
  const recipientRes = await fetch(`${baseUrl}/v1/accounts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      profile: parseInt(WISE_PROFILE_ID),
      accountHolderName: recipientName,
      currency: 'USD',
      type: 'email',
      details: { email: recipientEmail },
    }),
  })
  const recipient = await recipientRes.json()
  if (!recipient.id) throw new Error(`Recipient failed: ${JSON.stringify(recipient)}`)

  // Create transfer
  const transferRes = await fetch(`${baseUrl}/v1/transfers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      targetAccount: recipient.id,
      quoteUuid: quote.id,
      customerTransactionId: `aff-${Date.now()}`,
      details: { reference: 'CleanMails Affiliate Payout' },
    }),
  })
  const transfer = await transferRes.json()
  if (!transfer.id) throw new Error(`Transfer failed: ${JSON.stringify(transfer)}`)

  // Fund transfer
  const fundRes = await fetch(`${baseUrl}/v3/profiles/${WISE_PROFILE_ID}/transfers/${transfer.id}/payments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: 'BALANCE' }),
  })
  const fund = await fundRes.json()
  if (fund.status === 'REJECTED') throw new Error(`Funding rejected: ${JSON.stringify(fund)}`)

  return String(transfer.id)
}
