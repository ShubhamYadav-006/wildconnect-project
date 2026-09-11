import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import { MapPin, Mail, Phone, Star, CheckCircle, Tag, ArrowLeft, Send } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import RoomAvailability from '../../components/ui/RoomAvailability';
import BusinessReviews from '../../components/ui/BusinessReviews';

import '../../styles/public/BusinessDetails.css';

const PublicBusinessDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [user, setUser] = useState<{ firstName: string, lastName: string, email: string } | null>(null);

  useEffect(() => {
    // Optionally fetch user from localStorage if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!slug) return;
        setLoading(true);
        const data = await businessService.getPublicBusinessBySlug(slug);
        setBusiness(data);

        if (data?.destinationId) {
          const destRes = await destinationService.getAll();
          const destData = destRes.data || destRes;
          const foundDest = destData.find((d: Destination) => d.id === data.destinationId);
          if (foundDest) setDestination(foundDest);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load business details. It may be unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading local experience..." />;
  
  if (error || !business) {
    return (
      <div className="business-error-state">
        <h2>Experience Not Found</h2>
        <p>{error || 'This business might have been removed or is no longer public.'}</p>
        <button className="btn-back" onClick={() => navigate('/businesses')}>Browse All Businesses</button>
      </div>
    );
  }

  return (
    <div className="public-business-details fade-in">
      {/* Hero Section */}
      <section 
        className="business-hero-section"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${business.coverImage || 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2070'})` }}
      >
        <div className="hero-content-wrapper">
          <button className="btn-back-ghost" onClick={() => navigate('/businesses')}>
            <ArrowLeft size={20} /> Back to Directory
          </button>
          
          <div className="hero-main-content">
            <span className="type-badge">{business.type.replace('_', ' ')}</span>
            <h1 className="hero-title">{business.name}</h1>
            
            <div className="hero-meta">
              <span className="verified-badge"><CheckCircle size={16} /> Verified Partner</span>
              {destination && (
                <span className="hero-location"><MapPin size={16} /> {destination.name}</span>
              )}
              {business.starRating && (
                <span className="hero-rating"><Star size={16} fill="#f59e0b" color="#f59e0b" /> {business.starRating} Stars</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="business-content-layout">
        
        {/* Left Column */}
        <div className="business-main-col">
          <section className="content-section">
            <h2>About this {business.type.replace('_', ' ').toLowerCase()}</h2>
            <p className="description-text">{business.description}</p>
          </section>

          {(business.amenities?.length || business.metadata?.services?.length) ? (
            <section className="content-section">
              <h2>What's Offered</h2>
              
              {business.amenities && business.amenities.length > 0 && (
                <div className="offerings-block">
                  <h3>Amenities</h3>
                  <div className="offerings-tags">
                    {business.amenities.map((am, i) => (
                      <span key={i} className="offering-tag"><Tag size={14} /> {am}</span>
                    ))}
                  </div>
                </div>
              )}

              {business.metadata?.services && business.metadata.services.length > 0 && (
                <div className="offerings-block">
                  <h3>Services</h3>
                  <div className="offerings-tags">
                    {business.metadata.services.map((sv: string, i: number) => (
                      <span key={i} className="offering-tag"><Tag size={14} /> {sv}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ) : null}

          {business.images && business.images.length > 0 && (
            <section className="content-section">
              <h2>Gallery</h2>
              <div className="gallery-grid">
                {business.images.map((img, index) => (
                  <div key={index} className="gallery-item">
                    <img src={img} alt={`Gallery ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rooms & Availability for Accommodations */}
          {['RESORT', 'HOTEL', 'HOMESTAY'].includes(business.type) && (
            <RoomAvailability businessId={business.id} businessName={business.name} />
          )}

          {/* Reviews & Ratings */}
          <BusinessReviews businessId={business.id} />
        </div>

        {/* Right Column / Sidebar */}
        <div className="business-sidebar-col">
          
          <div className="sidebar-card action-card">
            <h3>Interested?</h3>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Connect directly with the business owner to ask questions or request a booking.
            </p>
            <button 
              className="btn-primary w-full" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={() => setShowInquiryForm(true)}
            >
              <Send size={18} /> Enquire Now
            </button>
          </div>

          <div className="sidebar-card contact-card">
            <h3>Contact Information</h3>
            <div className="contact-list">
              {business.address && (
                <div className="contact-item">
                  <MapPin className="contact-icon" size={20} />
                  <div>
                    <span className="contact-label">Location</span>
                    <span className="contact-value">{business.address}</span>
                  </div>
                </div>
              )}
              {business.contactPhone && (
                <div className="contact-item">
                  <Phone className="contact-icon" size={20} />
                  <div>
                    <span className="contact-label">Phone</span>
                    <a href={`tel:${business.contactPhone}`} className="contact-link">{business.contactPhone}</a>
                  </div>
                </div>
              )}
              {business.contactEmail && (
                <div className="contact-item">
                  <Mail className="contact-icon" size={20} />
                  <div>
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${business.contactEmail}`} className="contact-link">{business.contactEmail}</a>
                  </div>
                </div>
              )}
              {!business.address && !business.contactPhone && !business.contactEmail && (
                <p className="no-info">No contact information provided.</p>
              )}
            </div>
          </div>

          {business.metadata?.pricing && (
            <div className="sidebar-card pricing-card">
              <h3>Pricing Details</h3>
              <p className="pricing-text">{business.metadata.pricing}</p>
            </div>
          )}

          {destination && (
            <div className="sidebar-card related-dest-card" onClick={() => navigate(`/destinations/${destination.slug}`)}>
              <img src={destination.coverImage || ''} alt={destination.name} className="related-dest-img" />
              <div className="related-dest-overlay">
                <span className="dest-label">Located in</span>
                <h4>{destination.name}</h4>
              </div>
            </div>
          )}

        </div>
      </div>

      {showInquiryForm && business && (
        <BusinessInquiryForm 
          businessId={business.id}
          businessName={business.name}
          onClose={() => setShowInquiryForm(false)}
          defaultName={user ? `${user.firstName} ${user.lastName}` : ''}
          defaultEmail={user ? user.email : ''}
        />
      )}
    </div>
  );
};

export default PublicBusinessDetails;
