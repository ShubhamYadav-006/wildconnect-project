/* ==========================================================
   BusinessDetailsPage Component (Redesigned Editorial & Nature-Centric)
   ----------------------------------------------------------
   WildConnect Wildlife Tourism Platform
   A generic, reusable showcase for verified wildlife tourism
   businesses (jungle lodges, farmstays, safari operators, camera rentals).
   Driven entirely by `business: Business` & optional `destination?: Destination | null`.
   ========================================================== */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Business, businessService, BusinessQuickStat } from '../../services/business.service';
import { Destination } from '../../services/destination.service';
import {
  MapPin,
  Star,
  Compass,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Send,
  Phone,
  Mail,
  Calendar,
  Users,
  Car,
  ArrowRight,
  TreePine,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import RoomAvailability from '../../components/ui/RoomAvailability';
import { renderAmenityIcon, renderCategoryBadgeIcon } from '../../utils/amenityIcons';
import { renderExperienceIcon } from '../../utils/experienceIcons';

// Component Stylesheet
import '../../styles/public/BusinessDetailsPage.css';

interface BusinessDetailsPageProps {
  business: Business;
  destination?: Destination | null;
}

const GENERIC_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

export const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({
  business,
  destination
}) => {
  const navigate = useNavigate();

  // Inquiry Modal State
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Related Businesses State (Explore More)
  const [relatedBusinesses, setRelatedBusinesses] = useState<Business[]>([]);
  const [, setIsLoadingRelated] = useState(false);

  // Inline CTA Form State
  const [checkInDate, setCheckInDate] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [safariPreference, setSafariPreference] = useState('Core Zone Safari');
  const [inlineMessage, setInlineMessage] = useState('');

  // 1. Derive Images List
  const images = useMemo(() => {
    const list: string[] = [];
    if (business.coverImage) list.push(business.coverImage);
    if (business.images && Array.isArray(business.images)) {
      business.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : [GENERIC_PLACEHOLDER_IMAGE];
  }, [business.coverImage, business.images]);

  // 2. Fetch Related Businesses in the same Destination
  useEffect(() => {
    const fetchRelated = async () => {
      const destSlug = destination?.slug || business.destination?.slug;
      const destId = destination?.id || business.destinationId;

      if (!destSlug && !destId) return;

      try {
        setIsLoadingRelated(true);
        const data = await businessService.getPublicBusinesses({
          destinationId: destId || undefined
        });

        const list = (Array.isArray(data) ? data : []).filter(
          (b) => b.id !== business.id && (!b.status || b.status === 'APPROVED')
        );
        setRelatedBusinesses(list.slice(0, 3));
      } catch (err) {
        console.error('Failed to load related businesses:', err);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [destination, business.destination, business.destinationId, business.id]);

  // 3. Category & Breadcrumb Link
  const categoryInfo = useMemo(() => {
    const typeKey = (business.category || business.type || '').toUpperCase();
    if (['RESORT', 'ACCOMMODATION', 'HOTEL', 'HOMESTAY', 'FARMSTAY'].includes(typeKey)) {
      return { path: '/businesses?type=RESORT', label: 'Stays & Resorts' };
    }
    if (['CAMERA_RENTAL', 'EQUIPMENT_RENTAL', 'RENTAL'].includes(typeKey)) {
      return { path: '/businesses?type=CAMERA_RENTAL', label: 'Camera & Lens Rentals' };
    }
    if (['TAXI', 'SAFARI_DRIVER', 'SAFARI', 'VEHICLE'].includes(typeKey)) {
      return { path: '/businesses?type=TAXI', label: 'Safari Cabs & Transport' };
    }
    return { path: '/businesses', label: 'Tourism Services' };
  }, [business.category, business.type]);

  // 4. Short Description Fallback
  const shortDescription = useMemo(() => {
    if (business.shortDescription) return business.shortDescription;
    if (business.description) {
      return business.description.length > 160
        ? `${business.description.substring(0, 160)}...`
        : business.description;
    }
    return 'Experience verified partner wildlife tourism services with authentic nature surroundings, comfort, and direct safari gate access.';
  }, [business.shortDescription, business.description]);

  // 5. Quick Stats Highlights (4 Items)
  const quickStats: BusinessQuickStat[] = useMemo(() => {
    if (business.quickStats && business.quickStats.length > 0) {
      return business.quickStats;
    }
    if (business.metadata?.quickStats && business.metadata.quickStats.length > 0) {
      return business.metadata.quickStats;
    }

    const expType =
      business.experienceType ||
      business.metadata?.experienceType ||
      business.metadata?.farmType ||
      categoryInfo.label;

    return [
      {
        label: 'LOCATION',
        value: destination?.name ? `${destination.name} Reserve` : (business.address ? 'Safari Corridor' : 'Wilderness Belt')
      },
      {
        label: 'EXPERIENCE TYPE',
        value: expType
      },
      {
        label: 'SERVICE TYPE',
        value: business.type === 'RESORT' ? 'Jungle Stay' : business.type === 'CAMERA_RENTAL' ? 'Gear Rental' : 'Safari Cab'
      },
      {
        label: 'BOOKING TYPE',
        value: 'Inquiry'
      }
    ];
  }, [business, destination, categoryInfo]);

  // 6. Experiences / What You Can Enjoy
  const experiencesList: string[] = useMemo(() => {
    if (business.experiences && business.experiences.length > 0) {
      return business.experiences;
    }
    if (business.highlights && business.highlights.length > 0) {
      return business.highlights;
    }
    if (business.metadata?.highlights && business.metadata.highlights.length > 0) {
      return business.metadata.highlights;
    }
    return [
      'Prime proximity to national park gates and core wildlife safari zones',
      'Comfortable guest accommodations with peaceful open countryside views',
      'Dedicated local naturalist guidance and tiger safari permit assistance',
      'Authentic regional cuisine prepared with farm-fresh organic ingredients'
    ];
  }, [business.experiences, business.highlights, business.metadata]);

  // 7. Amenities List
  const amenitiesList: string[] = useMemo(() => {
    if (business.amenities && business.amenities.length > 0) {
      return business.amenities;
    }
    return ['Open Lawns & Gardens', 'Safari Access & Guidance', 'Secure Parking', 'Guest Dining', '24/7 Power Backup', 'Naturalist On Call'];
  }, [business.amenities]);

  // 8. Room Availability Check
  const shouldRenderRooms =
    business.hasRooms ||
    business.type === 'RESORT' ||
    (business.rooms && business.rooms.length > 0);

  // 9. Verification status
  const isVerified = business.verified !== undefined ? business.verified : (!business.status || business.status === 'APPROVED');

  // Lightbox Handlers
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

  // Inline CTA submit handler
  const handleInlineInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInquiryModal(true);
  };

  return (
    <div className="business-details-root fade-in">
      {/* ==========================================================
          1. Full-Bleed Cinematic Hero Section
          ========================================================== */}
      <section className="business-details-hero-bleed">
        <div className="business-details-hero-bg-layer">
          <img
            src={images[0]}
            alt={business.name}
            className="business-details-hero-bg-image"
          />
          <div className="business-details-hero-gradient-overlay" />
        </div>

        <div className="business-details-hero-inner">
          {/* Breadcrumbs on Hero */}
          <nav className="business-details-hero-breadcrumbs" aria-label="Breadcrumb">
            <ol className="business-details-breadcrumbs-list">
              <li>
                <Link to="/" className="business-details-hero-crumb-link">Home</Link>
              </li>
              <li className="business-details-hero-crumb-sep">/</li>
              <li>
                <Link to={categoryInfo.path} className="business-details-hero-crumb-link">
                  {categoryInfo.label}
                </Link>
              </li>
              {destination && (
                <>
                  <li className="business-details-hero-crumb-sep">/</li>
                  <li>
                    <Link to={`/destinations/${destination.slug}`} className="business-details-hero-crumb-link">
                      {destination.name}
                    </Link>
                  </li>
                </>
              )}
              <li className="business-details-hero-crumb-sep">/</li>
              <li className="business-details-hero-crumb-current" aria-current="page">
                {business.name}
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="business-details-hero-content">
            <div className="business-details-hero-badges-row">
              <span className="business-details-category-pill">
                {renderCategoryBadgeIcon(business.category || business.type, 13)}
                <span>{categoryInfo.label}</span>
              </span>

              {isVerified && (
                <span className="business-details-verified-pill">
                  <ShieldCheck size={14} className="icon-shield-gold" />
                  <span>Verified Partner</span>
                </span>
              )}

              {business.starRating && (
                <div className="business-details-rating-pill">
                  <Star size={13} fill="#D99A3D" color="#D99A3D" />
                  <span>{business.starRating.toFixed(1)} Stars</span>
                </div>
              )}
            </div>

            <h1 className="business-details-hero-title">{business.name}</h1>

            <div className="business-details-hero-meta-row">
              <div className="business-details-hero-location">
                <MapPin size={16} className="hero-icon-amber" />
                <span>
                  {business.address || (destination ? `${destination.name}, ${destination.state || 'India'}` : 'Wilderness Reserve')}
                </span>
              </div>

              {destination && (
                <Link to={`/destinations/${destination.slug}`} className="business-details-hero-dest-link">
                  <Compass size={14} />
                  <span>{destination.name} Safari Guide</span>
                </Link>
              )}
            </div>

            <p className="business-details-hero-desc">{shortDescription}</p>

            <div className="business-details-hero-actions-row">
              <button
                type="button"
                className="business-details-hero-primary-btn"
                onClick={() => setShowInquiryModal(true)}
              >
                <Send size={16} />
                <span>Submit Enquiry</span>
              </button>

              <button
                type="button"
                className="business-details-hero-gallery-btn"
                onClick={() => openLightbox(0)}
              >
                <ImageIcon size={16} />
                <span>View {images.length} Photos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          2. Quick Highlights Ribbon (Elevated floating strip)
          ========================================================== */}
      <section className="business-details-highlights-ribbon" aria-label="Key Highlights">
        <div className="business-details-highlights-ribbon-grid">
          {quickStats.slice(0, 4).map((stat, idx) => (
            <div key={idx} className="business-details-ribbon-item">
              <span className="business-details-ribbon-label">{stat.label}</span>
              <span className="business-details-ribbon-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================
          3. Compact Editorial Photo Gallery Strip
          ========================================================== */}
      <section className="business-details-editorial-gallery" aria-label="Photo Gallery">
        <div className="business-details-editorial-gallery-grid">
          {/* Featured Compact Frame */}
          <div
            className="business-details-gallery-main-tile"
            onClick={() => openLightbox(0)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
          >
            <img
              src={images[0]}
              alt={`${business.name} showcase`}
              className="business-details-gallery-tile-img"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = GENERIC_PLACEHOLDER_IMAGE;
              }}
            />
            <div className="business-details-gallery-tile-overlay">
              <div className="gallery-tile-caption">
                <Maximize2 size={14} />
                <span>Explore Full Gallery ({images.length} Photos)</span>
              </div>
            </div>
          </div>

          {/* Secondary Compact Frames */}
          {images.slice(1, 4).map((imgUrl, idx) => {
            const imageIndex = idx + 1;
            const isLast = idx === 2 && images.length > 4;

            return (
              <div
                key={imageIndex}
                className={`business-details-gallery-sub-tile ${isLast ? 'has-more-badge' : ''}`}
                onClick={() => openLightbox(imageIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(imageIndex)}
              >
                <img
                  src={imgUrl}
                  alt={`${business.name} thumbnail ${imageIndex + 1}`}
                  className="business-details-gallery-tile-img"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = GENERIC_PLACEHOLDER_IMAGE;
                  }}
                />
                {isLast ? (
                  <div className="business-details-gallery-remaining-overlay">
                    <span className="remaining-count">+{images.length - 3}</span>
                    <span className="remaining-label">More Photos</span>
                  </div>
                ) : (
                  <div className="business-details-gallery-tile-overlay">
                    <Maximize2 size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================================
          4. Main 2-Column Experience (Story Content + Floating Booking)
          ========================================================== */}
      <div className="business-details-body-layout">
        {/* Left Column: Narrative & Rich Content */}
        <main className="business-details-main-column">
          {/* Section: About the Property */}
          <section className="business-details-story-section">
            <div className="business-details-section-header">
              <span className="section-eyebrow">The Sanctuary</span>
              <h2 className="business-details-section-heading">About {business.name}</h2>
            </div>
            <div className="business-details-story-body">
              <p className="business-details-lead-paragraph">
                {business.description || shortDescription}
              </p>
            </div>
          </section>

          {/* Section: Accommodation & Rooms (Conditional) */}
          {shouldRenderRooms && (
            <section className="business-details-story-section business-details-rooms-section">
              <div className="business-details-section-header">
                <span className="section-eyebrow">Accommodations</span>
                <h2 className="business-details-section-heading">Available Rooms &amp; Cottages</h2>
              </div>
              <div className="business-details-room-component-wrap">
                <RoomAvailability
                  businessId={business.id}
                  businessName={business.name}
                />
              </div>
            </section>
          )}

          {/* Section: Experiences & Activities */}
          <section className="business-details-story-section">
            <div className="business-details-section-header">
              <span className="section-eyebrow">Wilderness Immersion</span>
              <h2 className="business-details-section-heading">Experiences &amp; What You Can Enjoy</h2>
            </div>
            <div className="business-details-experiences-mosaic">
              {experiencesList.map((exp, idx) => (
                <div key={idx} className="business-details-experience-tile">
                  <div className="business-details-exp-icon-circle">
                    {renderExperienceIcon(exp, 22)}
                  </div>
                  <div className="business-details-exp-content">
                    <span className="business-details-exp-title">{exp}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Amenities & Facilities */}
          <section className="business-details-story-section">
            <div className="business-details-section-header">
              <span className="section-eyebrow">Comfort &amp; Facilities</span>
              <h2 className="business-details-section-heading">Property Amenities</h2>
            </div>
            <div className="business-details-amenities-pills-wrap">
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="business-details-amenity-pill-card">
                  <div className="amenity-icon-box">
                    {renderAmenityIcon(amenity, 18)}
                  </div>
                  <span className="amenity-pill-title">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Location & Safari Gate Access */}
          <section className="business-details-story-section">
            <div className="business-details-section-header">
              <span className="section-eyebrow">Terrain &amp; Access</span>
              <h2 className="business-details-section-heading">Location &amp; Safari Gate Proximity</h2>
            </div>

            <div className="business-details-location-rich-card">
              <div className="location-data-row">
                <div className="location-data-item">
                  <MapPin size={20} className="icon-amber" />
                  <div>
                    <span className="location-label">Property Address</span>
                    <strong className="location-val">
                      {business.address || 'Direct gateway access in regional safari corridor'}
                    </strong>
                  </div>
                </div>

                {(business.nearestGate || business.metadata?.nearestGate) && (
                  <div className="location-data-item">
                    <Car size={20} className="icon-amber" />
                    <div>
                      <span className="location-label">Nearest Safari Gate</span>
                      <strong className="location-val">
                        {business.nearestGate || business.metadata?.nearestGate}
                      </strong>
                    </div>
                  </div>
                )}

                {(business.distanceFromGate || business.metadata?.distanceFromGate) && (
                  <div className="location-data-item">
                    <Compass size={20} className="icon-amber" />
                    <div>
                      <span className="location-label">Gate Distance</span>
                      <strong className="location-val">
                        {business.distanceFromGate || business.metadata?.distanceFromGate}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {destination && (
                <div className="business-details-destination-safari-callout">
                  <div className="callout-header">
                    <TreePine size={20} className="icon-moss" />
                    <h4>{destination.name} Safari Field Guide</h4>
                  </div>
                  <p className="callout-desc">
                    {destination.description
                      ? destination.description.substring(0, 190) + '...'
                      : `Explore comprehensive safari zone details, buffer gate advice, and tiger tracking insights for ${destination.name}.`}
                  </p>
                  <Link
                    to={`/destinations/${destination.slug}`}
                    className="business-details-dest-guide-link"
                  >
                    <span>Read Destination Safari Guide</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Section: Host & Contact Information */}
          <section className="business-details-story-section">
            <div className="business-details-section-header">
              <span className="section-eyebrow">Hospitality &amp; Care</span>
              <h2 className="business-details-section-heading">Host &amp; Management</h2>
            </div>
            <div className="business-details-host-rich-card">
              <div className="host-profile-header">
                <div className="host-avatar-badge">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="host-name">{business.name}</h3>
                  <span className="host-verified-tag">
                    <ShieldCheck size={14} /> Verified WildConnect Host
                  </span>
                </div>
              </div>

              <div className="host-contacts-grid">
                {business.contactPhone && (
                  <div className="host-contact-entry">
                    <Phone size={16} className="host-entry-icon" />
                    <div>
                      <span className="entry-label">Direct Phone</span>
                      <a href={`tel:${business.contactPhone}`} className="entry-link">
                        {business.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {business.contactEmail && (
                  <div className="host-contact-entry">
                    <Mail size={16} className="host-entry-icon" />
                    <div>
                      <span className="entry-label">Direct Email</span>
                      <a href={`mailto:${business.contactEmail}`} className="entry-link">
                        {business.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {business.address && (
                  <div className="host-contact-entry">
                    <MapPin size={16} className="host-entry-icon" />
                    <div>
                      <span className="entry-label">Location</span>
                      <span className="entry-plain">{business.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Right Column: Sticky Floating Booking Widget */}
        <aside className="business-details-sidebar-column">
          <div className="business-details-sticky-booking-widget">
            <div className="widget-header-scrim">
              <h3 className="widget-title">Submit Stay &amp; Safari Enquiry</h3>
              <p className="widget-subtitle">
                Receive customized verified rates, safari permits, and stay confirmations directly from the partner.
              </p>
            </div>

            <form onSubmit={handleInlineInquirySubmit} className="business-details-widget-form">
              <div className="widget-field-group">
                <label className="widget-label">Check-in Date</label>
                <div className="widget-input-wrapper">
                  <Calendar size={16} className="widget-field-icon" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="widget-input"
                  />
                </div>
              </div>

              <div className="widget-field-group">
                <label className="widget-label">Number of Guests</label>
                <div className="widget-input-wrapper">
                  <Users size={16} className="widget-field-icon" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="widget-input"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3-4 Guests">3 - 4 Guests</option>
                    <option value="5+ Family / Group">5+ Family / Group</option>
                  </select>
                </div>
              </div>

              <div className="widget-field-group">
                <label className="widget-label">Safari &amp; Service Preference</label>
                <div className="widget-input-wrapper">
                  <Car size={16} className="widget-field-icon" />
                  <select
                    value={safariPreference}
                    onChange={(e) => setSafariPreference(e.target.value)}
                    className="widget-input"
                  >
                    <option value="Core Zone Safari">Core Zone Gypsy Safari</option>
                    <option value="Buffer Zone Safari">Buffer Zone Gypsy Safari</option>
                    <option value="Camera / Lens Rental">Camera &amp; Lens Rental</option>
                    <option value="Stay Only">Stay &amp; Accommodation Only</option>
                  </select>
                </div>
              </div>

              <div className="widget-field-group">
                <label className="widget-label">Notes or Special Requirements</label>
                <textarea
                  value={inlineMessage}
                  onChange={(e) => setInlineMessage(e.target.value)}
                  placeholder="Inquire about stay availability, gypsy permits, food preferences..."
                  rows={3}
                  className="widget-textarea"
                />
              </div>

              <button type="submit" className="widget-submit-btn">
                <Send size={16} />
                <span>Submit Enquiry</span>
              </button>
            </form>

            {/* Trust & Guarantee Box */}
            {isVerified && (
              <div className="business-details-widget-trust-shield">
                <ShieldCheck size={22} className="widget-shield-icon" />
                <div className="widget-shield-copy">
                  <strong>Verified WildConnect Partner</strong>
                  <span>On-ground vetted wildlife experience with authentic direct rates.</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ==========================================================
          5. Explore More Stays & Services in Region
          ========================================================== */}
      {relatedBusinesses.length > 0 && (
        <section className="business-details-explore-belt">
          <div className="business-details-explore-container">
            <div className="business-details-explore-heading-row">
              <div>
                <span className="explore-tag">WildConnect Network</span>
                <h2 className="explore-main-title">
                  More Stays &amp; Services in {destination?.name || 'this Safari Belt'}
                </h2>
              </div>
              {destination && (
                <Link to={`/businesses?destination=${destination.slug}`} className="explore-all-link">
                  <span>View All Regional Partners</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            <div className="business-details-explore-cards-grid">
              {relatedBusinesses.map((rel) => {
                const cardImg = rel.coverImage || (rel.images && rel.images[0]) || GENERIC_PLACEHOLDER_IMAGE;
                const isRelResort = rel.type === 'RESORT';
                const targetPath = isRelResort ? `/resorts/${rel.slug}` : `/businesses/${rel.slug}`;

                return (
                  <div
                    key={rel.id}
                    className="business-details-card-nature"
                    onClick={() => navigate(targetPath)}
                  >
                    <div className="card-nature-media">
                      <img
                        src={cardImg}
                        alt={rel.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = GENERIC_PLACEHOLDER_IMAGE;
                        }}
                      />
                      <span className="card-nature-badge">{rel.type.replace('_', ' ')}</span>
                    </div>
                    <div className="card-nature-content">
                      <h3 className="card-nature-name">{rel.name}</h3>
                      <p className="card-nature-loc">
                        <MapPin size={13} className="loc-icon" />
                        <span>{rel.address || destination?.name || 'Safari Corridor'}</span>
                      </p>
                      <div className="card-nature-cta">
                        <span>Explore Property</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================
          6. Mobile Sticky Bottom Action Bar
          ========================================================== */}
      <div className="business-details-mobile-bottom-bar">
        <div className="mobile-bar-info">
          <span className="mobile-bar-name">{business.name}</span>
          <span className="mobile-bar-sub">Direct Host Inquiry</span>
        </div>
        <button
          type="button"
          className="mobile-bar-cta-btn"
          onClick={() => setShowInquiryModal(true)}
        >
          <Send size={15} />
          <span>Inquire Now</span>
        </button>
      </div>

      {/* ==========================================================
          Interactive Modal: BusinessInquiryForm
          ========================================================== */}
      {showInquiryModal && (
        <BusinessInquiryForm
          businessId={business.id}
          businessName={business.name}
          onClose={() => setShowInquiryModal(false)}
        />
      )}

      {/* ==========================================================
          Fullscreen Editorial Lightbox Modal
          ========================================================== */}
      {isLightboxOpen && images.length > 0 && (
        <div className="business-details-lightbox-backdrop" onClick={closeLightbox}>
          <div className="business-details-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="business-details-lightbox-close-btn"
              aria-label="Close lightbox"
            >
              <X size={22} />
            </button>

            <button
              onClick={prevImage}
              className="business-details-lightbox-arrow-btn lightbox-arrow-prev"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="business-details-lightbox-image-wrap">
              <img
                src={images[currentImageIndex]}
                alt={`${business.name} showcase ${currentImageIndex + 1}`}
                className="business-details-lightbox-active-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = GENERIC_PLACEHOLDER_IMAGE;
                }}
              />
              <div className="business-details-lightbox-indicator">
                <span>{currentImageIndex + 1} / {images.length}</span>
              </div>
            </div>

            <button
              onClick={nextImage}
              className="business-details-lightbox-arrow-btn lightbox-arrow-next"
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

export default BusinessDetailsPage;
