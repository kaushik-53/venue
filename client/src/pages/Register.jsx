import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await registerUser(form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.error 
        ? `${err.response.data.message}: ${err.response.data.error}`
        : (err.response?.data?.message || 'Registration failed. Please try again.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left — image panel */}
      <div 
        className="auth-panel" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')" }}
      >
        <div className="auth-panel-overlay" />
        <div className="auth-panel-content">
          <h1>Find Your Perfect<br />Wedding Venue</h1>
          <p>Discover beautiful venues, compare options, and book your dream wedding location — all in one place.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <Link to="/" className="back-link">← Back to Home</Link>
          
          {/* Logo */}
          <div className="auth-logo">
            <img src="/logo.png" alt="RoyalAisle" style={{ height: '48px', width: 'auto' }} />
          </div>

          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Start your wedding journey today</p>

          {error && (
            <div className="auth-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="input"
                placeholder="Enter Your Name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="Enter Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
