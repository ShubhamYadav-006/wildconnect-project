import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import '../../styles/admin/AdminBusinesses.css';

const AdminBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'>('PENDING');

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getAdminBusinesses();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching admin businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const displayedBusinesses = activeTab === 'ALL' 
    ? businesses
    : activeTab === 'PENDING'
    ? businesses.filter(b => b.status === 'PENDING_REVIEW')
    : businesses.filter(b => b.status === activeTab);

  return (
    <div className="admin-businesses-page fade-in">
      <div className="admin-header">
        <h2>Business Management</h2>
        <p>Review and manage partner business applications.</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          Pending Review ({businesses.filter(b => b.status === 'PENDING_REVIEW').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setActiveTab('APPROVED')}
        >
          Approved ({businesses.filter(b => b.status === 'APPROVED').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setActiveTab('REJECTED')}
        >
          Rejected ({businesses.filter(b => b.status === 'REJECTED').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'SUSPENDED' ? 'active' : ''}`}
          onClick={() => setActiveTab('SUSPENDED')}
        >
          Suspended ({businesses.filter(b => b.status === 'SUSPENDED').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Businesses ({businesses.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading businesses...</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No businesses found in this category.
                  </td>
                </tr>
              ) : (
                displayedBusinesses.map((biz) => (
                  <tr key={biz.id}>
                    <td>
                      <strong>{biz.name}</strong>
                    </td>
                    <td>{biz.type.replace('_', ' ')}</td>
                    <td>{new Date(biz.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${biz.status}`}>{biz.status.replace('_', ' ')}</span>
                    </td>
                    <td>
                      <Link to={`/admin/businesses/${biz.id}`} className="action-link-btn">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBusinesses;
