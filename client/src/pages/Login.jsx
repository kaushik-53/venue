import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left — image panel */}
      <div 
        className="auth-panel" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="auth-panel-overlay" />
        <div className="auth-panel-content">
          <h1>Welcome<br />Back</h1>
          <p>Your perfect wedding venue is just a few clicks away. Let’s continue planning your special day.</p>
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

          <h2 className="auth-title">Sign in to your account</h2>
          <p className="auth-subtitle">Welcome back! Please enter your details.</p>

          {error && (
            <div className="auth-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="input-label">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="input"
                placeholder="Enter Your Email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="input-label">Password</label>
              <div className="password-input-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
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
              id="login-submit"
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
             <Link to="/forgot-password" style={{ color: 'var(--color-accent)', fontSize: '0.9rem', textDecoration: 'none' }}>
               Forgot Password?
             </Link>
          </div>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
