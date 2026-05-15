import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ---- Affiliate Profile ----

export async function updateAffiliateProfile(uid, data) {
  await updateDoc(doc(db, 'affiliates', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function completeOnboarding(uid, data) {
  await updateDoc(doc(db, 'affiliates', uid), {
    ...data,
    onboarded: true,
    updatedAt: serverTimestamp(),
  })
}

// ---- Referral Links ----

export async function createReferralLink(uid, customCode = '', expiresAt = null) {
  const code = customCode || uid.slice(0, 6) + Math.random().toString(36).slice(2, 6)
  const linkData = {
    affiliateId: uid,
    code,
    url: `https://cleanmails.online/?ref=${code}`,
    clicks: 0,
    conversions: 0,
    expiresAt: expiresAt || null,
    createdAt: serverTimestamp(),
  }
  const docRef = await addDoc(collection(db, 'referralLinks'), linkData)
  return { id: docRef.id, ...linkData }
}

export async function getReferralLinks(uid) {
  try {
    const q = query(
      collection(db, 'referralLinks'),
      where('affiliateId', '==', uid)
    )
    const snapshot = await getDocs(q)
    const links = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    links.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
      return bTime - aTime
    })
    return links
  } catch (e) {
    console.warn('getReferralLinks error:', e.code, e.message)
    return []
  }
}

// ---- Purchases ----

export async function getPurchases(uid) {
  const q = query(
    collection(db, 'purchases'),
    where('affiliateId', '==', uid),
    orderBy('timestamp', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// ---- Payouts ----

export async function requestPayout(uid, amount, wiseEmail, wiseName) {
  const payoutData = {
    affiliateId: uid,
    amount,
    wiseEmail,
    wiseName,
    status: 'pending',
    reference: `PAY-${Date.now().toString(36).toUpperCase()}`,
    createdAt: serverTimestamp(),
  }
  const docRef = await addDoc(collection(db, 'payouts'), payoutData)
  return { id: docRef.id, ...payoutData }
}

export async function getPayouts(uid) {
  const q = query(
    collection(db, 'payouts'),
    where('affiliateId', '==', uid),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// ---- Assets ----

export async function getAssets() {
  const snapshot = await getDocs(collection(db, 'assets'))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
