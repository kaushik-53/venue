import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { resetPassword } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function ResetPassword() {
  const { resettoken } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    setError('')

    try {
      const res = await resetPassword(resettoken, { password })
      login(res.data.token, res.data.user)
      navigate('/venues')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Link might be expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        {/* Left — image panel */}
        <div 
          className="auth-panel" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="auth-panel-overlay" />
          <div className="auth-panel-content">
            <h1>Secure<br />Reset</h1>
            <p>Your security is our priority. Choose a new strong password to protect your RoyalAisle journey.</p>
          </div>
        </div>

        {/* Right — form side */}
        <div className="auth-form-side">
          <div className="auth-form-box">
            <Link to="/login" className="back-link">← Back to Login</Link>
            
            <div className="auth-logo">
              <span className="auth-logo-icon">🔐</span>
              <span>RoyalAisle</span>
            </div>

            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Create a new secure password for your account.</p>

            {error && (
              <div className="auth-error" style={{ marginBottom: '24px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="input-label">Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? <span className="btn-spinner" /> : 'Reset Password'}
              </button>
            </form>

            <p className="auth-switch" style={{ marginTop: '32px' }}>
              Already remembered? <Link to="/login" className="auth-link">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
