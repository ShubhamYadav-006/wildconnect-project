import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminExperiences.css';

const AdminExperiences = () => {
  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Traveler Experiences</h1>
          <p className="admin-page-subtitle">Review and manage user-submitted experiences.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-experience-empty-state">
          <Star className="admin-experience-empty-icon" />
          <h3 className="admin-experience-empty-title">No Experiences Found</h3>
          <p className="admin-experience-empty-desc">Experiences will appear here once connected to the backend.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminExperiences;
