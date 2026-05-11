import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="RoyalAisle" style={{ height: '36px', width: 'auto' }} />
            </div>
            <p className="footer-tagline">
              Discover and book your perfect wedding venue — elegant, seamless, unforgettable.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="social-icon">📸</a>
              <a href="#" aria-label="Facebook"  className="social-icon">📘</a>
              <a href="#" aria-label="Twitter"   className="social-icon">🐦</a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/venues">All Venues</Link></li>
              <li><Link to="/venues?category=Banquet Hall">Banquet Halls</Link></li>
              <li><Link to="/venues?category=Garden">Garden Venues</Link></li>
              <li><Link to="/venues?category=Poolside">Poolside</Link></li>
              <li><Link to="/venues?category=Resort">Resorts</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/favorites">Saved Venues</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>📧 hello@royalaisle.in</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RoyalAisle. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
