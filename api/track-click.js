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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Missing referral code' })
    }

    const linksSnapshot = await db.collection('referralLinks')
      .where('code', '==', code)
      .limit(1)
      .get()

    if (linksSnapshot.empty) {
      return res.status(404).json({ error: 'Link not found' })
    }

    await linksSnapshot.docs[0].ref.update({
      clicks: FieldValue.increment(1),
    })

    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('Click tracking error:', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
