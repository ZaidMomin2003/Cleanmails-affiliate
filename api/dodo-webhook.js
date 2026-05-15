import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import crypto from 'crypto'

// Initialize Firebase Admin
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
const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET || ''
const COMMISSION_AMOUNT = 100

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify webhook signature
    const signature = req.headers['webhook-signature'] || req.headers['x-webhook-signature'] || ''
    const body = JSON.stringify(req.body)

    if (DODO_WEBHOOK_SECRET && !verifySignature(body, signature, DODO_WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const event = req.body

    // Only process payment.succeeded
    if (event.type !== 'payment.succeeded' && event.event_type !== 'payment.succeeded') {
      return res.status(200).json({ message: 'Event ignored' })
    }

    const payment = event.data || event.payload || event
    const metadata = payment.metadata || {}
    const referralCode = metadata.referral_code || metadata.ref || null

    if (!referralCode) {
      return res.status(200).json({ message: 'No referral code' })
    }

    const amount = payment.amount || payment.total_amount || 0
    const currency = payment.currency || 'USD'
    const customerEmail = payment.customer_email || payment.email || 'unknown'
    const dodoPurchaseId = payment.payment_id || payment.id || `dodo_${Date.now()}`

    // Look up referral link by code
    const linksSnapshot = await db.collection('referralLinks')
      .where('code', '==', referralCode)
      .limit(1)
      .get()

    if (linksSnapshot.empty) {
      return res.status(200).json({ message: 'Referral code not found' })
    }

    const linkDoc = linksSnapshot.docs[0]
    const linkData = linkDoc.data()
    const affiliateId = linkData.affiliateId

    // Idempotency check
    const existing = await db.collection('purchases')
      .where('dodoPurchaseId', '==', dodoPurchaseId)
      .limit(1)
      .get()

    if (!existing.empty) {
      return res.status(200).json({ message: 'Already processed' })
    }

    // Create purchase record
    await db.collection('purchases').add({
      affiliateId,
      linkId: linkDoc.id,
      amount: amount / 100,
      currency,
      commission: COMMISSION_AMOUNT,
      customerEmail: maskEmail(customerEmail),
      dodoPurchaseId,
      status: 'confirmed',
      timestamp: FieldValue.serverTimestamp(),
    })

    // Credit affiliate
    await db.collection('affiliates').doc(affiliateId).update({
      totalEarned: FieldValue.increment(COMMISSION_AMOUNT),
      balance: FieldValue.increment(COMMISSION_AMOUNT),
    })

    // Increment conversions
    await linkDoc.ref.update({
      conversions: FieldValue.increment(1),
    })

    return res.status(200).json({ message: 'OK', affiliate: affiliateId })

  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

function verifySignature(body, signature, secret) {
  try {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(body)
    const expected = hmac.digest('hex')
    return signature === expected || signature === `sha256=${expected}` || signature.includes(expected)
  } catch {
    return false
  }
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***'
  const [local, domain] = email.split('@')
  return `${local.slice(0, 3)}***@${domain}`
}
