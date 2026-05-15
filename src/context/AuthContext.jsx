import { createContext, useContext, useState, useEffect } from 'react'
import { onAuth, getAffiliateProfile } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Try to fetch profile but don't block on it
        try {
          const affiliateProfile = await getAffiliateProfile(firebaseUser.uid)
          setProfile(affiliateProfile)
        } catch (e) {
          console.warn('Could not fetch profile:', e.message)
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const refreshProfile = async () => {
    if (user) {
      try {
        const affiliateProfile = await getAffiliateProfile(user.uid)
        setProfile(affiliateProfile)
      } catch (e) {
        console.warn('Could not refresh profile:', e.message)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
