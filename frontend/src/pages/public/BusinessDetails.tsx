import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import {
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle,
  Tag,
  ArrowLeft,
  Send,
  Compass,
  Trees,
  Utensils,
  Clock,
  Sparkles,
  Users,
  Car,
  Globe,
  Camera,
  MessageCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import RoomAvailability from '../../components/ui/RoomAvailability';

import '../../styles/public/BusinessDetails.css';

const PublicBusinessDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    // Optionally fetch user from localStorage if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch { }
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

  useEffect(() => {
    if (business) {
      if (
        slug === 'nilawar-farms' || 
        (slug && slug.toLowerCase().includes('nilawar')) ||
        slug === 'tadoba-wilderness-resort' || 
        (slug && slug.toLowerCase().includes('tadoba-wilderness')) ||
        business.type === 'RESORT'
      ) {
        navigate(`/resorts/${slug}`, { replace: true });
      }
    }
  }, [business, slug, navigate]);

  if (loading) return <LoadingSpinner message="Loading local experience..." />;

  if (error || !business) {
    return (
      <div className="business-error-state">
        <h2>Experience Not Found</h2>
        <p>{error || 'This business might have been removed or is no longer public.'}</p>
        <button className="btn-back" onClick={() => navigate('/businesses')}>
          Browse All Businesses
        </button>
      </div>
    );
  }

  // If this is a resort / farmstay accommodation, redirect directly to /resorts/:slug
  if (
    slug === 'nilawar-farms' || 
    (slug && slug.toLowerCase().includes('nilawar')) || 
    slug === 'tadoba-wilderness-resort' || 
    (slug && slug.toLowerCase().includes('tadoba-wilderness')) ||
    business.type === 'RESORT'
  ) {
    return <LoadingSpinner message="Redirecting to accommodation page..." />;
  }

  const meta = business.metadata || {};

  return (
      <div className="public-business-details fade-in">
        {/* Compact Hero Section */}
        <section
          className="business-hero-compact"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.9)), url(${business.coverImage || 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2070'
              })`
          }}
        >
          <div className="hero-compact-container">
            <div className="hero-top-nav">
              <button className="btn-back-ghost" onClick={() => navigate('/businesses')}>
                <ArrowLeft size={16} /> Back to Tourism Services
              </button>
              <div className="hero-badges-row">
                <span className="type-badge">
                  {meta.farmType || business.type.replace('_', ' ')}
                </span>
                <span className="verified-badge">
                  <ShieldCheck size={14} /> Verified Partner
                </span>
                {business.starRating && (
                  <span className="hero-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {business.starRating} Stars
                  </span>
                )}
              </div>
            </div>

            <div className="hero-compact-title-area">
              <h1 className="hero-title">{business.name}</h1>
              <div className="hero-location-line">
                {destination && (
                  <span className="hero-location-item">
                    <MapPin size={15} /> {destination.name}
                  </span>
                )}
                {meta.nearestGate && (
                  <span className="hero-location-item">
                    <Compass size={15} /> Near {meta.nearestGate}
                  </span>
                )}
                {business.address && (
                  <span className="hero-location-item hero-address-item">
                    {business.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Accommodation Summary Bar */}
        <div className="business-quick-bar">
          <div className="quick-bar-container">
            <div className="quick-bar-items">
              <div className="quick-stat-item">
                <span className="quick-stat-label">Accommodation Type</span>
                <span className="quick-stat-value">{meta.farmType || business.type.replace('_', ' ')}</span>
              </div>
              {meta.nearestGate && (
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Nearest Safari Gate</span>
                  <span className="quick-stat-value">{meta.nearestGate}</span>
                </div>
              )}
              {meta.policies?.checkIn && (
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Check-In / Check-Out</span>
                  <span className="quick-stat-value">{meta.policies.checkIn} / {meta.policies.checkOut || '11:00 AM'}</span>
                </div>
              )}
              {meta.bestSuitedFor && meta.bestSuitedFor.length > 0 && (
                <div className="quick-stat-item hide-mobile">
                  <span className="quick-stat-label">Best Suited For</span>
                  <span className="quick-stat-value">{meta.bestSuitedFor.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
            <button className="quick-enquire-btn" onClick={() => setShowInquiryForm(true)}>
              <Send size={15} /> Enquire Now
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="business-content-layout">
          {/* Left Column */}
          <div className="business-main-col">
            {/* Prioritized Available Rooms & Accommodation Units */}
            {business.type === 'RESORT' && (
              <div className="priority-rooms-section">
                <RoomAvailability businessId={business.id} businessName={business.name} />
              </div>
            )}

            {/* About Section */}
            <section className="content-section">
              <h2>About this {meta.farmType || business.type.replace('_', ' ').toLowerCase()}</h2>
              <p className="description-text">{business.description}</p>
            </section>

            {/* Property Highlights if available */}
            {meta.highlights && meta.highlights.length > 0 && (
              <section className="content-section">
                <h2>Property Highlights</h2>
                <div className="highlights-grid">
                  {meta.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="highlight-item">
                      <Sparkles className="highlight-icon" size={18} />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Safari Access & Nearby Gates */}
            {(meta.nearbyGates && meta.nearbyGates.length > 0) || meta.nearestGate ? (
              <section className="content-section">
                <h2>Safari Access & Nearby Gates</h2>
                {meta.nearestGate && (
                  <div className="nearest-gate-banner">
                    <Compass className="gate-banner-icon" />
                    <div className="gate-banner-text">
                      <h4>Nearest Entry Point: {meta.nearestGate}</h4>
                      <p>
                        Conveniently located for morning and afternoon safari drives into Tadoba Reserve.
                      </p>
                    </div>
                  </div>
                )}

                {meta.nearbyGates && meta.nearbyGates.length > 0 && (
                  <div className="safari-gates-table-wrapper">
                    <table className="safari-gates-table">
                      <thead>
                        <tr>
                          <th>Safari Gate</th>
                          <th>Approx. Distance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meta.nearbyGates.map((g: { name: string; distance: string }, idx: number) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{g.name} Gate</td>
                            <td>
                              <span className="gate-distance-badge">{g.distance}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : null}

            {/* Amenities & Offerings */}
            {business.amenities?.length || meta.services?.length ? (
              <section className="content-section">
                <h2>What this place offers</h2>

                {business.amenities && business.amenities.length > 0 && (
                  <div className="offerings-block">
                    <h3>Amenities</h3>
                    <div className="offerings-tags">
                      {business.amenities.map((am, i) => (
                        <span key={i} className="offering-tag">
                          <Check size={14} color="var(--color-primary)" /> {am}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {meta.services && meta.services.length > 0 && (
                  <div className="offerings-block">
                    <h3>Services</h3>
                    <div className="offerings-tags">
                      {meta.services.map((sv: string, i: number) => (
                        <span key={i} className="offering-tag">
                          <Tag size={14} /> {sv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ) : null}

            {/* Room Features if available */}
            {meta.roomFeatures && meta.roomFeatures.length > 0 && (
              <section className="content-section">
                <h2>Room Features & Comforts</h2>
                <div className="offerings-tags">
                  {meta.roomFeatures.map((rf: string, i: number) => (
                    <span key={i} className="offering-tag">
                      <CheckCircle size={14} color="var(--color-secondary)" /> {rf}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Food & Dining if available */}
            {meta.foodAndDining && (
              <section className="content-section">
                <h2>Food & Dining</h2>
                <div className="highlight-item" style={{ alignItems: 'center' }}>
                  <Utensils className="highlight-icon" size={20} />
                  <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                    {meta.foodAndDining}
                  </p>
                </div>
              </section>
            )}

            {/* Wildlife & Nature if available */}
            {meta.wildlifeAndNature && (
              <section className="content-section">
                <h2>Wildlife & Nature</h2>
                <div className="highlight-item" style={{ alignItems: 'center' }}>
                  <Trees className="highlight-icon" size={20} />
                  <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                    {meta.wildlifeAndNature}
                  </p>
                </div>
              </section>
            )}

            {/* Best Suited For if available */}
            {meta.bestSuitedFor && meta.bestSuitedFor.length > 0 && (
              <section className="content-section">
                <h2>Best Suited For</h2>
                <div className="offerings-tags">
                  {meta.bestSuitedFor.map((bs: string, i: number) => (
                    <span key={i} className="offering-tag" style={{ fontWeight: 600 }}>
                      <Users size={14} color="var(--color-accent)" /> {bs}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Policies & Getting There Grid */}
            {(meta.policies || meta.gettingThere) && (
              <section className="content-section">
                <h2>Stay Policies & Travel Information</h2>
                <div className="info-cards-grid">
                  {meta.policies?.checkIn && (
                    <div className="info-card-item">
                      <div className="info-card-header">
                        <Clock size={16} /> Check-In / Check-Out
                      </div>
                      <p className="info-card-value">
                        Check-In: <strong>{meta.policies.checkIn}</strong>
                        <br />
                        Check-Out: <strong>{meta.policies.checkOut}</strong>
                      </p>
                    </div>
                  )}
                  {meta.policies?.pets && (
                    <div className="info-card-item">
                      <div className="info-card-header">
                        <Sparkles size={16} /> Pet Policy
                      </div>
                      <p className="info-card-value">
                        Pets: <strong>{meta.policies.pets}</strong>
                      </p>
                    </div>
                  )}
                  {meta.policies?.cancellation && (
                    <div className="info-card-item">
                      <div className="info-card-header">
                        <ShieldCheck size={16} /> Cancellation
                      </div>
                      <p className="info-card-value">{meta.policies.cancellation}</p>
                    </div>
                  )}
                  {meta.gettingThere?.railwayStation && (
                    <div className="info-card-item">
                      <div className="info-card-header">
                        <Car size={16} /> Nearest Railway
                      </div>
                      <p className="info-card-value">{meta.gettingThere.railwayStation}</p>
                    </div>
                  )}
                  {meta.gettingThere?.airport && (
                    <div className="info-card-item">
                      <div className="info-card-header">
                        <Car size={16} /> Nearest Airport
                      </div>
                      <p className="info-card-value">{meta.gettingThere.airport}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Gallery */}
            {business.images && business.images.length > 0 && (
              <section className="content-section">
                <h2>Gallery</h2>
                <div className="gallery-grid">
                  {business.images.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img src={img} alt={`${business.name} Gallery ${index + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column / Sidebar */}
          <div className="business-sidebar-col">
            <div className="sidebar-card action-card">
              <h3>Plan Your Stay</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Connect directly with the property host to ask questions, check event availability, or request a booking.
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
                      <a href={`tel:${business.contactPhone}`} className="contact-link">
                        {business.contactPhone}
                      </a>
                      {meta.social?.phoneSecondary && (
                        <div>
                          <a href={`tel:${meta.social.phoneSecondary}`} className="contact-link">
                            {meta.social.phoneSecondary}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {business.contactEmail && (
                  <div className="contact-item">
                    <Mail className="contact-icon" size={20} />
                    <div>
                      <span className="contact-label">Email</span>
                      <a href={`mailto:${business.contactEmail}`} className="contact-link">
                        {business.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {/* Social & External Links */}
                {meta.social && (
                  <div className="social-links-list">
                    {meta.social.whatsapp && (
                      <a
                        href={`https://wa.me/${meta.social.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-btn whatsapp"
                      >
                        <MessageCircle size={16} /> Chat on WhatsApp
                      </a>
                    )}
                    {meta.social.website && (
                      <a
                        href={`https://${meta.social.website.replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-btn website"
                      >
                        <Globe size={16} /> Official Website
                      </a>
                    )}
                    {meta.social.instagram && (
                      <a
                        href={`https://instagram.com/${meta.social.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-btn instagram"
                      >
                        <Camera size={16} /> Follow on Instagram
                      </a>
                    )}
                  </div>
                )}

                {!business.address && !business.contactPhone && !business.contactEmail && (
                  <p className="no-info">No contact information provided.</p>
                )}
              </div>
            </div>

            {(meta.pricingNote || business.metadata?.pricing) && (
              <div className="sidebar-card pricing-card">
                <h3>Pricing Details</h3>
                <p className="pricing-text">
                  {meta.pricingNote || (typeof business.metadata?.pricing === 'object'
                    ? (business.metadata.pricing.pricePerNight
                      ? `₹${business.metadata.pricing.pricePerNight} / night`
                      : JSON.stringify(business.metadata.pricing))
                    : String(business.metadata?.pricing))}
                </p>
              </div>
            )}

            {destination && (
              <div
                className="sidebar-card related-dest-card"
                onClick={() => navigate(`/destinations/${destination.slug}`)}
              >
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

