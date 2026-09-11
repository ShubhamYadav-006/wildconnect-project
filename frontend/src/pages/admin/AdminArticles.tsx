import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminArticles.css';

const AdminArticles = () => {
  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Articles</h1>
          <p className="admin-page-subtitle">Manage wildlife stories and guides.</p>
        </div>
        <button className="admin-btn admin-btn-accent">
          <Plus size={16} /> Write Article
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-article-empty-state">
          <BookOpen className="admin-article-empty-icon" />
          <h3 className="admin-article-empty-title">No Articles Found</h3>
          <p className="admin-article-empty-desc">Articles will appear here once connected to the backend.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminArticles;
