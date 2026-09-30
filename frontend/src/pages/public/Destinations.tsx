/* ==========================================================
   Destinations Page Component
   ----------------------------------------------------------
   Displays wildlife destinations in a clean, simple, and 
   elegant card grid without cluttered or extraneous information.
   ========================================================== */

import { useState, useEffect } from 'react';
import { destinationService, Destination } from '../../services/destination.service';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Component styling
import "../../styles/public/Destinations.css";

// Fallback asset import
import tadobaImg from "../../assets/Tiger&Logo Image/Tadoba.jpg";

const DEFAULT_FALLBACK_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Tadoba-Andhari Tiger Reserve",
    slug: "tadoba-andhari-tiger-reserve",
    state: "Maharashtra",
    country: "India",
    description: "Maharashtra's oldest and largest tiger reserve, famous for high tiger density and legendary safari trails around Tadoba Lake.",
    coverImage: tadobaImg,
  },
  {
    id: "2",
    name: "Pench National Park",
    slug: "pench-national-park",
    state: "Madhya Pradesh",
    country: "India",
    description: "The legendary forest that inspired Rudyard Kipling's The Jungle Book, known for pristine teak canopies and thriving wildlife.",
    coverImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Kanha Tiger Reserve",
    slug: "kanha-tiger-reserve",
    state: "Madhya Pradesh",
    country: "India",
    description: "Sprawling sal forests and open savannah meadows, home to the rare Hardground Barasingha and prime tiger habitats.",
    coverImage: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
  },
];

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>(DEFAULT_FALLBACK_DESTINATIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationService.getAll();
        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          const sorted = [...response.data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
          });
          setDestinations(sorted);
        } else {
          setDestinations(DEFAULT_FALLBACK_DESTINATIONS);
        }
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        setDestinations(DEFAULT_FALLBACK_DESTINATIONS);
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
            1. DESTINATIONS HEADER
           ========================================================== */}
        <header className="destinations-intro">
          <span className="destinations-eyebrow">Explore India's Wilderness</span>
          <h1 className="destinations-intro-title">Wildlife Destinations</h1>
          <p className="destinations-intro-subtitle">
            Discover iconic tiger reserves, national parks, and wildlife landscapes with comprehensive guides and safari planning.
          </p>
        </header>

        {/* ==========================================================
            2. DESTINATIONS CARDS GRID
           ========================================================== */}
        {destinations.length === 0 ? (
          <div className="destinations-empty-state">
            <h3>No destinations found</h3>
            <p>Please check back later for newly added destinations.</p>
          </div>
        ) : (
          <section className="destinations-grid-section">
            <div className="destinations-cards-grid">
              {destinations.map((dest) => (
                <article key={dest.id || dest.slug} className="destination-card">
                  {/* Card Cover Image */}
                  <div className="destination-card-image-wrap">
                    <img
                      src={dest.coverImage || tadobaImg}
                      alt={dest.name}
                      className="destination-card-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Content Body */}
                  <div className="destination-card-body">
                    {/* Location Badge */}
                    <div className="destination-card-location">
                      <MapPin size={14} className="destination-location-icon" />
                      <span>{dest.state}{dest.country ? `, ${dest.country}` : ', India'}</span>
                    </div>

                    {/* Destination Name */}
                    <h2 className="destination-card-title">{dest.name}</h2>

                    {/* Destination Description */}
                    <p className="destination-card-description">
                      {dest.description || "Experience untamed wilderness and premier wildlife safari adventures."}
                    </p>

                    {/* Explore Link Button */}
                    <Link
                      to={`/destinations/${dest.slug}`}
                      className="destination-card-btn"
                    >
                      <span>Explore Destination</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Destinations;
