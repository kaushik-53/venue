import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { CompareProvider } from './context/CompareContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import Login    from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home     from './pages/Home'
import Venues   from './pages/Venues'
import VenueDetails from './pages/VenueDetails'
import MyBookings from './pages/MyBookings'
import Favorites  from './pages/Favorites'
import Compare    from './pages/Compare'
import AdminDashboard from './pages/AdminDashboard'
import { AdminRoute } from './components/AdminRoute'
import ScrollToTop from './components/ScrollToTop'
import Messages from './pages/Messages'
import Profile from './pages/Profile'

// Placeholder for pages built in later phases
const ComingSoon = ({ page }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-secondary)',
    gap: '16px',
  }}>
    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-text)' }}>
      RoyalAisle
    </h1>
    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
      <strong style={{ color: 'var(--color-accent)' }}>{page}</strong> — coming in next phase
    </p>
    <div className="divider" />
  </div>
)

// We can keep ComingSoon for anything else we might need, but we don't need it for Admin anymore.

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CompareProvider>
          <Router>
            <ScrollToTop />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="page-enter">
              <Routes>
                {/* Public routes */}
                <Route path="/"         element={<Home />} />
                <Route path="/venues"   element={<Venues />} />
                <Route path="/venues/:id" element={<VenueDetails />} />
                <Route path="/compare"  element={<Compare />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:resettoken" element={<ResetPassword />} />

                {/* Protected routes */}
                <Route path="/my-bookings" element={
                  <ProtectedRoute><MyBookings /></ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                {/* Admin routes */}
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
              </Routes>
            </div>
          </Router>
        </CompareProvider>
      </SocketProvider>
    </AuthProvider>
  )
}


export default App
