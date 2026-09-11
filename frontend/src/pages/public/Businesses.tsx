import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import { MapPin, Search, Star } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import '../../styles/public/Businesses.css';

const BUSINESS_TYPES = [
  'RESORT', 'HOTEL', 'HOMESTAY', 'TAXI', 'GUIDE', 
  'CAMERA_RENTAL', 'RESTAURANT', 'WILDLIFE_EXPERIENCE', 'OTHER'
];

const Businesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('');
  const [filterDestination, setFilterDestination] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const destRes = await destinationService.getAll();
        setDestinations(destRes.data || destRes);
      } catch (error) {
        console.error('Failed to load destinations', error);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const data = await businessService.getPublicBusinesses({
          type: filterType || undefined,
          destinationId: filterDestination || undefined
        });
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [filterType, filterDestination]);

  return (
    <div className="public-businesses-page fade-in">
      {/* Hero Section */}
      <section className="businesses-hero">
        <div className="businesses-hero-content">
          <h1>Discover Local Experiences</h1>
          <p>Find trusted stays, expert guides, and essential services for your wildlife adventure.</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="businesses-filter-section">
        <div className="filter-container">
          <div className="filter-group">
            <Search size={20} className="filter-icon" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Services</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <MapPin size={20} className="filter-icon" />
            <select value={filterDestination} onChange={(e) => setFilterDestination(e.target.value)}>
              <option value="">All Destinations</option>
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id}>{dest.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="businesses-main-content">
        {loading ? (
          <LoadingSpinner message="Finding local partners..." />
        ) : businesses.length === 0 ? (
          <div className="businesses-empty-state">
            <Search size={48} className="empty-icon" />
            <h2>No businesses found</h2>
            <p>We couldn't find any services matching your criteria. Try adjusting your filters.</p>
            <button className="btn-clear" onClick={() => { setFilterType(''); setFilterDestination(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="businesses-grid">
            {businesses.map((biz) => {
              const destName = destinations.find(d => d.id === biz.destinationId)?.name;
              
              return (
                <div 
                  key={biz.id} 
                  className="business-card" 
                  onClick={() => navigate(`/businesses/${biz.slug}`)}
                >
                  <div className="business-card-image">
                    {biz.coverImage ? (
                      <img src={biz.coverImage} alt={biz.name} loading="lazy" />
                    ) : (
                      <div className="business-image-placeholder">No Image</div>
                    )}
                    <span className="business-card-type">{biz.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="business-card-content">
                    <h3 className="business-card-title">{biz.name}</h3>
                    
                    <div className="business-card-meta">
                      {destName && (
                        <span className="business-card-location">
                          <MapPin size={14} /> {destName}
                        </span>
                      )}
                      {biz.starRating && (
                        <span className="business-card-rating">
                          <Star size={14} fill="#f59e0b" color="#f59e0b" /> {biz.starRating}
                        </span>
                      )}
                    </div>
                    
                    <p className="business-card-desc">
                      {biz.description.length > 100 
                        ? `${biz.description.substring(0, 100)}...` 
                        : biz.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Businesses;
