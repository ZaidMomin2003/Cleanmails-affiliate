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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event = req.body
    const transferId = event.data?.resource?.id || event.resource?.id

    if (!transferId) {
      return res.status(200).json({ message: 'No transfer ID' })
    }

    const newState = event.data?.current_state || event.current_state || ''

    // Find payout by wiseTransferId
    const payoutsSnapshot = await db.collection('payouts')
      .where('wiseTransferId', '==', String(transferId))
      .limit(1)
      .get()

    if (payoutsSnapshot.empty) {
      return res.status(200).json({ message: 'Payout not found' })
    }

    const payoutDoc = payoutsSnapshot.docs[0]
    const payoutData = payoutDoc.data()

    // Map Wise states
    let status = 'processing'
    if (newState === 'outgoing_payment_sent' || newState === 'funds_converted') {
      status = 'completed'
    } else if (newState === 'cancelled' || newState === 'refunded' || newState === 'bounced_back') {
      status = 'failed'
      // Refund balance
      await db.collection('affiliates').doc(payoutData.affiliateId).update({
        balance: FieldValue.increment(payoutData.amount),
        totalPaid: FieldValue.increment(-payoutData.amount),
      })
    }

    await payoutDoc.ref.update({ status })
    return res.status(200).json({ message: 'OK', status })

  } catch (error) {
    console.error('Wise webhook error:', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
