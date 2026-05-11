import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
