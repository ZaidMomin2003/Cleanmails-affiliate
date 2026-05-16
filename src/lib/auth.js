import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

// Sign up with email/password
export async function signUp(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  // Create affiliate profile in Firestore
  try {
    await setDoc(doc(db, 'affiliates', cred.user.uid), {
      uid: cred.user.uid,
      email,
      name,
      displayName: '',
      phone: '',
      country: '',
      bestSocial: '',
      socialHandle: '',
      website: '',
      telegram: '',
      whatsapp: '',
      audience: '',
      promotionMethod: '',
      niche: '',
      wiseEmail: '',
      wiseName: '',
      totalEarned: 0,
      totalPaid: 0,
      balance: 0,
      onboarded: false,
      createdAt: serverTimestamp(),
    })
  } catch (e) {
    console.warn('Firestore write failed:', e.message)
  }
  return cred.user
}

// Sign in with email/password
export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

// Sign in with Google
export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  // Check if affiliate profile exists, if not create one
  let isNew = false
  try {
    const docRef = doc(db, 'affiliates', cred.user.uid)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      isNew = true
      await setDoc(docRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName || '',
        displayName: '',
        phone: '',
        country: '',
        bestSocial: '',
        socialHandle: '',
        website: '',
        telegram: '',
        whatsapp: '',
        audience: '',
        promotionMethod: '',
        niche: '',
        wiseEmail: '',
        wiseName: '',
        totalEarned: 0,
        totalPaid: 0,
        balance: 0,
        onboarded: false,
        createdAt: serverTimestamp(),
      })
    }
  } catch (e) {
    // Firestore might not be ready yet — still let user through
    console.warn('Firestore write failed:', e.message)
    isNew = true
  }
  return { user: cred.user, isNew }
}

// Sign out
export async function logOut() {
  await signOut(auth)
}

// Reset password
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

// Auth state listener
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

// Get affiliate profile
export async function getAffiliateProfile(uid) {
  const docSnap = await getDoc(doc(db, 'affiliates', uid))
  if (docSnap.exists()) {
    return docSnap.data()
  }
  return null
}
