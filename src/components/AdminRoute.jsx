import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'arshadbashamomin@gmail.com'

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/app/dashboard" replace />

  return children
}

export default AdminRoute
