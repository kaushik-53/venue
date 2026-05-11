import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Redirects unauthenticated users to /login
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: 120, height: 20 }} />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

// Redirects non-admins to /
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return children
}
