import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../../services/business.service';
import { destinationService, type Destination } from '../../../services/destination.service';
import { ArrowLeft, Edit2, Send, MapPin, Mail, Phone, Star, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import '../../../styles/partner/BusinessDetails.css';

export const BusinessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBusiness = useCallback(async () => {
    try {
      setIsLoading(true);
      const myBusinesses = await businessService.getMyBusinesses();
      const foundBusiness = (Array.isArray(myBusinesses) ? myBusinesses : []).find(b => b.id === id);

      if (foundBusiness) {
        setBusiness(foundBusiness);

        if (foundBusiness.destinationId) {
          const destRes = await destinationService.getAll();
          const destData = destRes.data || destRes;
          const foundDest = destData.find((d: Destination) => d.id === foundBusiness.destinationId);
          if (foundDest) setDestination(foundDest);
        }
      } else {
        toast.error('Business not found or access denied.');
        navigate('/partner/businesses');
      }
    } catch {
      toast.error('Failed to load business details');
      navigate('/partner/businesses');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const handleSubmitForReview = async () => {
    if (!business) return;
    if (!window.confirm('Are you sure you want to submit this business for admin review?')) return;
    try {
      await businessService.submitForReview(business.id);
      toast.success('Business submitted for review successfully!');
      fetchBusiness();
    } catch (error: any) {
      console.error('Error submitting for review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit for review.');
    }
  };

  if (isLoading || !business) {
    return <LoadingSpinner message="Loading business details..." />;
  }

  const isDraftOrRejected = business.status === 'DRAFT' || business.status === 'REJECTED';

  return (
    <div className="business-details-container fade-in">
      {/* Header Actions */}
      <div className="details-header-row">
        <Link to="/partner/businesses" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Businesses</span>
        </Link>
        <div className="details-actions">
          {(isDraftOrRejected || business.status === 'APPROVED') && (
            <Link to={`/partner/businesses/${business.id}/edit`} className="action-btn btn-primary">
              <Edit2 size={16} />
              <span>Edit Details</span>
            </Link>
          )}
          {isDraftOrRejected && (
            <button className="action-btn btn-success" onClick={handleSubmitForReview}>
              <Send size={16} />
              <span>Submit for Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="business-details-card">
        {/* Cover Image Section */}
        <div
          className="business-cover"
          style={{ backgroundImage: `url(${business.coverImage || 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2070'})` }}
        >
          <div className="business-cover-overlay">
            <div className="business-cover-content">
              <span className={`status-badge status-${business.status} large-badge`}>
                {business.status.replace('_', ' ')}
              </span>
              <h1 className="business-title">{business.name}</h1>
              <div className="business-meta">
                <span className="business-type-tag">{business.type.replace('_', ' ')}</span>
                {destination && (
                  <span className="business-location">
                    <MapPin size={16} /> {destination.name}
                  </span>
                )}
                {business.starRating && (
                  <span className="business-rating">
                    <Star size={16} fill="#f59e0b" color="#f59e0b" /> {business.starRating} Stars
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Alert */}
        {business.status === 'REJECTED' && business.rejectionReason && (
          <div className="rejection-alert">
            <strong>Action Required:</strong> {business.rejectionReason}
          </div>
        )}

        <div className="business-info-grid">
          {/* Left Column: Description & Media */}
          <div className="business-main-info">
            <section className="info-section">
              <h2>About {business.name}</h2>
              <p className="business-description">{business.description}</p>
            </section>

            {business.images && business.images.length > 0 && (
              <section className="info-section">
                <h2>Gallery Preview</h2>
                <div className="gallery-grid">
                  {business.images.map((img, idx) => (
                    <div key={idx} className="gallery-item">
                      <img src={img} alt={`Gallery ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(business.amenities?.length || business.metadata?.services?.length) ? (
              <section className="info-section">
                <h2>Offerings</h2>

                {business.amenities && business.amenities.length > 0 && (
                  <div className="offerings-group">
                    <h3>Amenities</h3>
                    <div className="tags-list">
                      {business.amenities.map((amenity, idx) => (
                        <span key={idx} className="tag-item"><Tag size={14} /> {amenity}</span>
                      ))}
                    </div>
                  </div>
                )}

                {business.metadata?.services && business.metadata.services.length > 0 && (
                  <div className="offerings-group">
                    <h3>Services</h3>
                    <div className="tags-list">
                      {business.metadata.services.map((service: string, idx: number) => (
                        <span key={idx} className="tag-item"><Tag size={14} /> {service}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ) : null}
          </div>

          {/* Right Column: Contact & Details */}
          <div className="business-side-info">
            <div className="side-card">
              <h3>Contact Details</h3>
              {business.contactEmail && (
                <div className="contact-row">
                  <Mail size={16} />
                  <span>{business.contactEmail}</span>
                </div>
              )}
              {business.contactPhone && (
                <div className="contact-row">
                  <Phone size={16} />
                  <span>{business.contactPhone}</span>
                </div>
              )}
              {business.address && (
                <div className="contact-row">
                  <MapPin size={16} />
                  <span>{business.address}</span>
                </div>
              )}
            </div>

            {business.metadata?.pricing && (
              <div className="side-card">
                <h3>Pricing Information</h3>
                <p className="pricing-text">
                  {typeof business.metadata.pricing === 'object'
                    ? (business.metadata.pricing.pricePerNight
                      ? `₹${business.metadata.pricing.pricePerNight} / night`
                      : JSON.stringify(business.metadata.pricing))
                    : String(business.metadata.pricing)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
