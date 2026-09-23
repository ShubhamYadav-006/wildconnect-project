import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { destinationService, type Destination } from '../../services/destination.service';
import { businessService, type Business } from '../../services/business.service';
import {
  MapPin,
  ChevronDown,
  Star,
  ArrowRight,
  Wifi,
  Coffee,
  Car,
  ShieldCheck,
  Sparkles,
  Tent,
  Check
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Component Stylesheet
import '../../styles/public/Resorts.css';

const Resorts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const destinationQuery = searchParams.get('destination') || searchParams.get('destinationId') || '';

  // Data states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // UI states
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load all available destinations for destination picker
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoadingDestinations(true);
        const res = await destinationService.getAll();
        const destList: Destination[] = res.data || res;
        setDestinations(Array.isArray(destList) ? destList : []);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchDestinations();
  }, []);

  // When destinationQuery or destinations change, load destination & approved accommodations
  useEffect(() => {
    if (!destinationQuery) {
      setSelectedDestination(null);
      setBusinesses([]);
      return;
    }

    const fetchDestinationAccommodations = async () => {
      try {
        setLoadingBusinesses(true);

        // Find destination info from loaded list or fetch by slug
        let currentDest = destinations.find(
          d => d.slug === destinationQuery || d.id === destinationQuery
        );

        if (!currentDest) {
          try {
            const destRes = await destinationService.getBySlug(destinationQuery);
            if (destRes?.data) {
              currentDest = destRes.data;
            }
          } catch {
            // Slug fetch fallback
          }
        }

        setSelectedDestination(currentDest || null);

        // Fetch APPROVED accommodations for this destination
        const filterPayload: { category: string; destinationSlug?: string; destinationId?: string } = {
          category: 'accommodation'
        };

        if (currentDest) {
          filterPayload.destinationSlug = currentDest.slug;
        } else {
          filterPayload.destinationSlug = destinationQuery;
        }

        const businessData = await businessService.getPublicBusinesses(filterPayload);

        // Strict client-side filter to guarantee only approved accommodation types
        const approvedAccommodations = (Array.isArray(businessData) ? businessData : []).filter(
          b => b.status === 'APPROVED' && b.type === 'RESORT'
        );

        setBusinesses(approvedAccommodations);
      } catch (err) {
        console.error('Failed to fetch accommodations:', err);
        setBusinesses([]);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchDestinationAccommodations();
  }, [destinationQuery, destinations]);

  // Handle selecting a destination from the dropdown
  const handleSelectDestination = (slug: string) => {
    setIsDropdownOpen(false);
    setSearchParams({ destination: slug });
  };

  // Helper for star rating display
  const renderStars = (rating?: number) => {
    const starsCount = rating && rating > 0 ? rating : 4;
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`resort-card-star-icon ${i < starsCount ? 'active' : 'inactive'}`}
      />
    ));
  };

  // Helper for amenity icons
  const renderAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi size={14} className="amenity-icon" />;
    if (a.includes('dining') || a.includes('restaurant') || a.includes('breakfast') || a.includes('food')) return <Coffee size={14} className="amenity-icon" />;
    if (a.includes('safari') || a.includes('parking') || a.includes('drive') || a.includes('cab')) return <Car size={14} className="amenity-icon" />;
    return <Sparkles size={14} className="amenity-icon" />;
  };

  // Helper for business type display badge
  const getTypeBadge = (_type: string, meta?: any) => {
    return { label: meta?.category || 'Wilderness Stay', icon: <Tent size={13} /> };
  };

  const destinationTitle = selectedDestination
    ? selectedDestination.name
    : (destinationQuery ? destinationQuery.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '');

  return (
    <div className="resorts-single-page">
      {/* ==========================================================
         TOP HERO SECTION: Destination Selection Dropdown
         ========================================================== */}
      <section className="resorts-hero-section">

        <h1 className="resorts-hero-title">
          Where are you going for safari?
        </h1>

        <p className="resorts-hero-subtitle">
          Select your destination to discover verified eco-resorts, luxury jungle lodges, and authentic homestays near safari gates.
        </p>

        {/* Interactive Destination Selector Dropdown */}
        <div className="resorts-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`resorts-dropdown-trigger ${isDropdownOpen ? 'open' : ''} ${selectedDestination ? 'has-selection' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="resorts-dropdown-trigger-left">
              <MapPin className="resorts-dropdown-trigger-icon" size={20} />
              <div className="resorts-dropdown-trigger-texts">
                <span className="resorts-dropdown-trigger-label">
                  {selectedDestination ? 'Selected Safari Destination' : 'Select Destination'}
                </span>
                <span className="resorts-dropdown-trigger-value">
                  {loadingDestinations
                    ? 'Loading safari destinations...'
                    : selectedDestination
                      ? selectedDestination.name
                      : `Choose from ${destinations.length} available destinations...`}
                </span>
              </div>
            </div>

            <div className="resorts-dropdown-trigger-right">
              {selectedDestination && (
                <span className="resorts-dropdown-change-hint">Change</span>
              )}
              <ChevronDown className={`resorts-dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} size={20} />
            </div>
          </button>

          {/* Dropdown Menu Popup */}
          {isDropdownOpen && (
            <div className="resorts-dropdown-menu" role="listbox">
              <div className="resorts-dropdown-header">
                <span>All Safari Destinations ({destinations.length})</span>
              </div>

              <div className="resorts-dropdown-list">
                {loadingDestinations ? (
                  <div className="resorts-dropdown-empty">
                    Loading destinations...
                  </div>
                ) : destinations.length === 0 ? (
                  <div className="resorts-dropdown-empty">
                    No destinations available on the system.
                  </div>
                ) : (
                  destinations.map((dest) => {
                    const isSelected = selectedDestination?.slug === dest.slug || selectedDestination?.id === dest.id;
                    return (
                      <div
                        key={dest.id || dest.slug}
                        className={`resorts-dropdown-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectDestination(dest.slug)}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSelectDestination(dest.slug);
                          }
                        }}
                      >
                        <div className="dropdown-item-thumb-wrap">
                          <img
                            src={
                              dest.coverImage ||
                              (dest.images && dest.images[0]) ||
                              'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=200'
                            }
                            alt={dest.name}
                            className="dropdown-item-thumb"
                          />
                        </div>

                        <div className="dropdown-item-info">
                          <span className="dropdown-item-name">{dest.name}</span>
                          {dest.state && (
                            <span className="dropdown-item-state">
                              <MapPin size={11} /> {dest.state}
                            </span>
                          )}
                        </div>

                        {isSelected ? (
                          <div className="dropdown-item-check">
                            <Check size={16} />
                          </div>
                        ) : (
                          <ArrowRight size={16} className="dropdown-item-arrow" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================================
         BOTTOM SECTION: Accommodations for Selected Destination
         ========================================================== */}
      {destinationQuery && (
        <section className="resorts-listings-section" ref={listingsRef}>
          <div className="resorts-listings-wrapper">
            {/* Destination Heading & Filter Pills */}
            <div className="resorts-listings-header">
              <div className="resorts-listings-header-top">
                <div className="resorts-listings-badge">
                  <ShieldCheck size={15} />
                  <span>Approved Hospitality Partners</span>
                </div>
                <h2 className="resorts-listings-title">
                  {destinationTitle} Accommodation
                </h2>
                <p className="resorts-listings-subtitle">
                  Verified jungle lodges and eco-resorts with prime safari gate accessibility in {destinationTitle}.
                </p>
              </div>

              {/* Stay count badge */}
              <div className="resorts-type-filter-group">
                <span className="resorts-type-pill active">
                  Verified Stays ({businesses.length})
                </span>
              </div>
            </div>

            {/* Content Display */}
            {loadingBusinesses ? (
              <div className="resorts-loading">
                <LoadingSpinner message={`Finding approved stays in ${destinationTitle}...`} />
              </div>
            ) : businesses.length === 0 ? (
              /* Empty state if no approved accommodations exist */
              <div className="resorts-empty-state">
                <div className="resorts-empty-icon-wrap">
                  <Tent size={44} className="resorts-empty-state-icon" />
                </div>
                <h3 className="resorts-empty-state-title">
                  No Approved Accommodations in {destinationTitle} Yet
                </h3>
                <p className="resorts-empty-state-text">
                  We are currently onboarding and verifying partner eco-resorts and jungle lodges in this region to ensure safety, comfort, and direct safari gate access.
                </p>
                {selectedDestination && (
                  <div className="resorts-empty-actions">
                    <Link
                      to={`/destinations/${selectedDestination.slug}`}
                      className="resorts-btn-outline"
                    >
                      <span>Explore {destinationTitle} Safari Guide</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* Accommodation Cards Grid */
              <div className="resorts-grid">
                {businesses.map((business, index) => {
                  const typeInfo = getTypeBadge(business.type, business.metadata);
                  const cardImage = business.coverImage || (business.images && business.images[0]) || 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=1000';

                  return (
                    <div
                      key={business.id || business.slug}
                      className="resort-card"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="resort-card-image-wrapper">
                        <img
                          src={cardImage}
                          alt={business.name}
                          className="resort-card-image"
                          loading="lazy"
                        />

                        {/* Business Type Badge */}
                        <div className="resort-card-type-tag">
                          {typeInfo.icon}
                          <span>{typeInfo.label}</span>
                        </div>

                        {/* Verified Badge */}
                        <div className="resort-card-verified-tag">
                          <ShieldCheck size={12} />
                          <span>Verified</span>
                        </div>
                      </div>

                      <div className="resort-card-content">
                        <div className="resort-card-top-row">
                          <h3 className="resort-card-title" title={business.name}>
                            {business.name}
                          </h3>
                          <div className="resort-card-stars">
                            {renderStars(business.starRating)}
                          </div>
                        </div>

                        <div className="resort-card-location">
                          <MapPin className="resort-card-location-icon" size={14} />
                          <span>
                            {business.address || (business.destination ? business.destination.name : destinationTitle)}
                          </span>
                        </div>

                        {business.description && (
                          <p className="resort-card-desc">
                            {business.description.length > 120
                              ? `${business.description.substring(0, 120)}...`
                              : business.description}
                          </p>
                        )}

                        {/* Amenities list */}
                        {business.amenities && business.amenities.length > 0 && (
                          <div className="resort-card-amenities">
                            {business.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="resort-card-amenity-badge">
                                {renderAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </span>
                            ))}
                            {business.amenities.length > 3 && (
                              <span className="resort-card-amenity-badge more">
                                +{business.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="resort-card-action">
                          <Link
                            to={`/resorts/${business.slug}`}
                            className="resort-card-btn"
                          >
                            <span>View Details & Rooms</span>
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Resorts;
