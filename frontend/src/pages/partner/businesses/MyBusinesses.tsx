import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../../services/business.service';
import { Plus, Edit2, Send, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import '../../../styles/partner/MyBusinesses.css';

export const MyBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      const data = await businessService.getMyBusinesses();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSubmitForReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to submit this business for admin review?')) return;
    try {
      await businessService.submitForReview(id);
      toast.success('Business submitted for review successfully!');
      fetchBusinesses(); // Refresh the list
    } catch (error: any) {
      console.error('Error submitting for review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit for review. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your businesses..." />;
  }

  return (
    <div className="my-businesses-container fade-in">
      <div className="my-businesses-header-row">
        <div>
          <h1 className="my-businesses-title">My Businesses</h1>
          <p className="my-businesses-subtitle">
            Manage your listings, update details, and submit for approval.
          </p>
        </div>
        <Link to="/partner/businesses/new" className="create-business-btn">
          <Plus size={18} />
          <span>Add Business</span>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="my-businesses-empty-state">
          <div className="empty-icon-wrapper">
            <Plus size={48} color="var(--color-primary)" />
          </div>
          <h2>No businesses added yet</h2>
          <p>Start your journey as a partner by adding your first wildlife business.</p>
          <Link to="/partner/businesses/new" className="create-business-btn" style={{ marginTop: '1rem' }}>
            Get Started
          </Link>
        </div>
      ) : (
        <div className="my-businesses-grid">
          {businesses.map((biz) => (
            <div key={biz.id} className="my-business-card">
              <div className="my-business-header">
                <div className="my-business-info">
                  <h3>{biz.name}</h3>
                  <span className="business-type">{biz.type.replace('_', ' ')}</span>
                </div>
                <span className={`status-badge status-${biz.status}`}>
                  {biz.status.replace('_', ' ')}
                </span>
              </div>
              
              {biz.status === 'REJECTED' && biz.rejectionReason && (
                <div className="rejection-reason">
                  <strong>Rejection Reason:</strong> {biz.rejectionReason}
                </div>
              )}

              <div className="my-business-actions">
                <button 
                  className="action-btn btn-view" 
                  onClick={() => navigate(`/partner/businesses/${biz.id}`)}
                  title="Preview"
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </button>

                {(biz.status === 'DRAFT' || biz.status === 'REJECTED') && (
                  <>
                    <button 
                      className="action-btn btn-primary" 
                      onClick={() => navigate(`/partner/businesses/${biz.id}/edit`)}
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="action-btn btn-success" 
                      onClick={() => handleSubmitForReview(biz.id)}
                    >
                      <Send size={16} />
                      <span>Submit for Review</span>
                    </button>
                  </>
                )}
                {biz.status === 'APPROVED' && (
                  <button 
                    className="action-btn btn-primary" 
                    onClick={() => navigate(`/partner/businesses/${biz.id}/edit`)}
                  >
                    <Edit2 size={16} />
                    <span>Update Details</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBusinesses;
