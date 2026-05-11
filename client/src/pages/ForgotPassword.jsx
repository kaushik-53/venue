import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      await forgotPassword({ email })
      setMessage('A password reset link has been sent to your email address.')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
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
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')" }}
        >
          <div className="auth-panel-overlay" />
          <div className="auth-panel-content">
            <h1>Account<br />Recovery</h1>
            <p>Don't worry! It happens to the best of us. Let's get you back to planning your perfect event.</p>
          </div>
        </div>

        {/* Right — form side */}
        <div className="auth-form-side">
          <div className="auth-form-box">
            <Link to="/login" className="back-link">← Back to Login</Link>
            
            <div className="auth-logo">
              <span className="auth-logo-icon">💍</span>
              <span>RoyalAisle</span>
            </div>

            <h2 className="auth-title">Forgot Password</h2>
            {!message && (
              <p className="auth-subtitle">Enter your email to receive a password reset link.</p>
            )}

            {message && (
              <div className="auth-success" style={{ marginBottom: '24px', background: 'rgba(200, 169, 126, 0.1)', color: 'var(--color-accent)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
                <span>✅</span> {message}
              </div>
            )}
            
            {error && (
              <div className="auth-error" style={{ marginBottom: '24px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? <span className="btn-spinner" /> : 'Send Reset Link'}
                </button>
              </form>
            )}

            <p className="auth-switch" style={{ marginTop: '32px' }}>
              Remember your password? <Link to="/login" className="auth-link">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
