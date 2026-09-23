/* ==========================================================
   Businesses (Local Services & Stays) Component
   ----------------------------------------------------------
   Purpose:
   Super minimal, clean directory for destination services:
   1. Stays & Resorts (RESORT)
   2. Camera & Gear Rentals (CAMERA_RENTAL)
   3. Safari Cabs & Transport (TAXI)
   ========================================================== */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import {
  MapPin,
  Search,
  Star,
  ArrowRight,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Component Stylesheet
import '../../styles/public/Businesses.css';

interface ServiceCategoryTab {
  id: string;
  label: string;
  typeValue: string;
}

const SERVICE_TABS: ServiceCategoryTab[] = [
  { id: 'all', label: 'All Services', typeValue: '' },
  { id: 'resorts', label: 'Stays & Resorts', typeValue: 'RESORT' },
  { id: 'cameras', label: 'Camera Rentals', typeValue: 'CAMERA_RENTAL' },
  { id: 'taxis', label: 'Safari Cabs', typeValue: 'TAXI' }
];

const Businesses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const destinationQuery = searchParams.get('destination') || searchParams.get('destinationId') || '';
  const initialType = searchParams.get('type') || '';

  // Data states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // UI / Filter states
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState(initialType);
  const [searchKeyword, setSearchKeyword] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
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

  // Fetch all destinations for selector dropdown
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoadingDestinations(true);
        const destRes = await destinationService.getAll();
        const list = destRes.data || destRes;
        setDestinations(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error('Failed to load destinations:', error);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  // When destinationQuery changes, fetch businesses for selected destination
  useEffect(() => {
    if (!destinationQuery) {
      setSelectedDestination(null);
      setBusinesses([]);
      return;
    }

    const fetchDestinationServices = async () => {
      try {
        setLoadingBusinesses(true);

        let currentDest = destinations.find(
          d => d.slug === destinationQuery || d.id === destinationQuery
        );

        if (!currentDest) {
          try {
            const destRes = await destinationService.getBySlug(destinationQuery);
            if (destRes?.data) {
              currentDest = destRes.data;
            } else if (destRes?.id) {
              currentDest = destRes;
            }
          } catch {
            // fallback
          }
        }

        setSelectedDestination(currentDest || null);

        const filterParams: { destination?: string; destinationId?: string; destinationSlug?: string } = {
          destination: destinationQuery,
          destinationSlug: destinationQuery,
        };
        if (currentDest?.id) {
          filterParams.destinationId = currentDest.id;
        }

        const data = await businessService.getPublicBusinesses(filterParams);
        const approvedList = (Array.isArray(data) ? data : []).filter(
          b => !b.status || b.status === 'APPROVED'
        );
        setBusinesses(approvedList);
      } catch (error) {
        console.error('Error fetching destination businesses:', error);
        setBusinesses([]);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchDestinationServices();
  }, [destinationQuery, destinations]);

  // Handle destination selection
  const handleSelectDestination = (dest: Destination) => {
    setIsDropdownOpen(false);
    setSelectedDestination(dest);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('destination', dest.slug);
    setSearchParams(newParams);
  };

  // Handle category tab change
  const handleTabChange = (typeVal: string) => {
    setFilterType(typeVal);
    const newParams = new URLSearchParams(searchParams);
    if (typeVal) {
      newParams.set('type', typeVal);
    } else {
      newParams.delete('type');
    }
    setSearchParams(newParams);
  };

  // Card click navigation
  const handleCardClick = (biz: Business) => {
    if (biz.type === 'RESORT') {
      navigate(`/resorts/${biz.slug}`);
    } else {
      navigate(`/businesses/${biz.slug}`);
    }
  };

  // Filter businesses by active category tab and search query
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(biz => {
      if (filterType && biz.type !== filterType) {
        return false;
      }
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesName = biz.name.toLowerCase().includes(q);
        const matchesDesc = biz.description && biz.description.toLowerCase().includes(q);
        const matchesAddr = biz.address && biz.address.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesAddr) return false;
      }
      return true;
    });
  }, [businesses, filterType, searchKeyword]);

  // Badge label helper
  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'RESORT':
        return 'Resort';
      case 'CAMERA_RENTAL':
        return 'Camera Rental';
      case 'TAXI':
        return 'Safari Cab';
      default:
        return type.replace('_', ' ');
    }
  };

  const destinationTitle = selectedDestination
    ? selectedDestination.name
    : destinationQuery.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="minimal-services-page">
      {/* ==========================================
          1. Minimal Hero & Destination Selector
         ========================================== */}
      <section className="minimal-services-hero">
        <h1 className="minimal-services-title">Tourism Services</h1>
        <p className="minimal-services-subtitle">
          Select a destination to view verified jungle stays, camera rentals, and taxi services.
        </p>

        {/* Minimal Dropdown Selector */}
        <div className="minimal-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`minimal-dropdown-trigger ${isDropdownOpen ? 'open' : ''} ${selectedDestination ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <div className="minimal-trigger-left">
              <MapPin size={18} className="minimal-trigger-icon" />
              <span className="minimal-trigger-text">
                {loadingDestinations
                  ? 'Loading destinations...'
                  : selectedDestination
                    ? selectedDestination.name
                    : 'Choose a Destination'}
              </span>
            </div>
            <div className="minimal-trigger-actions">
              {selectedDestination && (
                <button
                  type="button"
                  className="minimal-trigger-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDestination(null);
                    setBusinesses([]);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('destination');
                    newParams.delete('destinationId');
                    setSearchParams(newParams);
                  }}
                  title="Clear destination"
                  aria-label="Clear destination"
                >
                  <X size={14} />
                </button>
              )}
              <ChevronDown size={16} className={`minimal-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="minimal-dropdown-popup">
              <div className="minimal-dropdown-list">
                {loadingDestinations ? (
                  <div className="minimal-dropdown-loading">Loading...</div>
                ) : (
                  destinations.map(dest => {
                    const isSelected = selectedDestination?.slug === dest.slug || selectedDestination?.id === dest.id;
                    return (
                      <div
                        key={dest.id || dest.slug}
                        className={`minimal-dropdown-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectDestination(dest)}
                      >
                        <span className="minimal-item-name">{dest.name}</span>
                        {dest.state && <span className="minimal-item-state">{dest.state}</span>}
                        {isSelected && <Check size={14} className="minimal-item-check" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          2. Content Section (Rendered only when a destination is chosen)
         ========================================== */}
      {destinationQuery && (
        <section className="minimal-listings-section">
          {/* Controls Bar: Tabs + Search */}
          <div className="minimal-controls-bar">
            {/* Category Tabs */}
            <div className="minimal-category-tabs">
              {SERVICE_TABS.map(tab => {
                const isActive = filterType === tab.typeValue;
                return (
                  <button
                    key={tab.id}
                    className={`minimal-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.typeValue)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Clean Inline Search */}
            <div className="minimal-search-box">
              <Search size={15} className="minimal-search-icon" />
              <input
                type="text"
                placeholder={`Search in ${destinationTitle}...`}
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="minimal-search-input"
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="minimal-clear-btn"
                  onClick={() => setSearchKeyword('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Results State */}
          {loadingBusinesses ? (
            <div className="minimal-loading-wrap">
              <LoadingSpinner message="Loading services..." />
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="minimal-empty-wrap">
              <p className="minimal-empty-text">
                No services found for {destinationTitle}
                {filterType ? ` in ${SERVICE_TABS.find(t => t.typeValue === filterType)?.label}` : ''}.
              </p>
              {(searchKeyword || filterType) && (
                <button
                  className="minimal-reset-btn"
                  onClick={() => {
                    setFilterType('');
                    setSearchKeyword('');
                  }}
                >
                  Show all services
                </button>
              )}
            </div>
          ) : (
            <div className="minimal-grid">
              {filteredBusinesses.map(biz => {
                const badgeLabel = getBadgeLabel(biz.type);
                const cardImg =
                  biz.coverImage ||
                  (biz.images && biz.images[0]) ||
                  'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=800';

                return (
                  <div
                    key={biz.id || biz.slug}
                    className="minimal-card"
                    onClick={() => handleCardClick(biz)}
                  >
                    {/* Media */}
                    <div className="minimal-card-media">
                      <img src={cardImg} alt={biz.name} loading="lazy" />
                      <span className={`minimal-type-badge type-${biz.type.toLowerCase()}`}>
                        {badgeLabel}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="minimal-card-body">
                      <div className="minimal-card-top">
                        <h3 className="minimal-card-title">{biz.name}</h3>
                        {biz.starRating && (
                          <div className="minimal-rating">
                            <Star size={12} fill="#D99A3D" color="#D99A3D" />
                            <span>{biz.starRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <div className="minimal-card-loc">
                        <MapPin size={13} />
                        <span>{biz.address || destinationTitle}</span>
                      </div>

                      {/* Footer: Inquire Action */}
                      <div className="minimal-card-footer">
                        <span className="minimal-inquiry-tag">Inquire for Rates</span>

                        <div className="minimal-arrow-link">
                          <span>Inquire Now</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Businesses;
