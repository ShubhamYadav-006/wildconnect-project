import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import wildConnectLogo from '../../assets/Tiger&Logo Image/logo.png';
import '../../styles/components/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="WildConnect Home">
          <img
            src={wildConnectLogo}
            alt="WildConnect Logo"
            className="navbar-logo-img"
          />
        </Link>
        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/destinations" className="navbar-link">Destinations</Link>
          <Link to="/businesses" className="navbar-link">Tourism Services</Link>
          <Link to="/articles" className="navbar-link">Articles</Link>
          <Link to="/contact" className="navbar-link">Contact Us</Link>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar-btn-signin">Sign In</Link>
              <Link to="/register" className="navbar-btn-book">Plan Your Safari</Link>
            </>
          ) : (
            <div className="navbar-user-section">
              {user?.role === 'ADMIN' ? (
                <>
                  <Link to="/admin" className="navbar-user-name">
                    <span>Admin Panel</span>
                  </Link>
                  <span className="navbar-divider">|</span>
                  <Link to="/dashboard" className="navbar-user-name">
                    <span>User View</span>
                  </Link>
                </>
              ) : user?.role === 'BUSINESS_PARTNER' ? (
                <Link to="/partner" className="navbar-user-name">
                  <UserIcon size={16} className="navbar-user-icon" />
                  <span>{user?.firstName} (Partner)</span>
                </Link>
              ) : (
                <Link to="/dashboard" className="navbar-user-name">
                  <UserIcon size={16} className="navbar-user-icon" />
                  <span>{user?.firstName}</span>
                </Link>
              )}
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">
            <Link to="/destinations" onClick={() => setIsOpen(false)} className="navbar-link">Destinations</Link>
            <Link to="/businesses" onClick={() => setIsOpen(false)} className="navbar-link">Tourism Services</Link>
            <Link to="/articles" onClick={() => setIsOpen(false)} className="navbar-link">Articles</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="navbar-link">Contact</Link>

            {!isAuthenticated ? (
              <div className="navbar-mobile-auth-group">
                <Link to="/login" onClick={() => setIsOpen(false)} className="navbar-mobile-signin-btn">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="navbar-btn-book navbar-mobile-book-btn">
                  Plan Your Safari
                </Link>
              </div>
            ) : (
              <div className="navbar-mobile-auth-group navbar-mobile-user-group">
                {user?.role === 'ADMIN' ? (
                  <>
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="navbar-link">Admin Panel</Link>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="navbar-link">User View</Link>
                  </>
                ) : user?.role === 'BUSINESS_PARTNER' ? (
                  <Link to="/partner" onClick={() => setIsOpen(false)} className="navbar-link">Partner Dashboard</Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="navbar-link">Dashboard</Link>
                )}
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="navbar-logout-btn navbar-mobile-logout-btn"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;