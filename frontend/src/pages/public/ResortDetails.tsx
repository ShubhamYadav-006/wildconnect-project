/* ==========================================================
   ResortDetails Page Component
   ----------------------------------------------------------
   WildConnect Wildlife Tourism Platform
   Unified, compact, professional Resort / Accommodation Details
   engine powering all wildlife stays (Zeal Tadoba, Singh Estate,
   Tadoba Wilderness, Svasara, etc.) with 100% architectural consistency.
   ========================================================== */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resortService, Resort } from '../../services/resort.service';
import { businessService, Business } from '../../services/business.service';
import { destinationService, Destination } from '../../services/destination.service';
import NilawarFarmsDetails from './NilawarFarmsDetails';
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
  Coffee,
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
  Trees
} from 'lucide-react';
import BusinessInquiryForm from '../../components/ui/BusinessInquiryForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getImageUrl, DEFAULT_RESORT_IMAGE } from '../../utils/imageUrl';

// Component Stylesheet
import '../../styles/public/ResortDetails.css';

interface RoomTypeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const ResortDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  // Data states
  const [resort, setResort] = useState<Resort | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [relatedStays, setRelatedStays] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Interactive states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Fetch Resort/Business Details
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setIsLoading(true);

      // 1. Check custom Nilawar Farms override
      if (
        slug === 'nilawar-farms' ||
        slug === 'nilawar-farms-1' ||
        slug.toLowerCase().includes('nilawar')
      ) {
        try {
          let bizData: any = null;
          try {
            bizData = await businessService.getPublicBusinessBySlug(slug);
          } catch {
            const allBiz = await businessService.getPublicBusinesses();
            bizData =
              (Array.isArray(allBiz) ? allBiz : []).find(
                (b) =>
                  b.slug === slug ||
                  b.slug.startsWith(slug) ||
                  b.name.toLowerCase().includes('nilawar')
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
        } catch (err) {
          console.error('Error fetching custom resort data:', err);
        }
      }

      // 2. Fetch from Business API (Primary partner source)
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
      } catch {
        // Fallback to Resort table below
      }

      // 3. Fetch from Resort API (Standard resort table)
      try {
        const response = await resortService.getBySlug(slug);
        if (response.success && response.data) {
          setResort(response.data);
          if (response.data.destination) {
            setDestination(response.data.destination);
          } else if (response.data.destinationId) {
            const destRes = await destinationService.getAll();
            const destData = destRes.data || destRes;
            const foundDest = destData.find((d: Destination) => d.id === response.data.destinationId);
            if (foundDest) setDestination(foundDest);
          }
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to load resort by slug:', err);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  // Fetch Related Stays for "Explore More"
  useEffect(() => {
    const fetchRelated = async () => {
      const destId = destination?.id || business?.destinationId || resort?.destinationId;
      if (!destId) return;

      try {
        const data = await businessService.getPublicBusinesses({
          destinationId: destId,
          type: 'RESORT'
        });
        const currentId = business?.id || resort?.id;
        const filtered = (Array.isArray(data) ? data : []).filter(
          (b) => b.id !== currentId && (!b.status || b.status === 'APPROVED')
        );
        setRelatedStays(filtered.slice(0, 3));
      } catch {
        // non-blocking
      }
    };

    fetchRelated();
  }, [destination, business, resort]);

  // Derived Normalized Data
  const propertyName = business?.name || resort?.name || 'Wilderness Stay';
  const propertyDescription =
    business?.description ||
    resort?.description ||
    'Experience the untouched beauty of nature in serene comfort surrounded by protected forest landscapes.';
  const destinationName =
    destination?.name ||
    business?.destination?.name ||
    resort?.destination?.name ||
    'Central India Tiger Reserve';
  const destinationSlug =
    destination?.slug || business?.destination?.slug || resort?.destination?.slug || '';
  const propertyAddress =
    business?.address || resort?.address || `${destinationName} Forest Buffer, India`;
  const propertyType = business?.category || business?.type || 'Luxury Wildlife Stay';
  const isVerified = business?.verified ?? true;
  const propertyPhone = business?.contactPhone || '+91 94221 12233';

  // Derived Gallery Images
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (business?.coverImage) list.push(getImageUrl(business.coverImage, DEFAULT_RESORT_IMAGE));
    if (resort?.coverImage) list.push(getImageUrl(resort.coverImage, DEFAULT_RESORT_IMAGE));

    const sourceImages = business?.images || resort?.images || [];
    sourceImages.forEach((img) => {
      const formatted = getImageUrl(img, DEFAULT_RESORT_IMAGE);
      if (formatted && !list.includes(formatted)) {
        list.push(formatted);
      }
    });

    return list.length > 0 ? list : [DEFAULT_RESORT_IMAGE];
  }, [business, resort]);

  // Derived Available Room Types (Clean 2x2 Grid)
  const roomTypes: RoomTypeItem[] = useMemo(() => {
    if (business?.rooms && business.rooms.length > 0) {
      const icons = [Building, TreePine, Sparkles, Users];
      return business.rooms.map((r, idx) => ({
        id: r.id || `room-${idx}`,
        name: r.name || `Deluxe Stay Unit ${idx + 1}`,
        description:
          r.description ||
          'Spacious, nature-inspired stay unit with peaceful forest views and ensuite hot water washroom.',
        icon: icons[idx % icons.length]
      }));
    }

    // Default 4 Room Types if none explicitly set in database
    return [
      {
        id: 'deluxe-rooms',
        name: 'Deluxe Rooms',
        description: 'Comfortable air-conditioned rooms opening to lush lawns with private ensuite bathrooms.',
        icon: Building
      },
      {
        id: 'cottages',
        name: 'Cottages',
        description: 'Private wooden and rustic cottages featuring outdoor sit-out decks near the pool area.',
        icon: TreePine
      },
      {
        id: 'villa',
        name: 'Villa',
        description: 'Spacious private villa setup with dedicated living space for families and private groups.',
        icon: Sparkles
      },
      {
        id: 'dormitory',
        name: 'Dormitory',
        description: 'Large multi-bed accommodation equipped with AC and facilities for corporate & large group stays.',
        icon: Users
      }
    ];
  }, [business]);

  // Derived Amenities
  const allAmenities = useMemo(() => {
    const list = new Set<string>();
    const srcList = business?.amenities || resort?.amenities || [];
    srcList.forEach((a) => list.add(a));

    if (list.size === 0) {
      [
        'Private Swimming Pool',
        'Air-Conditioned Rooms',
        'Pet Friendly Grounds',
        'Evening Bonfire & BBQ',
        'In-House Fresh Kitchen',
        'Free Secure Parking',
        'Spacious Event Lawns',
        'Free Wi-Fi',
        'Safari Booking Assistance'
      ].forEach((a) => list.add(a));
    }
    return Array.from(list);
  }, [business, resort]);

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
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

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

  // Dedicated custom showcase for Nilawar Farms
  if (
    slug === 'nilawar-farms' ||
    slug === 'nilawar-farms-1' ||
    (slug && slug.toLowerCase().includes('nilawar')) ||
    (business && business.name.toLowerCase().includes('nilawar'))
  ) {
    return <NilawarFarmsDetails business={business} destination={destination} />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading wilderness stay details..." />;
  }

  if (!business && !resort) {
    return (
      <div className="resort-details-not-found">
        <div className="resort-not-found-card">
          <TreePine size={48} className="resort-not-found-icon" />
          <h2>Resort Not Found</h2>
          <p>The wildlife lodge or accommodation you are looking for is unavailable or has been removed.</p>
          <Link to="/businesses?type=RESORT" className="resort-return-btn">
            Browse All Stays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="resort-details-page">
      {/* ==========================================================
          1. BREADCRUMBS
         ========================================================== */}
      <nav className="resort-breadcrumbs" aria-label="Breadcrumb Navigation">
        <div className="resort-breadcrumbs-container">
          <Link to="/" className="resort-crumb-link">Home</Link>
          <span className="resort-crumb-sep">/</span>
          <Link to="/destinations" className="resort-crumb-link">Destinations</Link>
          {destinationName && (
            <>
              <span className="resort-crumb-sep">/</span>
              {destinationSlug ? (
                <Link to={`/destinations/${destinationSlug}`} className="resort-crumb-link">
                  {destinationName}
                </Link>
              ) : (
                <span className="resort-crumb-text">{destinationName}</span>
              )}
            </>
          )}
          <span className="resort-crumb-sep">/</span>
          <Link to="/businesses?type=RESORT" className="resort-crumb-link">Resorts</Link>
          <span className="resort-crumb-sep">/</span>
          <span className="resort-crumb-current" aria-current="page">{propertyName}</span>
        </div>
      </nav>

      {/* ==========================================================
          2. RESORT HERO
         ========================================================== */}
      <header className="resort-hero-header">
        <div className="resort-hero-meta-row">
          <div className="resort-hero-location">
            <MapPin size={15} className="resort-hero-loc-icon" />
            <span>{propertyAddress}</span>
          </div>

          {isVerified && (
            <div className="resort-hero-verified-badge" title="WildConnect Verified Property">
              <ShieldCheck size={14} />
              <span>Verified Partner</span>
            </div>
          )}
        </div>

        <div className="resort-hero-title-row">
          <div className="resort-hero-title-content">
            <h1 className="resort-main-title">{propertyName}</h1>
            <p className="resort-hero-tagline">
              {business?.shortDescription || propertyDescription.slice(0, 150) + '...'}
            </p>
          </div>

          <div className="resort-hero-cta-box">
            <button
              type="button"
              className="resort-btn-primary-cta"
              onClick={() => setShowInquiryModal(true)}
            >
              <Calendar size={16} />
              <span>Inquire / Plan Your Stay</span>
            </button>
            <a
              href={`https://wa.me/${propertyPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hi! I am inquiring about booking a stay at ${propertyName} via WildConnect.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="resort-btn-whatsapp-hero"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Host</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==========================================================
          3. PHOTO GALLERY (CLEAN 3-IMAGE SHOWCASE MOSAIC)
         ========================================================== */}
      <section className="resort-gallery-section" aria-label="Resort Photo Showcase">
        <div className="resort-mosaic-grid">
          {galleryImages.slice(0, 3).map((imgUrl, idx) => (
            <div
              key={idx}
              className="resort-mosaic-item"
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            >
              <img
                src={imgUrl}
                alt={`${propertyName} photo ${idx + 1}`}
                className="resort-mosaic-img"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              <div className="resort-mosaic-overlay">
                <div className="resort-mosaic-caption">
                  <div className="resort-mosaic-title">{propertyName}</div>
                  <p className="resort-mosaic-desc">Photo {idx + 1} of {galleryImages.length}</p>
                </div>
                <div className="resort-mosaic-zoom-icon">
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          ))}

          {/* Floating View All Photos Button */}
          <button
            type="button"
            className="resort-mosaic-view-all-btn"
            onClick={() => openLightbox(0)}
            aria-label={`View all ${galleryImages.length} photos`}
          >
            <Maximize2 size={14} />
            <span>View All Photos ({galleryImages.length})</span>
          </button>
        </div>
      </section>

      {/* ==========================================================
          4. QUICK HIGHLIGHTS (6-CARD COMPACT GRID)
         ========================================================== */}
      <section className="resort-highlights-strip" aria-label="Key Highlights">
        <div className="resort-highlights-grid">
          <div className="resort-highlight-card">
            <div className="resort-hl-icon-wrap"><MapPin size={18} /></div>
            <div className="resort-hl-content">
              <span className="resort-hl-label">Location</span>
              <span className="resort-hl-value">{destinationName}</span>
            </div>
          </div>

          <div className="resort-highlight-card">
            <div className="resort-hl-icon-wrap"><Building size={18} /></div>
            <div className="resort-hl-content">
              <span className="resort-hl-label">Property Type</span>
              <span className="resort-hl-value">{propertyType}</span>
            </div>
          </div>

          <div className="resort-highlight-card">
            <div className="resort-hl-icon-wrap"><Car size={18} /></div>
            <div className="resort-hl-content">
              <span className="resort-hl-label">Safari Access</span>
              <span className="resort-hl-value">
                {business?.nearestGate || (business?.metadata as any)?.nearestGate || 'Buffer & Core Gates'}
              </span>
            </div>
          </div>

          <div className="resort-highlight-card">
            <div className="resort-hl-icon-wrap"><Sparkles size={18} /></div>
            <div className="resort-hl-content">
              <span className="resort-hl-label">Key Facilities</span>
              <span className="resort-hl-value">Pool, AC, Wi-Fi &amp; Gardens</span>
            </div>
          </div>

          <div className="resort-highlight-card">
            <div className="resort-hl-icon-wrap"><Utensils size={18} /></div>
            <div className="resort-hl-content">
              <span className="resort-hl-label">Dining</span>
              <span className="resort-hl-value">Home-Style Fresh Meals</span>
            </div>
          </div>

          <div className="resort-highlight-card">
            <div className="resort-hl-icon-wrap"><Users size={18} /></div>
            <div className="resort-hl-content">
              <span className="resort-hl-label">Suitability</span>
              <span className="resort-hl-value">Families, Couples &amp; Groups</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Single Flow Layout */}
      <div className="resort-main-flow">
        {/* ==========================================================
            5. ABOUT THE PROPERTY
           ========================================================== */}
        <section className="resort-section-card" id="about-property">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <TreePine size={15} />
              <span>Overview</span>
            </div>
            <h2 className="resort-section-title">About the Property</h2>
          </div>

          <div className="resort-about-prose">
            <p>{propertyDescription}</p>
          </div>

          <div className="resort-about-bullet-grid">
            <div className="resort-about-bullet-item">
              <CheckCircle2 size={16} className="resort-bullet-check" />
              <span>Strategically located with direct connectivity to wildlife safari gates</span>
            </div>
            <div className="resort-about-bullet-item">
              <CheckCircle2 size={16} className="resort-bullet-check" />
              <span>Dedicated assistance with Gypsy safari bookings &amp; local naturalist guides</span>
            </div>
            <div className="resort-about-bullet-item">
              <CheckCircle2 size={16} className="resort-bullet-check" />
              <span>Lush open lawns, peaceful natural surroundings, and clean amenities</span>
            </div>
            <div className="resort-about-bullet-item">
              <CheckCircle2 size={16} className="resort-bullet-check" />
              <span>Freshly cooked local cuisine and tailored food options on request</span>
            </div>
          </div>
        </section>

        {/* ==========================================================
            6. AMENITIES & FACILITIES
           ========================================================== */}
        <section className="resort-section-card" id="amenities">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <Sparkles size={15} />
              <span>Comfort &amp; Convenience</span>
            </div>
            <h2 className="resort-section-title">Amenities &amp; Facilities</h2>
          </div>

          <div className="resort-amenities-grid">
            {allAmenities.map((amenity, idx) => {
              const a = amenity.toLowerCase();
              let IconComponent = CheckCircle2;
              if (a.includes('wifi') || a.includes('internet')) IconComponent = Wifi;
              else if (a.includes('pool') || a.includes('swim')) IconComponent = Sparkles;
              else if (a.includes('food') || a.includes('restaurant') || a.includes('dining') || a.includes('kitchen')) IconComponent = Utensils;
              else if (a.includes('coffee') || a.includes('tea')) IconComponent = Coffee;
              else if (a.includes('safari') || a.includes('parking') || a.includes('car')) IconComponent = Car;
              else if (a.includes('ac') || a.includes('air')) IconComponent = Wind;
              else if (a.includes('fire') || a.includes('bonfire')) IconComponent = Flame;
              else if (a.includes('guide') || a.includes('naturalist')) IconComponent = Binoculars;
              else if (a.includes('pet')) IconComponent = Dog;
              else if (a.includes('lawn') || a.includes('garden')) IconComponent = Trees;

              return (
                <div key={idx} className="resort-amenity-tile">
                  <div className="resort-amenity-tile-icon">
                    <IconComponent size={18} />
                  </div>
                  <span className="resort-amenity-tile-label">{amenity}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================================
            7. AVAILABLE ROOM TYPES (CLEAN 2x2 GRID)
           ========================================================== */}
        <section className="resort-section-card" id="rooms">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <Building size={15} />
              <span>Accommodations</span>
            </div>
            <h2 className="resort-section-title">Available Room Types</h2>
            <p className="resort-section-sub">
              {propertyName} offers comfortable stay formats for wildlife travelers, couples, and groups:
            </p>
          </div>

          <div className="resort-room-types-grid">
            {roomTypes.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="resort-room-type-item">
                  <div className="resort-room-type-icon">
                    <IconComp size={20} />
                  </div>
                  <div className="resort-room-type-info">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================================
            8. EXPERIENCES & SERVICES
           ========================================================== */}
        <section className="resort-section-card" id="experiences">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <Binoculars size={15} />
              <span>Curated Activities</span>
            </div>
            <h2 className="resort-section-title">Experiences &amp; Services</h2>
            <p className="resort-section-sub">
              Verified on-ground wildlife safari arrangements and personalized lodge hospitality.
            </p>
          </div>

          <div className="resort-experiences-split-grid">
            {/* Column 1: Wildlife & Safari */}
            <div className="resort-exp-column">
              <div className="resort-exp-col-header">
                <Binoculars size={17} className="resort-exp-col-icon" />
                <h3>Wildlife &amp; Safari</h3>
              </div>
              <ul className="resort-exp-list">
                <li className="resort-exp-item">
                  <CheckCircle2 size={15} className="resort-exp-check" />
                  <div>
                    <strong>Open Gypsy Jungle Safaris</strong>
                    <p>Morning &amp; Afternoon safaris arranged with registered forest guides &amp; expert drivers.</p>
                  </div>
                </li>
                <li className="resort-exp-item">
                  <CheckCircle2 size={15} className="resort-exp-check" />
                  <div>
                    <strong>Guided Birding Walks</strong>
                    <p>Early morning bird trail through surrounding buffer flora and water bodies.</p>
                  </div>
                </li>
                <li className="resort-exp-item">
                  <CheckCircle2 size={15} className="resort-exp-check" />
                  <div>
                    <strong>Night Buffer Drive Assistance</strong>
                    <p>Explore nocturnal wildlife activity with verified safety protocols.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Property Services */}
            <div className="resort-exp-column">
              <div className="resort-exp-col-header">
                <Building size={17} className="resort-exp-col-icon" />
                <h3>Property Services</h3>
              </div>
              <ul className="resort-exp-list">
                <li className="resort-exp-item">
                  <CheckCircle2 size={15} className="resort-exp-check" />
                  <div>
                    <strong>Bush Breakfast &amp; Safari Packed Meals</strong>
                    <p>Fresh packed breakfasts prepared early morning for your safari ride.</p>
                  </div>
                </li>
                <li className="resort-exp-item">
                  <CheckCircle2 size={15} className="resort-exp-check" />
                  <div>
                    <strong>Evening Bonfire &amp; Wildlife Talks</strong>
                    <p>Gather by the hearth to discuss sightings, jungle calls, and conservation stories.</p>
                  </div>
                </li>
                <li className="resort-exp-item">
                  <CheckCircle2 size={15} className="resort-exp-check" />
                  <div>
                    <strong>Transfers &amp; Driver Accommodations</strong>
                    <p>Pre-arranged station/airport transfers and clean driver rest facilities.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==========================================================
            9. LOCATION & SAFARI ACCESS
           ========================================================== */}
        <section className="resort-section-card" id="location">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <MapPin size={15} />
              <span>Geographic Advantage</span>
            </div>
            <h2 className="resort-section-title">Location &amp; Safari Access</h2>
          </div>

          <div className="resort-location-content-box">
            <div className="resort-location-info-grid">
              <div className="resort-loc-item">
                <span className="resort-loc-label">Address</span>
                <span className="resort-loc-val">{propertyAddress}</span>
              </div>
              <div className="resort-loc-item">
                <span className="resort-loc-label">Nearest Safari Gate</span>
                <span className="resort-loc-val">
                  {business?.nearestGate || (business?.metadata as any)?.nearestGate || 'Buffer & Core Gates Nearby (approx. 5-15 mins)'}
                </span>
              </div>
              <div className="resort-loc-item">
                <span className="resort-loc-label">Destination Circuit</span>
                <span className="resort-loc-val">{destinationName} Tiger Reserve</span>
              </div>
              <div className="resort-loc-item">
                <span className="resort-loc-label">Transit Connectivity</span>
                <span className="resort-loc-val">Connected via smooth highway access &amp; local rail hubs</span>
              </div>
            </div>

            <div className="resort-map-cta-bar">
              <div className="resort-map-text">
                <Compass size={17} />
                <span>Located conveniently near main safari departure points.</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  propertyName + ' ' + propertyAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resort-btn-map"
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
        <section className="resort-section-card" id="dining">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <Utensils size={15} />
              <span>Culinary Experience</span>
            </div>
            <h2 className="resort-section-title">Food &amp; Dining</h2>
            <p className="resort-section-sub">
              Freshly cooked home-style regional delicacies and classic multi-cuisine selections.
            </p>
          </div>

          <div className="resort-dining-grid">
            <div className="resort-dining-card">
              <span className="resort-dining-type">Breakfast</span>
              <h4>Safari Morning Specials</h4>
              <p>Hot tea, coffee, poha, parathas, and breakfast packs served before or after morning safari.</p>
            </div>

            <div className="resort-dining-card">
              <span className="resort-dining-type">Lunch &amp; Dinner</span>
              <h4>Authentic Regional Feasts</h4>
              <p>Slow-cooked curries, warm rotis/bhakri, dal tadka, and seasonal garden vegetables.</p>
            </div>

            <div className="resort-dining-card">
              <span className="resort-dining-type">Dietary Care</span>
              <h4>Veg &amp; Custom Requests</h4>
              <p>Dedicated vegetarian preparation with customized spice levels for kids and families upon notice.</p>
            </div>
          </div>
        </section>

        {/* ==========================================================
            11. POLICIES & IMPORTANT INFORMATION (APPROACHABLE GRID)
           ========================================================== */}
        <section className="resort-section-card" id="policies">
          <div className="resort-section-header">
            <div className="resort-section-badge">
              <ShieldCheck size={15} />
              <span>Guidelines &amp; Policies</span>
            </div>
            <h2 className="resort-section-title">Policies &amp; Important Information</h2>
            <p className="resort-section-sub">
              Clear stay rules and guidelines to ensure a relaxed and seamless wilderness experience.
            </p>
          </div>

          <div className="resort-policies-grid">
            {/* Policy 1: Timings */}
            <div className="resort-policy-card">
              <div className="resort-policy-header">
                <div className="resort-policy-icon">
                  <Clock size={19} />
                </div>
                <div className="resort-policy-title-wrap">
                  <span className="resort-policy-tag">Stay Schedule</span>
                  <h3 className="resort-policy-title">Check-in &amp; Check-out</h3>
                </div>
              </div>
              <div className="resort-policy-timing-row">
                <div className="resort-timing-badge">
                  <span className="resort-timing-label">Check-in</span>
                  <span className="resort-timing-time">1:00 PM</span>
                </div>
                <div className="resort-timing-badge">
                  <span className="resort-timing-label">Check-out</span>
                  <span className="resort-timing-time">11:00 AM</span>
                </div>
              </div>
              <p className="resort-policy-desc">
                Early check-in or late check-out is accommodated based on room availability upon request.
              </p>
            </div>

            {/* Policy 2: Pet Friendly */}
            <div className="resort-policy-card">
              <div className="resort-policy-header">
                <div className="resort-policy-icon">
                  <Dog size={19} />
                </div>
                <div className="resort-policy-title-wrap">
                  <span className="resort-policy-tag resort-tag-pet">Stay Friendly</span>
                  <h3 className="resort-policy-title">Guest Guidelines</h3>
                </div>
              </div>
              <p className="resort-policy-desc">
                Loud music and outdoor noise are restricted after 10:00 PM to honor forest tranquility. Please inquire for pet permissions.
              </p>
              <div className="resort-policy-highlight-pill">
                <span>Respectful forest buffer &amp; eco-friendly zone</span>
              </div>
            </div>

            {/* Policy 3: Pool & Common Areas */}
            <div className="resort-policy-card">
              <div className="resort-policy-header">
                <div className="resort-policy-icon">
                  <Sparkles size={19} />
                </div>
                <div className="resort-policy-title-wrap">
                  <span className="resort-policy-tag">Recreation</span>
                  <h3 className="resort-policy-title">Pool &amp; Facilities</h3>
                </div>
              </div>
              <div className="resort-policy-timing-row">
                <div className="resort-timing-badge">
                  <span className="resort-timing-label">Hours</span>
                  <span className="resort-timing-time">7:00 AM – 8:00 PM</span>
                </div>
              </div>
              <p className="resort-policy-desc">
                Appropriate swimwear is required before entering the pool. Children must be accompanied by adults at all times.
              </p>
            </div>

            {/* Policy 4: Booking & Terms */}
            <div className="resort-policy-card">
              <div className="resort-policy-header">
                <div className="resort-policy-icon">
                  <AlertCircle size={19} />
                </div>
                <div className="resort-policy-title-wrap">
                  <span className="resort-policy-tag">Reservation</span>
                  <h3 className="resort-policy-title">Booking &amp; Cancellation</h3>
                </div>
              </div>
              <p className="resort-policy-desc">
                Advance confirmation required for room &amp; meal arrangements. Direct host support provided for date rescheduling in emergencies.
              </p>
              <div className="resort-policy-highlight-pill">
                <span>Flexible date rescheduling supported</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            12. TRUST & VERIFICATION CARD
           ========================================================== */}
        <section className="resort-trust-section" aria-label="Trust and Verification Standards">
          <div className="resort-trust-card">
            <div className="resort-trust-left">
              <div className="resort-trust-badge-icon">
                <ShieldCheck size={28} />
              </div>
              <div className="resort-trust-text">
                <h3>WildConnect Verified Partner Standard</h3>
                <p>
                  This property adheres to responsible wildlife tourism norms, transparent pricing, and ethical forest buffer practices.
                </p>
                <div className="resort-trust-meta">
                  <span><strong>Audit Status:</strong> Verified &amp; Compliant</span>
                  <span><strong>Listing ID:</strong> WC-STAY-{(business?.id || resort?.id || '000').slice(0, 8).toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="resort-trust-points">
              <div className="resort-trust-point-item">
                <CheckCircle2 size={15} />
                <span>Direct communication with verified hosts</span>
              </div>
              <div className="resort-trust-point-item">
                <CheckCircle2 size={15} />
                <span>Official forest department gate proximity</span>
              </div>
              <div className="resort-trust-point-item">
                <CheckCircle2 size={15} />
                <span>Zero hidden commissions on inquiries</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            13. EXPLORE MORE (SIMILAR STAYS & DESTINATION LINK)
           ========================================================== */}
        <section className="resort-explore-section" aria-label="Explore Similar Accommodations">
          <div className="resort-explore-header">
            <div>
              <span className="resort-explore-sub">More in {destinationName}</span>
              <h2 className="resort-explore-title">Explore Similar Wilderness Stays</h2>
            </div>
            {destinationSlug && (
              <Link to={`/destinations/${destinationSlug}`} className="resort-explore-dest-btn">
                <span>Explore {destinationName}</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="resort-explore-grid">
            {relatedStays.length > 0 ? (
              relatedStays.map((item) => (
                <Link key={item.id} to={`/resorts/${item.slug}`} className="resort-explore-card">
                  <div className="resort-explore-img-wrap">
                    <img
                      src={getImageUrl(item.coverImage || item.images?.[0], DEFAULT_RESORT_IMAGE)}
                      alt={item.name}
                      className="resort-explore-img"
                      loading="lazy"
                    />
                    <div className="resort-explore-tag">{item.category || item.type || 'Lodge'}</div>
                  </div>
                  <div className="resort-explore-body">
                    <h4 className="resort-explore-card-title">{item.name}</h4>
                    <div className="resort-explore-loc">
                      <MapPin size={12} />
                      <span>{item.address || destinationName}</span>
                    </div>
                    <div className="resort-explore-link-row">
                      <span>View Stay Details</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="resort-explore-single-banner">
                <div className="resort-explore-banner-content">
                  <h3>Discover {destinationName} Wildlife Circuit</h3>
                  <p>Explore jeep safari zones, verified guides, and travel itineraries curated by local experts.</p>
                  {destinationSlug && (
                    <Link to={`/destinations/${destinationSlug}`} className="resort-btn-banner">
                      <span>Explore Destination Guide</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ==========================================================
          FULLSCREEN LIGHTBOX MODAL
         ========================================================== */}
      {isLightboxOpen && (
        <div
          className="resort-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox Gallery"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            className="resort-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            className="resort-lightbox-arrow resort-lightbox-prev"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="resort-lightbox-stage">
            <img
              src={galleryImages[currentImageIndex]}
              alt={`${propertyName} slide ${currentImageIndex + 1}`}
              className="resort-lightbox-img"
            />
            <div className="resort-lightbox-caption">
              <span>{propertyName}</span>
              <span className="resort-lightbox-counter">
                {currentImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="resort-lightbox-arrow resort-lightbox-next"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* ==========================================================
          LEAD INQUIRY MODAL (BusinessInquiryForm)
         ========================================================== */}
      {showInquiryModal && (
        <BusinessInquiryForm
          businessId={business?.id || resort?.id || slug || 'resort-inquiry'}
          businessName={propertyName}
          onClose={() => setShowInquiryModal(false)}
          defaultEmail={user?.email || ''}
          defaultName={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''}
        />
      )}
    </div>
  );
};

export default ResortDetails;
