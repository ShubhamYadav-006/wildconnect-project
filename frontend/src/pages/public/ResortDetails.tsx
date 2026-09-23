/* ==========================================================
   ResortDetails Page Component
   ----------------------------------------------------------
   Purpose:
   Showcases a comprehensive, luxury wildlife lodge & resort
   detail page with gallery lightbox, amenities, rich narrative,
   and interactive trip booking request integration.
   ========================================================== */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resortService, Resort } from '../../services/resort.service';
import { businessService, Business } from '../../services/business.service';
import { destinationService, Destination } from '../../services/destination.service';
import BusinessDetailsPage from './BusinessDetailsPage';
import { useAuth } from '../../hooks/useAuth';
import {
  MapPin,
  Star,
  Wifi,
  Coffee,
  Car,
  Check,
  Info,
  Compass,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  TreePine,
  Utensils,
  Wind,
  Tv,
  Flame,
  Clock,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Component Stylesheet
import '../../styles/public/ResortDetails.css';

export const ResortDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [resort, setResort] = useState<Resort | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchResortOrBusiness = async () => {
      if (!slug) return;
      setIsLoading(true);

      // Check partner businesses first if slug matches known custom resort pages
      const isKnownCustomResort = 
        slug === 'nilawar-farms' || 
        slug.toLowerCase().includes('nilawar') ||
        slug === 'tadoba-wilderness-resort' || 
        slug.toLowerCase().includes('tadoba-wilderness') ||
        slug === 'tadoba-safari-stay' ||
        slug.toLowerCase().includes('tadoba-safari') ||
        slug === 'natures-sprout-singh-estate' ||
        slug.toLowerCase().includes('singh') ||
        slug.toLowerCase().includes('natures-sprout');

      if (isKnownCustomResort) {
        try {
          let bizData: any = null;
          try {
            bizData = await businessService.getPublicBusinessBySlug(slug);
          } catch {
            const allBiz = await businessService.getPublicBusinesses();
            bizData = (Array.isArray(allBiz) ? allBiz : []).find(b => 
              b.slug === slug || 
              b.slug.startsWith(slug) || 
              slug.startsWith(b.slug) ||
              (slug.includes('nilawar') && b.name.toLowerCase().includes('nilawar')) ||
              (slug.includes('safari') && b.name.toLowerCase().includes('safari')) ||
              ((slug.includes('singh') || slug.includes('sprout')) && b.name.toLowerCase().includes('singh'))
            ) || null;
          }

          if (bizData) {
            setBusiness(bizData);
            if (bizData.destinationId) {
              const destRes = await destinationService.getAll();
              const destData = destRes.data || destRes;
              const foundDest = destData.find((d: Destination) => d.id === bizData.destinationId);
              if (foundDest) setDestination(foundDest);
            }
            setIsLoading(false);
            return;
          }
        } catch (bizErr) {
          console.error('Failed to load business details for custom resort:', bizErr);
        }
      }

      // Check official resort table
      try {
        const response = await resortService.getBySlug(slug);
        if (response.success && response.data) {
          setResort(response.data);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        // Resort table lookup failed, check partner business records below
      }

      // Check if this slug belongs to an approved partner business/resort
      try {
        const bizData = await businessService.getPublicBusinessBySlug(slug);
        if (bizData && (bizData.id || bizData.slug)) {
          setBusiness(bizData);
          if (bizData.destinationId) {
            const destRes = await destinationService.getAll();
            const destData = destRes.data || destRes;
            const foundDest = destData.find((d: Destination) => d.id === bizData.destinationId);
            if (foundDest) setDestination(foundDest);
          }
          setIsLoading(false);
          return;
        }
      } catch (bizErr) {
        console.error('Failed to find business by slug:', bizErr);
      }

      setIsLoading(false);
    };

    fetchResortOrBusiness();
  }, [slug]);

  // If no official resort record exists but partner business was found, adapt it
  const resortData: Resort | null = resort || (business ? {
    id: business.id,
    name: business.name,
    slug: business.slug,
    description: business.description,
    destinationId: business.destinationId || '',
    destination: destination || undefined,
    address: business.address || '',
    starRating: business.starRating || 4,
    pricePerNight: (business.metadata as any)?.pricing?.pricePerNight || 3500,
    amenities: business.amenities || [],
    images: business.images || [],
    coverImage: business.coverImage || '',
    createdAt: business.createdAt,
    updatedAt: business.updatedAt
  } : null);

  const allImages = resortData?.images && resortData.images.length > 0 
    ? resortData.images 
    : resortData?.coverImage 
    ? [resortData.coverImage] 
    : [];

  // Handle Lightbox Navigation
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
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation for lightbox
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

  if (isLoading) {
    return <LoadingSpinner message="Loading luxury lodge details..." />;
  }

  // Render generic, reusable BusinessDetailsPage for any registered partner business
  if (business) {
    return <BusinessDetailsPage business={business} destination={destination} />;
  }

  if (!resortData) {
    return (
      <div className="resort-details-not-found">
        <div className="resort-not-found-card">
          <TreePine size={48} className="resort-not-found-icon" />
          <h2>Resort Not Found</h2>
          <p>The wildlife lodge or resort you are looking for is unavailable or has been removed.</p>
          <Link to="/resorts" className="resort-return-btn">
            Browse All Resorts
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`resort-star-icon ${i < rating ? 'active' : ''}`}
      />
    ));
  };

  const renderAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="resort-amenity-icon" size={18} />;
    if (a.includes('breakfast') || a.includes('dining') || a.includes('restaurant') || a.includes('meal')) return <Utensils className="resort-amenity-icon" size={18} />;
    if (a.includes('coffee') || a.includes('tea') || a.includes('cafe')) return <Coffee className="resort-amenity-icon" size={18} />;
    if (a.includes('parking') || a.includes('safari') || a.includes('cab') || a.includes('transfer')) return <Car className="resort-amenity-icon" size={18} />;
    if (a.includes('pool') || a.includes('swimming')) return <Sparkles className="resort-amenity-icon" size={18} />;
    if (a.includes('ac') || a.includes('air conditioning') || a.includes('cooling')) return <Wind className="resort-amenity-icon" size={18} />;
    if (a.includes('tv') || a.includes('television')) return <Tv className="resort-amenity-icon" size={18} />;
    if (a.includes('campfire') || a.includes('bonfire') || a.includes('fireplace')) return <Flame className="resort-amenity-icon" size={18} />;
    if (a.includes('nature') || a.includes('garden') || a.includes('forest') || a.includes('trail')) return <TreePine className="resort-amenity-icon" size={18} />;
    if (a.includes('desk') || a.includes('service') || a.includes('24')) return <Clock className="resort-amenity-icon" size={18} />;
    return <Check className="resort-amenity-icon" size={18} />;
  };

  const handleBookingRequest = () => {
    const targetUrl = `/trip-request/new?resort=${resortData.id}&destination=${resortData.destinationId}`;
    if (isAuthenticated) {
      navigate(targetUrl);
    } else {
      navigate('/login', { state: { from: { pathname: targetUrl } } });
    }
  };

  return (
    <div className="resort-details-page">
      {/* ==========================================================
          1. HEADER & HERO SHOWCASE
         ========================================================== */}
      <div className="resort-header-container">
        <div className="resort-header-breadcrumb">
          <Link to="/" className="resort-breadcrumb-link">Home</Link>
          <span className="resort-breadcrumb-sep">/</span>
          <Link to="/resorts" className="resort-breadcrumb-link">Resorts</Link>
          {resortData.destination && (
            <>
              <span className="resort-breadcrumb-sep">/</span>
              <Link to={`/destinations/${resortData.destination.slug}`} className="resort-breadcrumb-link">
                {resortData.destination.name}
              </Link>
            </>
          )}
          <span className="resort-breadcrumb-sep">/</span>
          <span className="resort-breadcrumb-current">{resortData.name}</span>
        </div>

        <div className="resort-header-main">
          <div className="resort-header-info">
            <div className="resort-badge-row">
              <span className="resort-lodge-tag">
                <Compass size={13} />
                Luxury Wildlife Stay
              </span>
              <div className="resort-stars-container">
                {renderStars(resortData.starRating)}
                <span className="resort-rating-number">{resortData.starRating}.0 Rating</span>
              </div>
            </div>

            <h1 className="resort-details-title">{resortData.name}</h1>

            <div className="resort-location-row">
              {resortData.destination ? (
                <Link to={`/destinations/${resortData.destination.slug}`} className="resort-destination-link">
                  <MapPin size={16} className="resort-loc-icon" />
                  <span>{resortData.destination.name}, {resortData.destination.state || 'India'}</span>
                </Link>
              ) : resortData.address ? (
                <div className="resort-destination-link">
                  <MapPin size={16} className="resort-loc-icon" />
                  <span>{resortData.address}</span>
                </div>
              ) : null}

              <div className="resort-verified-badge">
                <ShieldCheck size={15} />
                <span>Verified WildConnect Partner</span>
              </div>
            </div>
          </div>

          <div className="resort-header-price-cta">
            <div className="resort-header-price-block">
              <span className="resort-header-price-label">Starting from</span>
              <div className="resort-header-price-val">
                <span className="resort-header-currency">₹</span>
                <span className="resort-header-num">{resortData.pricePerNight.toLocaleString('en-IN')}</span>
                <span className="resort-header-per">/ night</span>
              </div>
            </div>
            <button onClick={handleBookingRequest} className="resort-header-book-btn">
              <span>Request to Book</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          2. EXPERIENCE THE PROPERTY: CURATED IMAGE GALLERY
         ========================================================== */}
      <section className="resort-gallery-section" aria-label="Resort Photo Gallery">
        {allImages.length > 0 ? (
          <div className="resort-gallery-mosaic">
            {/* Primary Large Image */}
            <div 
              className="resort-gallery-item resort-gallery-primary"
              onClick={() => openLightbox(0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
            >
              <img 
                src={allImages[0]} 
                alt={`${resortData.name} primary view`} 
                className="resort-gallery-img"
              />
              <div className="resort-gallery-hover-overlay">
                <Maximize2 size={24} />
                <span>View Fullscreen</span>
              </div>
            </div>

            {/* Supporting Secondary Images */}
            <div className="resort-gallery-secondary-grid">
              {allImages.slice(1, 5).map((imgUrl, idx) => {
                const actualIndex = idx + 1;
                const isLastVisible = idx === 3 && allImages.length > 5;
                const remainingCount = allImages.length - 5;

                return (
                  <div
                    key={actualIndex}
                    className="resort-gallery-item resort-gallery-secondary"
                    onClick={() => openLightbox(actualIndex)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(actualIndex)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${resortData.name} view ${actualIndex + 1}`} 
                      className="resort-gallery-img"
                      loading="lazy"
                    />
                    {isLastVisible ? (
                      <div className="resort-gallery-more-overlay">
                        <span>+{remainingCount} Photos</span>
                      </div>
                    ) : (
                      <div className="resort-gallery-hover-overlay">
                        <Maximize2 size={18} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* In case resort has only 1 or 2 images, show aesthetic placeholders / texture cards */}
              {allImages.length < 5 && Array.from({ length: Math.max(0, 4 - (allImages.length - 1)) }).map((_, placeholderIdx) => (
                <div key={`ph-${placeholderIdx}`} className="resort-gallery-placeholder-item">
                  <TreePine size={24} />
                  <span>WildConnect Heritage Stay</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="resort-no-gallery">
            <TreePine size={36} />
            <p>Photographs for this resort are being updated.</p>
          </div>
        )}
      </section>

      {/* ==========================================================
          3. MAIN CONTENT & STICKY BOOKING SIDEBAR
         ========================================================== */}
      <div className="resort-layout-grid">
        {/* Left: Comprehensive Resort Details */}
        <main className="resort-main-content">
          {/* Quick Info Summary Strip */}
          <div className="resort-quick-strip">
            <div className="resort-quick-item">
              <span className="resort-quick-label">EXPERIENCE</span>
              <span className="resort-quick-value">Jungle & Safari Stay</span>
            </div>
            <div className="resort-quick-divider" />
            <div className="resort-quick-item">
              <span className="resort-quick-label">RATING</span>
              <span className="resort-quick-value">{resortData.starRating} Star Luxury</span>
            </div>
            <div className="resort-quick-divider" />
            <div className="resort-quick-item">
              <span className="resort-quick-label">SAFARI BOOKING</span>
              <span className="resort-quick-value">Customized Proposals</span>
            </div>
            <div className="resort-quick-divider" />
            <div className="resort-quick-item">
              <span className="resort-quick-label">LOCATION</span>
              <span className="resort-quick-value">{resortData.destination?.name || 'Wilderness'}</span>
            </div>
          </div>

          {/* About the Resort */}
          <section className="resort-card" id="about-resort">
            <div className="resort-section-header">
              <span className="resort-section-eyebrow">ABOUT THE PROPERTY</span>
              <h2 className="resort-section-title">An Authentic Jungle Wilderness Retreat</h2>
            </div>
            
            <div className="resort-description">
              {resortData.description ? (
                resortData.description.split('\n').filter(p => p.trim().length > 0).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>Welcome to {resortData.name}, nestled on the periphery of India's iconic wildlife wilderness. Offering unmatched proximity to safari zones, serene landscapes, and personalized hospitality.</p>
              )}
            </div>

            {resortData.destination && (
              <div className="resort-destination-highlight-card">
                <Compass className="resort-dest-highlight-icon" size={24} />
                <div className="resort-dest-highlight-text">
                  <h4>Gateway to {resortData.destination.name}</h4>
                  <p>
                    Strategically situated for quick safari gate access in {resortData.destination.name}. Explore complete park guides, gate information, and sightings on the destination page.
                  </p>
                  <Link to={`/destinations/${resortData.destination.slug}`} className="resort-dest-explore-link">
                    Explore {resortData.destination.name} Guide <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Amenities & Facilities */}
          <section className="resort-card" id="amenities">
            <div className="resort-section-header">
              <span className="resort-section-eyebrow">COMFORTS & SERVICES</span>
              <h2 className="resort-section-title">What this place offers</h2>
            </div>

            {resortData.amenities && resortData.amenities.length > 0 ? (
              <div className="resort-amenities-grid">
                {resortData.amenities.map((amenity, idx) => (
                  <div key={idx} className="resort-amenity-item">
                    <div className="resort-amenity-icon-wrapper">
                      {renderAmenityIcon(amenity)}
                    </div>
                    <span className="resort-amenity-label">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="resort-amenities-empty">Full amenities list available upon request.</p>
            )}
          </section>

          {/* Location & Address */}
          {(resortData.address || resortData.destination) && (
            <section className="resort-card" id="location">
              <div className="resort-section-header">
                <span className="resort-section-eyebrow">LOCATION & SURROUNDINGS</span>
                <h2 className="resort-section-title">Where You'll Stay</h2>
              </div>
              
              <div className="resort-location-content">
                <div className="resort-location-details-box">
                  <div className="resort-location-info-row">
                    <MapPin className="resort-location-pin" size={20} />
                    <div>
                      <h4 className="resort-location-subheading">Property Address</h4>
                      <p className="resort-location-text">
                        {resortData.address ? resortData.address : `${resortData.name}, Near Safari Gates, ${resortData.destination?.name}, ${resortData.destination?.state || 'India'}`}
                      </p>
                    </div>
                  </div>

                  <div className="resort-safari-gate-note">
                    <ShieldCheck size={18} className="resort-gate-note-icon" />
                    <span>
                      Our safari operations desk coordinates seamless pickups and transfers directly from this property to designated park gates.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Wilderness Stay Guarantee */}
          <section className="resort-guarantee-card">
            <h3 className="resort-guarantee-title">
              <Sparkles size={20} />
              The WildConnect Stay Experience
            </h3>
            <div className="resort-guarantee-grid">
              <div className="resort-guarantee-item">
                <Check className="resort-guarantee-check" size={16} />
                <div>
                  <strong>Verified Safari Accommodations</strong>
                  <p>Inspected for comfort, hygiene, and prime safari proximity.</p>
                </div>
              </div>
              <div className="resort-guarantee-item">
                <Check className="resort-guarantee-check" size={16} />
                <div>
                  <strong>Tailored Safari Permits & Itinerary</strong>
                  <p>Combined resort and open-jeep gypsy bookings in one proposal.</p>
                </div>
              </div>
              <div className="resort-guarantee-item">
                <Check className="resort-guarantee-check" size={16} />
                <div>
                  <strong>Expert Naturalist Guides</strong>
                  <p>Certified local drivers and track spotters for memorable sightings.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Right: Sticky Booking & Trip Proposal Card */}
        <aside className="resort-sidebar">
          <div className="resort-booking-card">
            <div className="resort-booking-header">
              <span className="resort-price-eyebrow">Price per room</span>
              <div className="resort-price-row">
                <span className="resort-price-currency">₹</span>
                <span className="resort-price-amount">{resortData.pricePerNight.toLocaleString('en-IN')}</span>
                <span className="resort-price-unit">/ night</span>
              </div>
            </div>

            <div className="resort-booking-divider" />

            <div className="resort-notice-box">
              <Info className="resort-notice-icon" size={18} />
              <p className="resort-notice-text">
                Submit a trip request to check room availability and receive a customized wildlife itinerary including safari permits, transfers, and resort meals.
              </p>
            </div>

            <div className="resort-booking-features">
              <div className="resort-booking-feature-row">
                <Check size={16} className="resort-feature-check" />
                <span>Zero hidden booking charges</span>
              </div>
              <div className="resort-booking-feature-row">
                <Check size={16} className="resort-feature-check" />
                <span>Official Gypsy permits coordinated</span>
              </div>
              <div className="resort-booking-feature-row">
                <Check size={16} className="resort-feature-check" />
                <span>Personalized safari planning support</span>
              </div>
            </div>

            <button 
              onClick={handleBookingRequest}
              className="resort-book-btn"
            >
              <span>Request to Book</span>
              <ArrowRight size={18} />
            </button>
            
            <p className="resort-disclaimer">
              You won't be charged yet &bull; Direct inquiry to lodge team
            </p>
          </div>
        </aside>
      </div>

      {/* ==========================================================
          4. FINAL CTA BANNER
         ========================================================== */}
      <section className="resort-final-cta-section">
        <div className="resort-final-cta-content">
          <span className="resort-final-cta-tag">PLAN YOUR EXPEDITION</span>
          <h2 className="resort-final-cta-title">Ready for an Unforgettable Stay at {resortData.name}?</h2>
          <p className="resort-final-cta-desc">
            Let our wildlife specialists arrange your lodging, open-jeep safari permits, and transfers into {resortData.destination?.name || 'the jungle'} seamlessly.
          </p>
          <button onClick={handleBookingRequest} className="resort-final-cta-btn">
            <span>Request Customized Proposal</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ==========================================================
          5. FULLSCREEN ACCESSIBLE LIGHTBOX
         ========================================================== */}
      {isLightboxOpen && allImages.length > 0 && (
        <div 
          className="resort-lightbox-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery modal"
        >
          <div className="resort-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeLightbox} 
              className="resort-lightbox-close-btn"
              aria-label="Close fullscreen gallery"
            >
              <X size={24} />
            </button>

            <button 
              onClick={prevImage} 
              className="resort-lightbox-nav-btn resort-lightbox-prev"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="resort-lightbox-image-wrapper">
              <img 
                src={allImages[currentImageIndex]} 
                alt={`${resortData.name} slide ${currentImageIndex + 1}`}
                className="resort-lightbox-main-img"
              />
              <div className="resort-lightbox-counter">
                <span>{currentImageIndex + 1}</span>
                <span>/</span>
                <span>{allImages.length}</span>
              </div>
            </div>

            <button 
              onClick={nextImage} 
              className="resort-lightbox-nav-btn resort-lightbox-next"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResortDetails;
