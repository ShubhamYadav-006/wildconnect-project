import { Link } from "react-router-dom";
import '../../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-logo-text">
              WildConnect
            </div>
            <p className="footer-description">
              Discover India's incredible wildlife destinations,
              trusted safari resorts, and personalized travel
              planning — all in one place.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="footer-title">Explore</h3>
            <ul className="footer-links">
              <li>
                <Link to="/destinations" className="footer-link">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/businesses" className="footer-link">
                  Tourism Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li>
                <Link to="/articles" className="footer-link">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-title">Contact</h3>
            <div className="footer-contact">
              <p>📍 India</p>
              <p>📧 support@wildconnect.com</p>
              <p>☎ +91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} WildConnect. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="#" className="footer-bottom-link">
              Privacy Policy
            </Link>
            <Link to="#" className="footer-bottom-link">
              Terms
            </Link>
            <Link to="#" className="footer-bottom-link">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;