import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location])

  // Scroll to top — used by Home link and Logo
  const goHome = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <a href="/" className="navbar-logo" onClick={goHome}>
          <img src="/logo.png" alt="RoyalAisle" className="navbar-logo-img" style={{ height: '40px', width: 'auto' }} />
        </a>

        {/* Desktop nav */}
        <nav className="navbar-links">
          <a href="/" className="nav-link" onClick={goHome}>Home</a>
          <Link to="/venues"    className="nav-link">Venues</Link>
          <Link to="/compare"   className="nav-link">Compare</Link>
          {user && <Link to="/favorites"  className="nav-link">Favorites</Link>}
          {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
          {user && <Link to="/messages" className="nav-link">Messages</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="nav-link nav-link-admin">Admin</Link>}
        </nav>

        {/* Auth buttons */}
        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user">
              <Link to="/profile" className="navbar-user-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          id="navbar-hamburger"
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <a href="/" className="mobile-link" onClick={goHome}>Home</a>
        <Link to="/venues"     className="mobile-link" onClick={() => setMenuOpen(false)}>Venues</Link>
        <Link to="/compare"    className="mobile-link" onClick={() => setMenuOpen(false)}>Compare</Link>
        {user && <Link to="/favorites"   className="mobile-link" onClick={() => setMenuOpen(false)}>Favorites</Link>}
        {user && <Link to="/my-bookings" className="mobile-link" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
        {user && <Link to="/messages"    className="mobile-link" onClick={() => setMenuOpen(false)}>Messages</Link>}
        {user && <Link to="/profile"     className="mobile-link" onClick={() => setMenuOpen(false)}>My Profile</Link>}
        {user?.role === 'admin' && <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>}
        <div className="mobile-auth">
          {user ? (
            <button className="btn btn-outline" onClick={handleLogout} style={{ width: '100%' }}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost"    onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary"  onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
