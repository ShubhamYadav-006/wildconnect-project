/* ==========================================================
   NilawarFarmsDetails Component
   ----------------------------------------------------------
   Purpose:
   Dedicated showcase page for Nilawar Farms Agritourism Farmstay.
   Fully incorporates verified research: Borda Lake / Mul Road location,
   Mamla Gate access, room types, pet-friendly amenities, swimming pool,
   and direct contact info.
   ========================================================== */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { businessService, Business } from '../../services/business.service';
import {
  MapPin,
  Wifi,
  Utensils,
  Car,
  Check,
  Compass,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  TreePine,
  Maximize2,
  Send,
  Flame,
  Wind,
  Bed,
  PartyPopper,
  Dog,
  LayoutGrid
} from 'lucide-react';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import RoomAvailability from '../../components/ui/RoomAvailability';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Direct High-Resolution Assets
import farmImg1 from '../../assets/NilawarFarmsImages/NilawarFarms1 (1).png';
import farmImg2 from '../../assets/NilawarFarmsImages/NilawarFarms1 (2).png';
import farmImg3 from '../../assets/NilawarFarmsImages/NilawarFarms1 (3).png';
import farmImg4 from '../../assets/NilawarFarmsImages/NilawarFarms1 (4).png';
import farmImg5 from '../../assets/NilawarFarmsImages/NilawarFarms1 (5).png';
import farmImg6 from '../../assets/NilawarFarmsImages/NilawarFarms1 (6).png';

// Component Stylesheet
import '../../styles/public/NilawarFarmsDetails.css';

interface NilawarFarmsDetailsProps {
  business?: Business | null;
  destination?: any;
}

interface GalleryItem {
  src: string;
  title: string;
  category: 'all' | 'rooms' | 'pool' | 'landscape';
  tag: string;
  desc: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    src: farmImg1,
    title: 'Farmstay Front View & Greenery',
    category: 'landscape',
    tag: 'Estate Overview',
    desc: 'Lush greenery and open countryside ambiance at Borda'
  },
  {
    src: farmImg2,
    title: 'Deluxe AC Room & Garden Sit-Out',
    category: 'rooms',
    tag: 'Deluxe AC Room',
    desc: 'Spacious air-conditioned rooms opening to gardens'
  },
  {
    src: farmImg3,
    title: 'Rustic Wooden Cottage Bedroom',
    category: 'rooms',
    tag: 'Wooden Cottage',
    desc: 'Warm wooden cottage interiors for a cozy wilderness stay'
  },
  {
    src: farmImg4,
    title: 'Standalone Cottage & Verandah',
    category: 'rooms',
    tag: 'Private Cottage',
    desc: 'Independent cottage units with private shaded sit-outs'
  },
  {
    src: farmImg5,
    title: 'Swimming Pool & Outdoor Dining',
    category: 'pool',
    tag: 'Pool & Lounge',
    desc: 'Refreshing pool with deck chairs and open-air seating'
  },
  {
    src: farmImg6,
    title: 'Borda Lake Countryside & Bonfire Lawn',
    category: 'landscape',
    tag: 'Bonfire Lawn',
    desc: 'Open lawn spaces for evening campfires and gatherings'
  },
];

// Selected 5-Image Mosaic Grid Preview items mapped to full gallery index
const MOSAIC_PREVIEW_ITEMS = [
  { item: GALLERY_IMAGES[0], index: 0 },
  { item: GALLERY_IMAGES[1], index: 1 },
  { item: GALLERY_IMAGES[4], index: 4 },
  { item: GALLERY_IMAGES[2], index: 2 },
  { item: GALLERY_IMAGES[5], index: 5 },
];

export const NilawarFarmsDetails = ({ business: initialBusiness }: NilawarFarmsDetailsProps) => {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<Business | null>(initialBusiness || null);
  const [isLoading, setIsLoading] = useState(!initialBusiness);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (initialBusiness) {
      setBusiness(initialBusiness);
      setIsLoading(false);
      return;
    }

    const fetchNilawarData = async () => {
      try {
        setIsLoading(true);
        const querySlug = slug || 'nilawar-farms';
        let bizData: any = null;

        try {
          bizData = await businessService.getPublicBusinessBySlug(querySlug);
        } catch {
          const allBiz = await businessService.getPublicBusinesses();
          bizData = (Array.isArray(allBiz) ? allBiz : []).find(b =>
            b.slug === querySlug ||
            b.slug.includes('nilawar') ||
            b.name.toLowerCase().includes('nilawar')
          ) || null;
        }

        if (bizData) {
          setBusiness(bizData);
        }
      } catch (err) {
        console.error('Failed to load Nilawar Farms data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNilawarData();
  }, [slug, initialBusiness]);

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
    setCurrentImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  }, []);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

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
    return <LoadingSpinner message="Loading Nilawar Farms details..." />;
  }

  return (
    <div className="nilawar-details-page">
      {/* ================= 1. COMPACT HEADER ================= */}
      <header className="nilawar-header-container">
        <div className="nilawar-header-main">
          <div className="nilawar-header-info">
            <div className="nilawar-badge-row">
              <span className="nilawar-tag">Agritourism &amp; Nature Stay</span>
              <span className="nilawar-verified-badge">
                <Sparkles size={13} /> Verified Property
              </span>
            </div>
            <h1 className="nilawar-title">Nilawar Farms</h1>
            <div className="nilawar-meta-row">
              <span className="nilawar-meta-item">
                <MapPin size={15} className="nilawar-meta-icon" />
                Behind Borda Lake, Mul Road, Chandrapur
              </span>
            </div>
          </div>

          <div className="nilawar-header-actions">
          </div>
        </div>
      </header>

      {/* ================= 2. CREATIVE PHOTO SHOWCASE (LUXURY 5-IMAGE MOSAIC) ================= */}
      <section className="nilawar-mosaic-showcase" aria-label="Photo Showcase Gallery">
        <div className="nilawar-mosaic-grid">
          {MOSAIC_PREVIEW_ITEMS.map(({ item, index }, idx) => (
            <div
              key={idx}
              className={`nilawar-mosaic-item nilawar-mosaic-item-${idx} ${idx === 0 ? 'nilawar-mosaic-hero' : ''}`}
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              aria-label={`View photo: ${item.title}`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="nilawar-mosaic-img"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              <div className="nilawar-mosaic-badge">
                <span>{item.tag}</span>
              </div>
              <div className="nilawar-mosaic-overlay">
                <div className="nilawar-mosaic-caption">
                  <h4 className="nilawar-mosaic-title">{item.title}</h4>
                  <p className="nilawar-mosaic-desc">{item.desc}</p>
                </div>
                <div className="nilawar-mosaic-zoom-icon" title="View Fullscreen">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating View All Photos Button */}
        <button
          type="button"
          className="nilawar-mosaic-view-all-btn"
          onClick={() => openLightbox(0)}
          aria-label={`View all ${GALLERY_IMAGES.length} photos`}
        >
          <LayoutGrid size={15} />
          <span>Show all {GALLERY_IMAGES.length} photos</span>
        </button>
      </section>

      {/* ================= 3. COMPACT HIGHLIGHTS STRIP ================= */}
      <div className="nilawar-quick-strip">
        <div className="nilawar-quick-item">
          <span className="nilawar-quick-label">Category</span>
          <span className="nilawar-quick-value">Pool Farmstay &amp; Resort</span>
        </div>
        <div className="nilawar-quick-divider" />
        <div className="nilawar-quick-item">
          <span className="nilawar-quick-label">Nearest Safari Gate</span>
          <span className="nilawar-quick-value">Mamla Buffer Gate</span>
        </div>
        <div className="nilawar-quick-divider" />
        <div className="nilawar-quick-item">
          <span className="nilawar-quick-label">Stay Formats</span>
          <span className="nilawar-quick-value">Deluxe Rooms, Cottages &amp; Villa</span>
        </div>
        <div className="nilawar-quick-divider" />
        <div className="nilawar-quick-item">
          <span className="nilawar-quick-label">Pet Policy</span>
          <span className="nilawar-quick-value">Pet-Friendly Stay</span>
        </div>
      </div>

      {/* ================= 4. MAIN CONTENT & SIDEBAR ================= */}
      <div className="nilawar-layout-grid">
        {/* Left Main Column */}
        <div className="nilawar-main-col">
          {/* Room Availability / Booking System */}
          <div className="nilawar-rooms-wrapper">
            <RoomAvailability
              businessId={business?.id || 'nilawar-farms'}
              businessName={business?.name || 'Nilawar Farms'}
            />
          </div>

          {/* About & Key Highlights Combined Card */}
          <section className="nilawar-card">
            <div className="nilawar-card-header">
              <span className="nilawar-card-eyebrow">The Property</span>
              <h2 className="nilawar-card-title">About Nilawar Farms</h2>
            </div>
            <div className="nilawar-description">
              <p>
                Nilawar Farms is a farm-style stay set in the Borda area of Chandrapur district, on the Mul Road side of the Tadoba Andhari Tiger Reserve landscape. The property offers a serene green getaway with lush gardens, a swimming pool, and comfortable countryside stays.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="nilawar-highlights-box">
              <h3 className="nilawar-highlights-title">
                <Sparkles size={16} /> Key Highlights &amp; Features
              </h3>
              <div className="nilawar-highlights-grid">
                <div className="nilawar-highlight-item">
                  <Check size={15} className="nilawar-highlight-check" />
                  <span>Swimming pool with open garden and sun deck</span>
                </div>
                <div className="nilawar-highlight-item">
                  <Check size={15} className="nilawar-highlight-check" />
                  <span>Positioned near the Mamla Gate side of Tadoba</span>
                </div>
                <div className="nilawar-highlight-item">
                  <Check size={15} className="nilawar-highlight-check" />
                  <span>Deluxe rooms, rustic cottages, dorms &amp; villa</span>
                </div>
                <div className="nilawar-highlight-item">
                  <Check size={15} className="nilawar-highlight-check" />
                  <span>Pet-friendly property with spacious open lawns</span>
                </div>
                <div className="nilawar-highlight-item">
                  <Check size={15} className="nilawar-highlight-check" />
                  <span>In-house dining with fresh local food options</span>
                </div>
                <div className="nilawar-highlight-item">
                  <Check size={15} className="nilawar-highlight-check" />
                  <span>Event hosting for celebrations &amp; retreats</span>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities & Facilities */}
          <section className="nilawar-card">
            <div className="nilawar-card-header">
              <span className="nilawar-card-eyebrow">Facilities</span>
              <h2 className="nilawar-card-title">Amenities &amp; Guest Comforts</h2>
            </div>
            <div className="nilawar-amenities-grid">
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Sparkles size={16} /></div>
                <span className="nilawar-amenity-label">Swimming Pool</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Wind size={16} /></div>
                <span className="nilawar-amenity-label">Air-Conditioned Rooms</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Wifi size={16} /></div>
                <span className="nilawar-amenity-label">Free Wi-Fi</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Car size={16} /></div>
                <span className="nilawar-amenity-label">Free Private Parking</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Utensils size={16} /></div>
                <span className="nilawar-amenity-label">In-House Dining</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Dog size={16} /></div>
                <span className="nilawar-amenity-label">Pet-Friendly Stay</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><PartyPopper size={16} /></div>
                <span className="nilawar-amenity-label">Celebration Spaces</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Flame size={16} /></div>
                <span className="nilawar-amenity-label">Bonfire on Request</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><TreePine size={16} /></div>
                <span className="nilawar-amenity-label">Gardens &amp; Lawn Trails</span>
              </div>
              <div className="nilawar-amenity-item">
                <div className="nilawar-amenity-icon-wrap"><Bed size={16} /></div>
                <span className="nilawar-amenity-label">Group Villa Format</span>
              </div>
            </div>
          </section>

          {/* Location & Safari Gates */}
          <section className="nilawar-card">
            <div className="nilawar-card-header">
              <span className="nilawar-card-eyebrow">Location</span>
              <h2 className="nilawar-card-title">Address &amp; Safari Proximity</h2>
            </div>
            <div className="nilawar-location-box">
              <div className="nilawar-location-row">
                <MapPin size={18} className="nilawar-loc-pin" />
                <div>
                  <h4 className="nilawar-loc-subtitle">Full Address</h4>
                  <p className="nilawar-loc-text">Behind Borda Lake, Chak Borda village, Mul Road, Chandrapur, Maharashtra – 442404</p>
                </div>
              </div>
              <div className="nilawar-gate-note">
                <Compass size={18} className="nilawar-gate-icon" />
                <span>
                  <strong>Safari Proximity:</strong> Located on the Mul Road side, positioned close to Tadoba's <strong>Mamla Buffer Gate</strong> (Moharli Zone). Safari permits and transfers can be planned directly with the property or booked via official forest portals.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Plan Your Stay */}
        <aside className="nilawar-sidebar">
          <div className="nilawar-host-card">
            <div className="nilawar-host-badge">
              <Sparkles size={14} />
              <span>Direct Property Connect</span>
            </div>
            <h3 className="nilawar-host-title">Plan Your Tadoba Stay</h3>
            <p className="nilawar-host-desc">
              Connect directly with Nilawar Farms for room reservations, group villa bookings, bonfire requests, and stay queries.
            </p>

            <button
              type="button"
              className="nilawar-sidebar-btn"
              onClick={() => setShowInquiryModal(true)}
            >
              <Send size={15} />
              <span>Submit Stay Inquiry</span>
            </button>

            <div className="nilawar-sidebar-perks">
              <div className="nilawar-perk-item">
                <Check size={14} className="nilawar-perk-icon" />
                <span>Zero Booking Surcharge</span>
              </div>
              <div className="nilawar-perk-item">
                <Check size={14} className="nilawar-perk-icon" />
                <span>Direct Host Communication</span>
              </div>
              <div className="nilawar-perk-item">
                <Check size={14} className="nilawar-perk-icon" />
                <span>Mamla Gate Travel Assistance</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ================= 5. INQUIRY MODAL ================= */}
      {showInquiryModal && (
        <BusinessInquiryForm
          businessId={business?.id || 'nilawar-farms'}
          businessName="Nilawar Farms"
          onClose={() => setShowInquiryModal(false)}
        />
      )}

      {/* ================= 6. LIGHTBOX MODAL ================= */}
      {isLightboxOpen && (
        <div className="nilawar-lightbox-backdrop" onClick={closeLightbox}>
          <button
            type="button"
            className="nilawar-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close photo view"
          >
            <X size={24} />
          </button>

          <div
            className="nilawar-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="nilawar-lightbox-nav"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="nilawar-lightbox-wrapper">
              <img
                src={GALLERY_IMAGES[currentImageIndex].src}
                alt={GALLERY_IMAGES[currentImageIndex].title}
                className="nilawar-lightbox-img"
              />
              <span className="nilawar-lightbox-counter">
                {currentImageIndex + 1} / {GALLERY_IMAGES.length} — {GALLERY_IMAGES[currentImageIndex].title}
              </span>
            </div>

            <button
              type="button"
              className="nilawar-lightbox-nav"
              onClick={nextImage}
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

export default NilawarFarmsDetails;
