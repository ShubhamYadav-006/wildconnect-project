import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminInquiries.css';

const AdminInquiries = () => {
  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inquiries</h1>
          <p className="admin-page-subtitle">Manage messages from the contact form.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-inquiry-empty-state">
          <Mail className="admin-inquiry-empty-icon" />
          <h3 className="admin-inquiry-empty-title">No Inquiries Found</h3>
          <p className="admin-inquiry-empty-desc">Inquiries will appear here once connected to the backend.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;
