import { useState, useEffect } from 'react';
import { destinationService, Destination } from '../../services/destination.service';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Component styling
import "../../styles/public/Destinations.css";

// Fallback asset import
import tadobaImg from "../../assets/Tiger&Logo Image/Tadoba.jpg";

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationService.getAll();
        if (response && response.success && Array.isArray(response.data)) {
          const sorted = [...response.data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
          });
          setDestinations(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (isLoading) {
    return (
      <div className="destinations-loading">
        <div className="destinations-spinner"></div>
        <span>Loading wildlife destinations...</span>
      </div>
    );
  }

  return (
    <div className="destinations-page">
      <div className="destinations-container">
        {/* ==========================================================
            1. DESTINATION INTRO
           ========================================================== */}
        <section className="destinations-intro">
          <h1 className="destinations-intro-title">Explore Wildlife Destinations</h1>
          <p className="destinations-intro-subtitle">
            Discover India’s iconic forests, tiger reserves &amp; wildlife landscapes.
          </p>
        </section>

        {/* ==========================================================
            2. ALL WILDLIFE DESTINATIONS GRID
           ========================================================== */}
        {destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5c6e65' }}>
            <h3>No destinations found.</h3>
            <p>Check back later for newly added destinations.</p>
          </div>
        ) : (
          <section className="other-destinations-section">
            <div className="other-destinations-grid">
              {destinations.map((dest) => (
                <div key={dest.id} className="other-dest-card">
                  <div className="other-dest-image-wrapper">
                    {dest.coverImage ? (
                      <img src={dest.coverImage} alt={dest.name} className="other-dest-image" />
                    ) : (
                      <img src={tadobaImg} alt={dest.name} className="other-dest-image" />
                    )}
                  </div>
                  <div className="other-dest-content">
                    <div className="other-dest-location">
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      <span>{dest.state}, {(dest as any).country || 'India'}</span>
                    </div>
                    <h3 className="other-dest-name">
                      {dest.name}
                    </h3>
                    <p className="other-dest-desc">{dest.description}</p>
                    <Link to={`/destinations/${dest.slug}`} className="other-dest-btn">
                      EXPLORE DESTINATION <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Destinations;


