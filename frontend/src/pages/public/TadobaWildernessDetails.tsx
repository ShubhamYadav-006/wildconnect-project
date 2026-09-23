/* ==========================================================
   TadobaWildernessDetails Component
   ----------------------------------------------------------
   Purpose:
   Dedicated showcase page for Tadoba Wilderness Resort & Safari.
   Features luxury buffer cottages, room availability, safari desk,
   and direct booking inquiry integration.
   ========================================================== */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Business } from '../../services/business.service';
import { Destination } from '../../services/destination.service';
import {
  MapPin,
  Star,
  Wifi,
  Utensils,
  Car,
  Check,
  Compass,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  TreePine,
  Maximize2,
  Send,
  Phone,
  Mail,
  Trees
} from 'lucide-react';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import RoomAvailability from '../../components/ui/RoomAvailability';

// Component Stylesheet
import '../../styles/public/TadobaWildernessDetails.css';

interface TadobaWildernessDetailsProps {
  business: Business;
  destination: Destination | null;
}

export const TadobaWildernessDetails = ({ business, destination }: TadobaWildernessDetailsProps) => {
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = business.images && business.images.length > 0 ? business.images : [business.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, nextImage, prevImage]);

  const renderAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return <Wifi size={18} />;
    if (a.includes('dining') || a.includes('buffet') || a.includes('meal')) return <Utensils size={18} />;
    if (a.includes('safari') || a.includes('car')) return <Car size={18} />;
    if (a.includes('pool') || a.includes('swimming')) return <Sparkles size={18} />;
    if (a.includes('walk') || a.includes('nature') || a.includes('tree')) return <TreePine size={18} />;
    return <Check size={18} />;
  };

  return (
    <div className="wilderness-details-page">
      {/* ================= 1. HEADER & BREADCRUMBS ================= */}
      <div className="wilderness-header-container">
        <div className="wilderness-breadcrumb">
          <Link to="/" className="wilderness-breadcrumb-link">Home</Link>
          <span className="wilderness-breadcrumb-sep">/</span>
          <Link to="/resorts" className="wilderness-breadcrumb-link">Accommodations</Link>
          <span className="wilderness-breadcrumb-sep">/</span>
          <span className="wilderness-breadcrumb-current">{business.name}</span>
        </div>

        <div className="wilderness-header-main">
          <div className="wilderness-header-info">
            <div className="wilderness-badge-row">
              <span className="wilderness-tag">
                <Trees size={14} />
                Luxury Jungle Resort & Safari Stay
              </span>
              <span className="wilderness-verified-badge">
                <ShieldCheck size={14} />
                Verified Hospitality Partner
              </span>
              {business.starRating && (
                <div className="wilderness-stars-row">
                  <Star size={14} className="wilderness-star-filled" />
                  <span>{business.starRating} Star Luxury</span>
                </div>
              )}
            </div>

            <h1 className="wilderness-title">{business.name}</h1>

            <div className="wilderness-meta-row">
              <div className="wilderness-meta-item">
                <MapPin size={16} className="wilderness-meta-icon" />
                <span>{business.address || 'Moharli Gate Road, Tadoba, Maharashtra'}</span>
              </div>
              {destination && (
                <Link to={`/destinations/${destination.slug}`} className="wilderness-dest-link">
                  <Compass size={15} />
                  <span>{destination.name}</span>
                </Link>
              )}
            </div>
          </div>

          <div className="wilderness-header-actions">
            <button onClick={() => setShowInquiryModal(true)} className="wilderness-btn-enquire">
              <Send size={16} />
              <span>Send Direct Inquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. IMAGE GALLERY ================= */}
      <section className="wilderness-gallery-section">
        <div className="wilderness-gallery-grid">
          <div 
            className="wilderness-gallery-featured"
            onClick={() => openLightbox(0)}
            role="button"
            tabIndex={0}
          >
            <img 
              src={images[0]} 
              alt={`${business.name} main view`}
              className="wilderness-gallery-img"
            />
            <div className="wilderness-gallery-overlay">
              <Maximize2 size={22} />
              <span>View Fullscreen</span>
            </div>
          </div>

          <div className="wilderness-gallery-secondary-grid">
            {images.slice(1, 3).map((imgUrl, idx) => (
              <div 
                key={idx + 1}
                className="wilderness-gallery-thumb"
                onClick={() => openLightbox(idx + 1)}
                role="button"
                tabIndex={0}
              >
                <img 
                  src={imgUrl} 
                  alt={`${business.name} photo ${idx + 2}`}
                  className="wilderness-gallery-img"
                  loading="lazy"
                />
                <div className="wilderness-gallery-overlay">
                  <Maximize2 size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. QUICK INFO STRIP ================= */}
      <div className="wilderness-quick-strip">
        <div className="wilderness-quick-item">
          <span className="wilderness-quick-label">STAY TYPE</span>
          <span className="wilderness-quick-value">Eco-Friendly Luxury Cottages</span>
        </div>
        <div className="wilderness-quick-divider" />
        <div className="wilderness-quick-item">
          <span className="wilderness-quick-label">LOCATION</span>
          <span className="wilderness-quick-value">Moharli Gate Corridor</span>
        </div>
        <div className="wilderness-quick-divider" />
        <div className="wilderness-quick-item">
          <span className="wilderness-quick-label">SAFARI SUPPORT</span>
          <span className="wilderness-quick-value">Dedicated Safari Operations Desk</span>
        </div>
        <div className="wilderness-quick-divider" />
        <div className="wilderness-quick-item">
          <span className="wilderness-quick-label">DINING</span>
          <span className="wilderness-quick-value">Multi-Cuisine Buffet Restaurant</span>
        </div>
      </div>

      {/* ================= 4. CONTENT LAYOUT ================= */}
      <div className="wilderness-layout-grid">
        <main className="wilderness-main-col">
          {/* Room Availability */}
          <div className="wilderness-rooms-wrapper">
            <RoomAvailability businessId={business.id} businessName={business.name} />
          </div>

          {/* About Resort */}
          <section className="wilderness-card">
            <div className="wilderness-card-header">
              <span className="wilderness-card-eyebrow">ABOUT THE RESORT</span>
              <h2 className="wilderness-card-title">Luxury Living in the Heart of Tiger Country</h2>
            </div>

            <div className="wilderness-description">
              <p>{business.description}</p>
              <p>
                Tadoba Wilderness Resort & Safari provides an immersive wildlife getaway with premium wooden 
                villas, personalized safari assistance, and serene natural surroundings. Enjoy direct access 
                to top core and buffer gates with certified naturalists guiding your wilderness exploration.
              </p>
            </div>
          </section>

          {/* Amenities */}
          <section className="wilderness-card">
            <div className="wilderness-card-header">
              <span className="wilderness-card-eyebrow">AMENITIES & COMFORTS</span>
              <h2 className="wilderness-card-title">Resort Facilities</h2>
            </div>

            <div className="wilderness-amenities-grid">
              {business.amenities && business.amenities.length > 0 ? (
                business.amenities.map((amenity, idx) => (
                  <div key={idx} className="wilderness-amenity-item">
                    <div className="wilderness-amenity-icon-wrap">
                      {renderAmenityIcon(amenity)}
                    </div>
                    <span className="wilderness-amenity-label">{amenity}</span>
                  </div>
                ))
              ) : (
                <p>Full amenities provided on arrival.</p>
              )}
            </div>
          </section>

          {/* Location */}
          <section className="wilderness-card">
            <div className="wilderness-card-header">
              <span className="wilderness-card-eyebrow">LOCATION & GATES</span>
              <h2 className="wilderness-card-title">Where You'll Stay</h2>
            </div>

            <div className="wilderness-location-box">
              <div className="wilderness-location-row">
                <MapPin className="wilderness-loc-pin" size={20} />
                <div>
                  <h4>Property Location</h4>
                  <p>{business.address || 'Moharli Gate Road, Tadoba, Maharashtra'}</p>
                </div>
              </div>
              <div className="wilderness-gate-note">
                <Compass size={18} />
                <span>Immediate access to Moharli Core Gate and Agarzari / Junona Buffer Gates.</span>
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="wilderness-sidebar">
          <div className="wilderness-host-card">
            <h3 className="wilderness-host-title">Inquire with the Resort</h3>
            <p className="wilderness-host-desc">
              Directly contact our reservations desk for room availability, package pricing, and safari permit guidance.
            </p>

            <div className="wilderness-contact-list">
              {business.contactPhone && (
                <a href={`tel:${business.contactPhone}`} className="wilderness-contact-item">
                  <Phone size={16} />
                  <span>{business.contactPhone}</span>
                </a>
              )}
              {business.contactEmail && (
                <a href={`mailto:${business.contactEmail}`} className="wilderness-contact-item">
                  <Mail size={16} />
                  <span>{business.contactEmail}</span>
                </a>
              )}
            </div>

            <button onClick={() => setShowInquiryModal(true)} className="wilderness-sidebar-btn">
              <Send size={16} />
              <span>Send Reservation Inquiry</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ================= 5. INQUIRY MODAL ================= */}
      {showInquiryModal && (
        <BusinessInquiryForm
          businessId={business.id}
          businessName={business.name}
          onClose={() => setShowInquiryModal(false)}
        />
      )}

      {/* ================= 6. LIGHTBOX ================= */}
      {isLightboxOpen && images.length > 0 && (
        <div className="wilderness-lightbox-backdrop" onClick={closeLightbox}>
          <div className="wilderness-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeLightbox} className="wilderness-lightbox-close" aria-label="Close">
              <X size={24} />
            </button>
            <button onClick={prevImage} className="wilderness-lightbox-nav wilderness-prev" aria-label="Previous">
              <ChevronLeft size={28} />
            </button>
            <div className="wilderness-lightbox-wrapper">
              <img 
                src={images[currentImageIndex]} 
                alt={`${business.name} photo ${currentImageIndex + 1}`}
                className="wilderness-lightbox-img"
              />
              <div className="wilderness-lightbox-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
            <button onClick={nextImage} className="wilderness-lightbox-nav wilderness-next" aria-label="Next">
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TadobaWildernessDetails;
