import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LogIn, LayoutDashboard, Info } from 'lucide-react';
import '../../styles/public/Unauthorized.css';

export const Unauthorized: React.FC = () => {
  return (
    <div className="unauthorized-page fade-in">
      <div className="unauthorized-background-glow" />

      <div className="unauthorized-card">
        <div className="unauthorized-icon-wrapper">
          <div className="unauthorized-icon">
            <ShieldAlert size={44} strokeWidth={2} />
          </div>
        </div>

        <div className="unauthorized-badge">
          <span className="unauthorized-badge-dot" />
          Error 403 • Restricted Area
        </div>

        <h1 className="unauthorized-title">Access Denied</h1>

        <p className="unauthorized-description">
          You do not have the required permissions to view this section of the portal.
          Please switch to an authorized account or return to your dashboard.
        </p>

        <div className="unauthorized-info-box">
          <Info size={20} className="unauthorized-info-icon" />
          <p className="unauthorized-info-text">
            <strong>Security Notice:</strong> Attempted access to privileged routes is logged for compliance and security purposes.
          </p>
        </div>

        <div className="unauthorized-actions">
          <Link to="/login" className="unauthorized-btn-link">
            <button type="button" className="unauthorized-btn-login">
              <LogIn size={18} />
              <span>Login as Different User</span>
            </button>
          </Link>

          <Link to="/dashboard" className="unauthorized-btn-link">
            <span className="unauthorized-btn-dashboard">
              <LayoutDashboard size={18} />
              <span>Go to Dashboard</span>
            </span>
          </Link>
        </div>

        <div className="unauthorized-footer">
          Need assistance?{' '}
          <Link to="/contact" className="unauthorized-footer-link">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
