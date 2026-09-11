import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import { ArrowLeft, MapPin, Mail, Phone, Tag, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import '../../styles/admin/AdminBusinessDetails.css';

export const AdminBusinessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchBusiness = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await businessService.getAdminBusinessById(id);
      setBusiness(data);

      if (data?.destinationId) {
        const destRes = await destinationService.getAll();
        const destData = destRes.data || destRes;
        const foundDest = destData.find((d: Destination) => d.id === data.destinationId);
        if (foundDest) setDestination(foundDest);
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
      toast.error('Business not found or failed to load.');
      navigate('/admin/businesses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const handleApprove = async () => {
    if (!business || !window.confirm('Approve this business? It will become public.')) return;
    try {
      await businessService.updateBusinessStatus(business.id, 'APPROVED');
      toast.success('Business approved and is now live!');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to approve', error);
      toast.error(error.response?.data?.message || 'Failed to approve business.');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !rejectionReason.trim()) return;
    try {
      await businessService.updateBusinessStatus(business.id, 'REJECTED', rejectionReason);
      toast.success('Business application rejected.');
      setRejecting(false);
      setRejectionReason('');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to reject', error);
      toast.error(error.response?.data?.message || 'Failed to reject business.');
    }
  };

  const handleSuspend = async () => {
    if (!business || !window.confirm('Suspend this business? It will be removed from public view.')) return;
    try {
      await businessService.updateBusinessStatus(business.id, 'SUSPENDED');
      toast.success('Business suspended.');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to suspend', error);
      toast.error(error.response?.data?.message || 'Failed to suspend business.');
    }
  };

  if (isLoading || !business) {
    return <LoadingSpinner message="Loading application details..." />;
  }

  return (
    <div className="admin-business-details fade-in">
      {/* Header */}
      <div className="details-header-row">
        <Link to="/admin/businesses" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Businesses</span>
        </Link>
        <div className="details-actions">
          {business.status === 'PENDING_REVIEW' && (
            <>
              <button className="action-btn btn-success" onClick={handleApprove}>
                <CheckCircle size={16} /> Approve
              </button>
              <button className="action-btn btn-danger" onClick={() => setRejecting(true)}>
                <XCircle size={16} /> Reject
              </button>
            </>
          )}
          {(business.status === 'APPROVED' || business.status === 'DRAFT' || business.status === 'REJECTED') && (
            <button className="action-btn btn-danger" onClick={() => setRejecting(true)}>
              <XCircle size={16} /> Reject/Revoke
            </button>
          )}
          {business.status === 'APPROVED' && (
            <button className="action-btn btn-secondary" onClick={handleSuspend}>
              <PauseCircle size={16} /> Suspend
            </button>
          )}
          {business.status === 'SUSPENDED' && (
            <button className="action-btn btn-success" onClick={handleApprove}>
              <CheckCircle size={16} /> Re-Approve
            </button>
          )}
        </div>
      </div>

      {/* Main Review Card */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-title">
            <h1>{business.name}</h1>
            <span className={`status-badge status-${business.status}`}>{business.status.replace('_', ' ')}</span>
          </div>
          <div className="review-meta">
            <span><strong>Type:</strong> {business.type.replace('_', ' ')}</span>
            <span><strong>Applied:</strong> {new Date(business.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {business.rejectionReason && (
          <div className="rejection-alert">
            <strong>Current Rejection Reason:</strong> {business.rejectionReason}
          </div>
        )}

        <div className="review-grid">
          <div className="review-main">
            <section className="review-section">
              <h3>Description</h3>
              <p className="business-desc">{business.description}</p>
            </section>

            <section className="review-section">
              <h3>Images & Media</h3>
              <div className="media-preview">
                {business.coverImage && (
                  <div className="cover-preview">
                    <h4>Cover Image</h4>
                    <img src={business.coverImage} alt="Cover" />
                  </div>
                )}
                {business.images && business.images.length > 0 && (
                  <div className="gallery-preview">
                    <h4>Gallery</h4>
                    <div className="gallery-grid">
                      {business.images.map((img, i) => (
                        <img key={i} src={img} alt={`Gallery ${i+1}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {(business.amenities?.length || business.metadata?.services?.length) ? (
              <section className="review-section">
                <h3>Offerings</h3>
                <div className="tags-container">
                  {business.amenities?.map((am, i) => (
                    <span key={i} className="tag"><Tag size={12} /> {am}</span>
                  ))}
                  {business.metadata?.services?.map((sv: string, i: number) => (
                    <span key={i} className="tag"><Tag size={12} /> {sv}</span>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="review-sidebar">
            <div className="info-box">
              <h3>Owner Information</h3>
              {business.user ? (
                <>
                  <p><strong>Name:</strong> {business.user.firstName} {business.user.lastName}</p>
                  <p><strong>Email:</strong> {business.user.email}</p>
                  <p><strong>User ID:</strong> {business.user.id}</p>
                </>
              ) : (
                <p><strong>User ID:</strong> <br/>{business.userId}</p>
              )}
            </div>

            <div className="info-box">
              <h3>Contact & Location</h3>
              <div className="contact-item">
                <Mail size={16} /> {business.contactEmail || 'N/A'}
              </div>
              <div className="contact-item">
                <Phone size={16} /> {business.contactPhone || 'N/A'}
              </div>
              <div className="contact-item">
                <MapPin size={16} /> {business.address || 'N/A'}
              </div>
              {destination && (
                <div className="contact-item">
                  <strong>Destination:</strong> {destination.name}
                </div>
              )}
            </div>

            {business.metadata?.pricing && (
              <div className="info-box">
                <h3>Pricing Info</h3>
                <p className="pricing-text">{business.metadata.pricing}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejecting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Application</h3>
            <p>Please provide a reason. This will be visible to the partner.</p>
            <form onSubmit={handleReject}>
              <div className="form-group">
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Photos are blurry, incomplete description..."
                  rows={4}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setRejecting(false)}>Cancel</button>
                <button type="submit" className="btn-danger">Confirm Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusinessDetails;
