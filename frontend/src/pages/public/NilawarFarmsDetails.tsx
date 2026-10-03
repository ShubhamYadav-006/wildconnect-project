/* ==========================================================
   NilawarFarmsDetails Component
   ----------------------------------------------------------
   WildConnect Wildlife Tourism Platform
   Dedicated, responsive Resort & Farmstay details page for Nilawar Farms
   Clean, full-width responsive layout suitable for all devices (Mobile, Tablet, Desktop)
   ========================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessService, Business } from '../../services/business.service';
import { useAuth } from '../../hooks/useAuth';
import {
  MapPin,
  Compass,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  TreePine,
  Utensils,
  Wind,
  Wifi,
  Car,
  Flame,
  Clock,
  ArrowRight,
  Calendar,
  Users,
  Building,
  CheckCircle2,
  Sparkles,
  Binoculars,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Dog,
  LayoutGrid
} from 'lucide-react';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getImageUrl, DEFAULT_RESORT_IMAGE } from '../../utils/imageUrl';

// Direct High-Resolution Assets for Nilawar Farms
import farmImg1 from '../../assets/NilawarFarmsImages/Nilawarfarms (1).png';
import farmImg2 from '../../assets/NilawarFarmsImages/Nilawarfarms (2).png';
import farmImg3 from '../../assets/NilawarFarmsImages/Nilawarfarms (3).png';
import farmImg4 from '../../assets/NilawarFarmsImages/Nilawarfarms (4).png';
import farmImg5 from '../../assets/NilawarFarmsImages/Nilawarfarms (5).png';
import farmImg6 from '../../assets/NilawarFarmsImages/Nilawarfarms (6).png';
import farmImg7 from '../../assets/NilawarFarmsImages/Nilawarfarms (7).jpg';
import farmImg8 from '../../assets/NilawarFarmsImages/Nilawarfarms (8).jpg';
import farmImg10 from '../../assets/NilawarFarmsImages/Nilawarfarms (10).jpg';
import farmImg18 from '../../assets/NilawarFarmsImages/Nilawarfarms (18).jpg';
import farmImg21 from '../../assets/NilawarFarmsImages/Nilawarfarms (21).jpg';
import farmImg30 from '../../assets/NilawarFarmsImages/Nilawarfarms (30).jpg';

// Component Stylesheet
import '../../styles/public/NilawarFarmsDetails.css';

interface NilawarFarmsDetailsProps {
  business?: Business | null;
  destination?: any;
}

interface GalleryItem {
  src: string;
  title: string;
  tag: string;
  desc: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    src: farmImg1,
    title: 'Farmstay Front View & Greenery',
    tag: 'Estate Overview',
    desc: 'Lush greenery and open countryside ambiance at Borda near Tadoba'
  },
  {
    src: farmImg2,
    title: 'Deluxe AC Room & Garden Sit-Out',
    tag: 'Deluxe AC Room',
    desc: 'Spacious air-conditioned rooms opening directly to manicured lawns'
  },
  {
    src: farmImg3,
    title: 'Rustic Wooden Cottage Bedroom',
    tag: 'Wooden Cottage',
    desc: 'Warm wooden cottage interiors crafted for cozy wilderness stays'
  },
  {
    src: farmImg4,
    title: 'Standalone Cottage & Verandah',
    tag: 'Private Cottage',
    desc: 'Independent cottage units with private shaded sit-outs'
  },
  {
    src: farmImg5,
    title: 'Swimming Pool & Outdoor Dining',
    tag: 'Pool & Lounge',
    desc: 'Refreshing swimming pool with deck chairs and open-air seating'
  },
  {
    src: farmImg6,
    title: 'Borda Countryside & Bonfire Lawn',
    tag: 'Bonfire Lawn',
    desc: 'Open lawn spaces for evening campfires and family gatherings'
  },
  {
    src: farmImg7,
    title: 'Lush Farmstay Gardens',
    tag: 'Orchards & Flora',
    desc: 'Fresh agricultural plantation and flowering garden walkways'
  },
  {
    src: farmImg8,
    title: 'Outdoor Dining & Open Sit-out',
    tag: 'Al Fresco Dining',
    desc: 'Open-air dining areas surrounded by green trees and cool breeze'
  },
  {
    src: farmImg10,
    title: 'Farmstay Evening Ambiance',
    tag: 'Twilight View',
    desc: 'Peaceful evening skies over the Borda countryside estate'
  },
  {
    src: farmImg18,
    title: 'Cozy Room Interiors',
    tag: 'Room Comforts',
    desc: 'Comfortable bedding, clean washrooms, and peaceful amenities'
  },
  {
    src: farmImg21,
    title: 'Swimming Pool Side Deck',
    tag: 'Poolside Deck',
    desc: 'Sun decks and shaded seating areas around the private pool'
  },
  {
    src: farmImg30,
    title: 'Farmstay Lawns & Activities',
    tag: 'Activities Lawn',
    desc: 'Expansive grassy grounds for outdoor games and relaxation'
  }
];

const PREVIEW_IMAGES = [
  { item: GALLERY_IMAGES[0], index: 0 },
  { item: GALLERY_IMAGES[1], index: 1 },
  { item: GALLERY_IMAGES[4], index: 4 }
];

export const NilawarFarmsDetails: React.FC<NilawarFarmsDetailsProps> = ({
  business: initialBusiness,
  destination: initialDestination
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [business, setBusiness] = useState<Business | null>(initialBusiness || null);
  const [destination, setDestination] = useState<any>(initialDestination || null);
  const [relatedStays, setRelatedStays] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(!initialBusiness);

  // Modal & Lightbox states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Fetch Nilawar data if not passed
  useEffect(() => {
    if (initialBusiness) {
      setBusiness(initialBusiness);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const querySlug = slug || 'nilawar-farms';
        let bizData: any = null;

        try {
          bizData = await businessService.getPublicBusinessBySlug(querySlug);
        } catch {
          const allBiz = await businessService.getPublicBusinesses();
          bizData =
            (Array.isArray(allBiz) ? allBiz : []).find(
              (b) =>
                b.slug === querySlug ||
                b.slug.includes('nilawar') ||
                b.name.toLowerCase().includes('nilawar')
            ) || null;
        }

        if (bizData) {
          setBusiness(bizData);
          if (bizData.destination) setDestination(bizData.destination);
        }
      } catch (err) {
        console.error('Failed to load Nilawar Farms data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, initialBusiness]);

  // Fetch Other Stays in Tadoba for "Explore More"
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await businessService.getPublicBusinesses({ type: 'RESORT' });
        const filtered = (Array.isArray(data) ? data : []).filter(
          (b) => b.id !== business?.id && !b.slug.includes('nilawar') && (!b.status || b.status === 'APPROVED')
        );
        setRelatedStays(filtered.slice(0, 3));
      } catch {
        // non-blocking
      }
    };

    fetchRelated();
  }, [business?.id]);

  // Lightbox Navigation
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
    return <LoadingSpinner message="Loading Nilawar Farms Agritourism details..." />;
  }

  const destinationName = destination?.name || 'Tadoba National Park';
  const destinationSlug = destination?.slug || 'tadoba';

  return (
    <div className="nilawar-details-page">
      {/* ==========================================================
          1. BREADCRUMBS
         ========================================================== */}
      <nav className="nilawar-breadcrumbs" aria-label="Breadcrumb Navigation">
        <div className="nilawar-breadcrumbs-container">
          <Link to="/" className="nilawar-crumb-link">Home</Link>
          <span className="nilawar-crumb-sep">/</span>
          <Link to="/destinations" className="nilawar-crumb-link">Destinations</Link>
          <span className="nilawar-crumb-sep">/</span>
          <Link to={`/destinations/${destinationSlug}`} className="nilawar-crumb-link">
            {destinationName}
          </Link>
          <span className="nilawar-crumb-sep">/</span>
          <Link to="/businesses?type=RESORT" className="nilawar-crumb-link">Resorts</Link>
          <span className="nilawar-crumb-sep">/</span>
          <span className="nilawar-crumb-current" aria-current="page">Nilawar Farms</span>
        </div>
      </nav>

      {/* ==========================================================
          2. RESORT HERO
         ========================================================== */}
      <header className="nilawar-hero-header">
        <div className="nilawar-hero-meta-row">
          <div className="nilawar-hero-location">
            <MapPin size={15} className="nilawar-hero-loc-icon" />
            <span>Borda, Mul Road, Tadoba, Maharashtra</span>
          </div>

          <div className="nilawar-hero-verified-badge" title="WildConnect Verified Property">
            <ShieldCheck size={14} />
            <span>Verified Partner</span>
          </div>
        </div>

        <div className="nilawar-hero-title-row">
          <div className="nilawar-hero-title-content">
            <h1 className="nilawar-main-title">Nilawar Farms</h1>

          </div>

          <div className="nilawar-hero-cta-box">
            <button
              type="button"
              className="nilawar-btn-primary-cta"
              onClick={() => setShowInquiryModal(true)}
            >
              <Calendar size={16} />
              <span>Inquire / Plan Your Stay</span>
            </button>
            <a
              href={`https://wa.me/919422112233?text=${encodeURIComponent(
                'Hi Nilawar Farms, I am interested in inquiring about a stay and safari booking.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nilawar-btn-whatsapp-hero"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Host</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==========================================================
          3. PHOTO GALLERY (COMPACT 3-IMAGE SHOWCASE + LIGHTBOX)
         ========================================================== */}
      <section className="nilawar-gallery-section" aria-label="Photo Showcase Gallery">
        <div className="nilawar-mosaic-grid">
          {PREVIEW_IMAGES.map(({ item, index }, idx) => (
            <div
              key={idx}
              className={`nilawar-mosaic-item nilawar-mosaic-item-${idx}`}
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

        {/* Floating See More Photos Button */}
        <button
          type="button"
          className="nilawar-mosaic-view-all-btn"
          onClick={() => openLightbox(0)}
          aria-label={`See more photos (${GALLERY_IMAGES.length})`}
        >
          <LayoutGrid size={15} />
          <span>See more photos ({GALLERY_IMAGES.length})</span>
        </button>
      </section>

      {/* ==========================================================
          4. QUICK HIGHLIGHTS (COMPACT ICON CARDS)
         ========================================================== */}
      <section className="nilawar-highlights-strip" aria-label="Key Highlights">
        <div className="nilawar-highlights-grid">
          <div className="nilawar-highlight-card">
            <div className="nilawar-hl-icon-wrap">
              <MapPin size={20} />
            </div>
            <div className="nilawar-hl-content">
              <span className="nilawar-hl-label">Location</span>
              <span className="nilawar-hl-value">Borda, Near Tadoba</span>
            </div>
          </div>

          <div className="nilawar-highlight-card">
            <div className="nilawar-hl-icon-wrap">
              <Building size={20} />
            </div>
            <div className="nilawar-hl-content">
              <span className="nilawar-hl-label">Property Type</span>
              <span className="nilawar-hl-value">Farmstay / Resort</span>
            </div>
          </div>

          <div className="nilawar-highlight-card">
            <div className="nilawar-hl-icon-wrap">
              <Car size={20} />
            </div>
            <div className="nilawar-hl-content">
              <span className="nilawar-hl-label">Safari Access</span>
              <span className="nilawar-hl-value">Mamla Gate (~4km)</span>
            </div>
          </div>

          <div className="nilawar-highlight-card">
            <div className="nilawar-hl-icon-wrap">
              <Sparkles size={20} />
            </div>
            <div className="nilawar-hl-content">
              <span className="nilawar-hl-label">Key Facilities</span>
              <span className="nilawar-hl-value">Swimming Pool &amp; Lawns</span>
            </div>
          </div>

          <div className="nilawar-highlight-card">
            <div className="nilawar-hl-icon-wrap">
              <Utensils size={20} />
            </div>
            <div className="nilawar-hl-content">
              <span className="nilawar-hl-label">Dining</span>
              <span className="nilawar-hl-value">Varhadi &amp; Home-style Veg/Non-Veg</span>
            </div>
          </div>

          <div className="nilawar-highlight-card">
            <div className="nilawar-hl-icon-wrap">
              <Users size={20} />
            </div>
            <div className="nilawar-hl-content">
              <span className="nilawar-hl-label">Suitability</span>
              <span className="nilawar-hl-value">Families, Groups &amp; Pet Owners</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Full-Width Content Container */}
      <main className="nilawar-main-flow">
        {/* ==========================================================
            5. ABOUT THE PROPERTY
           ========================================================== */}
        <section className="nilawar-section-card" id="about-property">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <TreePine size={16} />
              <span>Overview</span>
            </div>
            <h2 className="nilawar-section-title">About Nilawar Farms</h2>
          </div>

          <div className="nilawar-about-prose">
            <p>
              Nilawar Farms is an agritourism resort situated near Borda Lake along Mul Road, offering a tranquil sanctuary just minutes away from Tadoba Andhari Tiger Reserve’s Mamla buffer gate.
            </p>
            <p>
              Spanning verdant agricultural lands with fruit orchards and manicured lawns, the property features a private swimming pool, air-conditioned cottages, open-air campfire zones, and farm-fresh Maharashtrian cuisine prepared on order.
            </p>
          </div>

          <div className="nilawar-about-bullet-grid">
            <div className="nilawar-about-bullet-item">
              <CheckCircle2 size={16} className="nilawar-bullet-check" />
              <span>Direct 5-minute proximity to Mamla Safari Gate</span>
            </div>
            <div className="nilawar-about-bullet-item">
              <CheckCircle2 size={16} className="nilawar-bullet-check" />
              <span>Private swimming pool with lounge area &amp; open showers</span>
            </div>
            <div className="nilawar-about-bullet-item">
              <CheckCircle2 size={16} className="nilawar-bullet-check" />
              <span>Pet-friendly property with spacious outdoor gardens</span>
            </div>
            <div className="nilawar-about-bullet-item">
              <CheckCircle2 size={16} className="nilawar-bullet-check" />
              <span>Home-cooked Maharashtrian, Varhadi &amp; Saoji dishes</span>
            </div>
          </div>
        </section>
        {/* ==========================================================
            7. AMENITIES & FACILITIES (ICON GRID)
           ========================================================== */}
        <section className="nilawar-section-card" id="amenities">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <Sparkles size={16} />
              <span>Comfort &amp; Convenience</span>
            </div>
            <h2 className="nilawar-section-title">Amenities &amp; Facilities</h2>
          </div>

          <div className="nilawar-amenities-grid">
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Sparkles size={20} /></div>
              <span className="nilawar-amenity-tile-label">Private Swimming Pool</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Wind size={20} /></div>
              <span className="nilawar-amenity-tile-label">Air-Conditioned Rooms</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Dog size={20} /></div>
              <span className="nilawar-amenity-tile-label">Pet Friendly Grounds</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Flame size={20} /></div>
              <span className="nilawar-amenity-tile-label">Evening Bonfire &amp; BBQ</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Utensils size={20} /></div>
              <span className="nilawar-amenity-tile-label">In-House Farm Kitchen</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Car size={20} /></div>
              <span className="nilawar-amenity-tile-label">Free Secure Parking</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><TreePine size={20} /></div>
              <span className="nilawar-amenity-tile-label">Spacious Event Lawns</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Wifi size={20} /></div>
              <span className="nilawar-amenity-tile-label">Free Wi-Fi</span>
            </div>
            <div className="nilawar-amenity-tile">
              <div className="nilawar-amenity-tile-icon"><Binoculars size={20} /></div>
              <span className="nilawar-amenity-tile-label">Safari Booking Assistance</span>
            </div>
          </div>
        </section>

        {/* ==========================================================
            6. ACCOMMODATION & ROOM TYPES
           ========================================================== */}
        <section className="nilawar-section-card" id="rooms">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <Building size={16} />
              <span>Accommodations</span>
            </div>
            <h2 className="nilawar-section-title">Available Room Types</h2>
            <p className="nilawar-section-sub">
              Nilawar Farms offers a variety of air-conditioned stay formats for travelers, couples, and groups:
            </p>
          </div>

          <div className="nilawar-room-types-grid">
            <div className="nilawar-room-type-item">
              <div className="nilawar-room-type-icon">
                <Building size={20} />
              </div>
              <div className="nilawar-room-type-info">
                <h4>Deluxe Rooms</h4>
                <p>Comfortable air-conditioned rooms opening to lush lawns with private ensuite bathrooms.</p>
              </div>
            </div>

            <div className="nilawar-room-type-item">
              <div className="nilawar-room-type-icon">
                <TreePine size={20} />
              </div>
              <div className="nilawar-room-type-info">
                <h4>Cottages</h4>
                <p>Private wooden and rustic cottages featuring outdoor sit-out decks near the pool area.</p>
              </div>
            </div>

            <div className="nilawar-room-type-item">
              <div className="nilawar-room-type-icon">
                <Sparkles size={20} />
              </div>
              <div className="nilawar-room-type-info">
                <h4>Villa</h4>
                <p>Spacious private villa setup with dedicated living space for families and private groups.</p>
              </div>
            </div>

            <div className="nilawar-room-type-item">
              <div className="nilawar-room-type-icon">
                <Users size={20} />
              </div>
              <div className="nilawar-room-type-info">
                <h4>Dormitory</h4>
                <p>Large multi-bed accommodation equipped with AC and facilities for corporate &amp; large group stays.</p>
              </div>
            </div>
          </div>
        </section>



        {/* ==========================================================
            8. EXPERIENCES & SERVICES
           ========================================================== */}
        <section className="nilawar-section-card" id="experiences">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <Binoculars size={16} />
              <span>Curated Activities</span>
            </div>
            <h2 className="nilawar-section-title">Experiences &amp; Services</h2>
            <p className="nilawar-section-sub">
              Agritourism relaxation combined with authentic Tadoba jungle safari arrangements.
            </p>
          </div>

          <div className="nilawar-experiences-split-grid">
            {/* Column 1: Wildlife & Safari */}
            <div className="nilawar-exp-column">
              <div className="nilawar-exp-col-header">
                <Binoculars size={18} className="nilawar-exp-col-icon" />
                <h3>Wildlife &amp; Safari</h3>
              </div>
              <ul className="nilawar-exp-list">
                <li className="nilawar-exp-item">
                  <CheckCircle2 size={16} className="nilawar-exp-check" />
                  <div>
                    <strong>Mamla Buffer Gate Safaris</strong>
                    <p>Experience tiger and leopard tracking just 5 minutes from the farm.</p>
                  </div>
                </li>
                <li className="nilawar-exp-item">
                  <CheckCircle2 size={16} className="nilawar-exp-check" />
                  <div>
                    <strong>Borda Lake Birdwatching Walks</strong>
                    <p>Stroll to the nearby lake for morning waterfowl and migratory bird sightings.</p>
                  </div>
                </li>
                <li className="nilawar-exp-item">
                  <CheckCircle2 size={16} className="nilawar-exp-check" />
                  <div>
                    <strong>Night Buffer Drive Support</strong>
                    <p>Guided night drives in adjoining forest buffer corridors.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Property Services */}
            <div className="nilawar-exp-column">
              <div className="nilawar-exp-col-header">
                <Building size={18} className="nilawar-exp-col-icon" />
                <h3>Farm &amp; Property Services</h3>
              </div>
              <ul className="nilawar-exp-list">
                <li className="nilawar-exp-item">
                  <CheckCircle2 size={16} className="nilawar-exp-check" />
                  <div>
                    <strong>Swimming Pool &amp; Sun Deck</strong>
                    <p>Cool off after dusty morning safaris in the clean, private pool.</p>
                  </div>
                </li>
                <li className="nilawar-exp-item">
                  <CheckCircle2 size={16} className="nilawar-exp-check" />
                  <div>
                    <strong>Campfire &amp; Open-air Barbecue</strong>
                    <p>Evening bonfire setups with barbecue options under starlit skies.</p>
                  </div>
                </li>
                <li className="nilawar-exp-item">
                  <CheckCircle2 size={16} className="nilawar-exp-check" />
                  <div>
                    <strong>Organic Agritourism Walks</strong>
                    <p>Explore seasonal plantation crops and fruit orchards with the host family.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==========================================================
            9. LOCATION & SAFARI ACCESS
           ========================================================== */}
        <section className="nilawar-section-card" id="location">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <MapPin size={16} />
              <span>Geographic Advantage</span>
            </div>
            <h2 className="nilawar-section-title">Location &amp; Safari Access</h2>
          </div>

          <div className="nilawar-location-content-box">
            <div className="nilawar-location-info-grid">
              <div className="nilawar-loc-item">
                <span className="nilawar-loc-label">Address</span>
                <span className="nilawar-loc-val">Borda, Mul Road, Chandrapur District, Maharashtra 442401</span>
              </div>
              <div className="nilawar-loc-item">
                <span className="nilawar-loc-label">Nearest Safari Gate</span>
                <span className="nilawar-loc-val">Mamla Buffer Gate (~2.5 km / 5 minutes)</span>
              </div>
              <div className="nilawar-loc-item">
                <span className="nilawar-loc-label">Other Nearby Safari Gates</span>
                <span className="nilawar-loc-val">Agarzari (18 km), Moharli Core (22 km), Junona (15 km)</span>
              </div>
              <div className="nilawar-loc-item">
                <span className="nilawar-loc-label">Transit Connectivity</span>
                <span className="nilawar-loc-val">Chandrapur Junction (14 km) / Nagpur Airport (150 km)</span>
              </div>
            </div>

            <div className="nilawar-map-cta-bar">
              <div className="nilawar-map-text">
                <Compass size={18} />
                <span>Located conveniently on Mul Road with smooth highway connectivity.</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Nilawar+Farms+Borda+Chandrapur"
                target="_blank"
                rel="noopener noreferrer"
                className="nilawar-btn-map"
              >
                <span>View on Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ==========================================================
            10. FOOD & DINING
           ========================================================== */}
        <section className="nilawar-section-card" id="dining">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <Utensils size={16} />
              <span>Culinary Experience</span>
            </div>
            <h2 className="nilawar-section-title">Food &amp; Dining</h2>
            <p className="nilawar-section-sub">
              Freshly cooked home-style Maharashtrian dishes prepared with local farm ingredients.
            </p>
          </div>

          <div className="nilawar-dining-grid">
            <div className="nilawar-dining-card">
              <span className="nilawar-dining-type">Breakfast</span>
              <h4>Safari Morning Specials</h4>
              <p>Hot Poha, Upma, Parathas, Boiled Eggs &amp; Masala Tea served fresh before or after your safari.</p>
            </div>

            <div className="nilawar-dining-card">
              <span className="nilawar-dining-type">Lunch &amp; Dinner</span>
              <h4>Varhadi &amp; Saoji Delights</h4>
              <p>Authentic spicy Varhadi chicken/mutton curries, Bhakri, fresh dal tadka, and seasonal vegetables.</p>
            </div>

            <div className="nilawar-dining-card">
              <span className="nilawar-dining-type">Dietary Care</span>
              <h4>Veg &amp; Custom Requests</h4>
              <p>Dedicated vegetarian cookware with customized spice levels for kids and families upon notice.</p>
            </div>
          </div>
        </section>

        {/* ==========================================================
            11. POLICIES & IMPORTANT INFORMATION (APPROACHABLE VISUAL GRID)
           ========================================================== */}
        <section className="nilawar-section-card" id="policies">
          <div className="nilawar-section-header">
            <div className="nilawar-section-badge">
              <ShieldCheck size={16} />
              <span>Guidelines &amp; Policies</span>
            </div>
            <h2 className="nilawar-section-title">Policies &amp; Important Information</h2>
            <p className="nilawar-section-sub">
              Clear stay rules and guidelines to ensure a relaxed and seamless farmstay experience.
            </p>
          </div>

          <div className="nilawar-policies-grid">
            {/* Policy 1: Timings */}
            <div className="nilawar-policy-card">
              <div className="nilawar-policy-header">
                <div className="nilawar-policy-icon">
                  <Clock size={20} />
                </div>
                <div className="nilawar-policy-title-wrap">
                  <span className="nilawar-policy-tag">Stay Schedule</span>
                  <h3 className="nilawar-policy-title">Check-in &amp; Check-out</h3>
                </div>
              </div>
              <div className="nilawar-policy-timing-row">
                <div className="nilawar-timing-badge">
                  <span className="nilawar-timing-label">Check-in</span>
                  <span className="nilawar-timing-time">1:00 PM</span>
                </div>
                <div className="nilawar-timing-badge">
                  <span className="nilawar-timing-label">Check-out</span>
                  <span className="nilawar-timing-time">11:00 AM</span>
                </div>
              </div>
              <p className="nilawar-policy-desc">
                Early check-in or late check-out is accommodated based on room availability upon request.
              </p>
            </div>

            {/* Policy 2: Pet Friendly */}
            <div className="nilawar-policy-card">
              <div className="nilawar-policy-header">
                <div className="nilawar-policy-icon">
                  <Dog size={20} />
                </div>
                <div className="nilawar-policy-title-wrap">
                  <span className="nilawar-policy-tag nilawar-tag-pet">100% Pet Friendly</span>
                  <h3 className="nilawar-policy-title">Pet Guidelines</h3>
                </div>
              </div>
              <p className="nilawar-policy-desc">
                Pets are warmly welcomed across the farmstay grounds. Please keep dogs on leash in common lawn areas and maintain basic pet hygiene.
              </p>
              <div className="nilawar-policy-highlight-pill">
                <span>Free roaming allowed in private cottage sit-outs</span>
              </div>
            </div>

            {/* Policy 3: Pool & Common Areas */}
            <div className="nilawar-policy-card">
              <div className="nilawar-policy-header">
                <div className="nilawar-policy-icon">
                  <Sparkles size={20} />
                </div>
                <div className="nilawar-policy-title-wrap">
                  <span className="nilawar-policy-tag">Recreation</span>
                  <h3 className="nilawar-policy-title">Swimming Pool &amp; Lawns</h3>
                </div>
              </div>
              <div className="nilawar-policy-timing-row">
                <div className="nilawar-timing-badge">
                  <span className="nilawar-timing-label">Pool Hours</span>
                  <span className="nilawar-timing-time">7:00 AM – 8:00 PM</span>
                </div>
              </div>
              <p className="nilawar-policy-desc">
                Appropriate swimwear is required before entering the pool. Children must be accompanied by adults at all times.
              </p>
            </div>

            {/* Policy 4: Booking & Terms */}
            <div className="nilawar-policy-card">
              <div className="nilawar-policy-header">
                <div className="nilawar-policy-icon">
                  <AlertCircle size={20} />
                </div>
                <div className="nilawar-policy-title-wrap">
                  <span className="nilawar-policy-tag">Reservation</span>
                  <h3 className="nilawar-policy-title">Booking &amp; Cancellation</h3>
                </div>
              </div>
              <p className="nilawar-policy-desc">
                A small advance token is required to confirm room &amp; home-cooked meal arrangements with the host.
              </p>
              <div className="nilawar-policy-highlight-pill">
                <span>Flexible date rescheduling supported for emergencies</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            12. TRUST & VERIFICATION CARD
           ========================================================== */}
        <section className="nilawar-trust-section" aria-label="Trust and Verification Standards">
          <div className="nilawar-trust-card">
            <div className="nilawar-trust-left">
              <div className="nilawar-trust-badge-icon">
                <ShieldCheck size={32} />
              </div>
              <div className="nilawar-trust-text">
                <h3>WildConnect Verified Agritourism Partner</h3>
                <p>
                  Nilawar Farms is physically inspected and verified for hospitality standards, swimming pool cleanliness, pet safety, and proximity to Tadoba’s Mamla buffer gate.
                </p>
                <div className="nilawar-trust-meta">
                  <span><strong>Audit Status:</strong> Verified &amp; Compliant</span>
                  <span><strong>Listing ID:</strong> WC-FARM-NILAWAR</span>
                </div>
              </div>
            </div>
            <div className="nilawar-trust-points">
              <div className="nilawar-trust-point-item">
                <CheckCircle2 size={16} />
                <span>Direct connect with local farm management</span>
              </div>
              <div className="nilawar-trust-point-item">
                <CheckCircle2 size={16} />
                <span>5-minute drive to Mamla Gypsy Entry Point</span>
              </div>
              <div className="nilawar-trust-point-item">
                <CheckCircle2 size={16} />
                <span>100% transparent rates with no booking markup</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            13. EXPLORE MORE (OTHER TADOBA STAYS & DESTINATION LINK)
           ========================================================== */}
        <section className="nilawar-explore-section" aria-label="Explore Similar Accommodations">
          <div className="nilawar-explore-header">
            <div>
              <span className="nilawar-explore-sub">More in {destinationName}</span>
              <h2 className="nilawar-explore-title">Explore Other Tadoba Stays</h2>
            </div>
            <Link to={`/destinations/${destinationSlug}`} className="nilawar-explore-dest-btn">
              <span>Explore {destinationName}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="nilawar-explore-grid">
            {relatedStays.length > 0 ? (
              relatedStays.map((item) => (
                <Link key={item.id} to={`/resorts/${item.slug}`} className="nilawar-explore-card">
                  <div className="nilawar-explore-img-wrap">
                    <img
                      src={getImageUrl(item.coverImage || item.images?.[0], DEFAULT_RESORT_IMAGE)}
                      alt={item.name}
                      className="nilawar-explore-img"
                      loading="lazy"
                    />
                    <div className="nilawar-explore-tag">{item.category || item.type || 'Lodge'}</div>
                  </div>
                  <div className="nilawar-explore-body">
                    <h4 className="nilawar-explore-card-title">{item.name}</h4>
                    <div className="nilawar-explore-loc">
                      <MapPin size={13} />
                      <span>{item.address || 'Tadoba Buffer, Maharashtra'}</span>
                    </div>
                    <div className="nilawar-explore-link-row">
                      <span>View Stay Details</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="nilawar-explore-single-banner">
                <div className="nilawar-explore-banner-content">
                  <h3>Discover Tadoba National Park</h3>
                  <p>Learn about Moharli, Kolara, Navegaon &amp; buffer gate safari bookings and local travel guides.</p>
                  <Link to="/destinations/tadoba" className="nilawar-btn-banner">
                    <span>Explore Tadoba Destination Guide</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ==========================================================
          INQUIRY MODAL (Triggered by CTAs)
         ========================================================== */}
      {showInquiryModal && (
        <BusinessInquiryForm
          businessId={business?.id || 'nilawar-farms'}
          businessName="Nilawar Farms"
          onClose={() => setShowInquiryModal(false)}
          defaultName={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''}
          defaultEmail={user?.email || ''}
        />
      )}

      {/* ==========================================================
          FULLSCREEN LIGHTBOX MODAL
         ========================================================== */}
      {isLightboxOpen && (
        <div
          className="nilawar-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox Gallery"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            className="nilawar-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            className="nilawar-lightbox-arrow nilawar-lightbox-prev"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="nilawar-lightbox-stage">
            <img
              src={GALLERY_IMAGES[currentImageIndex].src}
              alt={GALLERY_IMAGES[currentImageIndex].title}
              className="nilawar-lightbox-img"
            />
            <div className="nilawar-lightbox-caption">
              <div>
                <strong>{GALLERY_IMAGES[currentImageIndex].title}</strong>
                <p>{GALLERY_IMAGES[currentImageIndex].desc}</p>
              </div>
              <span className="nilawar-lightbox-counter">
                {currentImageIndex + 1} / {GALLERY_IMAGES.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="nilawar-lightbox-arrow nilawar-lightbox-next"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NilawarFarmsDetails;
