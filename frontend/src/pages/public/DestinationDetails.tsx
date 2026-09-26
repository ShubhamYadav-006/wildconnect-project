import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { destinationService, Destination } from '../../services/destination.service';
import { resortService, Resort } from '../../services/resort.service';
import TadobaDetails from './TadobaInformation';
import PenchInformation from './PenchInformation';
import {
  MapPin,
  Compass,
  Tent,
  AlertTriangle
} from 'lucide-react';

// Component Styles
import "../../styles/public/DestinationDetails.css";

const DEFAULT_TADOBA_DESTINATION: Destination = {
  id: 'tadoba-andhari-tiger-reserve',
  name: 'Tadoba Andhari Tiger Reserve',
  slug: 'tadoba-andhari-tiger-reserve',
  state: 'Maharashtra',
  country: 'India',
  description: "Tadoba-Andhari Tiger Reserve (TATR) is one of Central India's most iconic wildlife landscapes. Located in Maharashtra's Chandrapur district, it harmoniously combines Maharashtra's oldest national park with the Andhari Wildlife Sanctuary.",
  establishedYear: 1955,
  totalArea: 1727.59,
  coreArea: 625.82,
  coreGates: 6,
  bufferArea: 1101.77,
  bufferGates: 16
};

const DEFAULT_PENCH_DESTINATION: Destination = {
  id: 'pench-tiger-reserve',
  name: 'Pench Tiger Reserve',
  slug: 'pench-tiger-reserve',
  state: 'Madhya Pradesh & Maharashtra',
  country: 'India',
  description: "Pench Tiger Reserve is the legendary wilderness that inspired Rudyard Kipling's The Jungle Book. Spanning the border of Madhya Pradesh and Maharashtra along the scenic Pench river.",
  establishedYear: 1983,
  totalArea: 1179.63,
  coreArea: 411.33,
  coreGates: 6,
  bufferArea: 768.30,
  bufferGates: 7
};

const DestinationDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      const lowerSlug = slug.toLowerCase();
      try {
        const destResponse = await destinationService.getBySlug(slug);
        if (destResponse && destResponse.success && destResponse.data) {
          setDestination(destResponse.data);

          // Fetch associated resorts safely
          try {
            const destId = destResponse.data.id || (destResponse.data as any)._id;
            if (destId) {
              const resResponse = await resortService.getByDestination(destId);
              if (resResponse && resResponse.success && resResponse.data) {
                setResorts(resResponse.data);
              }
            }
          } catch (resortErr) {
            console.error('Failed to fetch resorts:', resortErr);
          }
        } else if (lowerSlug.includes('tadoba')) {
          setDestination(DEFAULT_TADOBA_DESTINATION);
        } else if (lowerSlug.includes('pench')) {
          setDestination(DEFAULT_PENCH_DESTINATION);
        }
      } catch (error) {
        console.error('Failed to fetch destination details:', error);
        if (lowerSlug.includes('tadoba')) {
          setDestination(DEFAULT_TADOBA_DESTINATION);
        } else if (lowerSlug.includes('pench')) {
          setDestination(DEFAULT_PENCH_DESTINATION);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="dest-details-loading">
        <div className="dest-details-spinner"></div>
        <span>Loading destination details...</span>
      </div>
    );
  }

  // Route specifically to Tadoba custom details component
  if (slug === 'tadoba-andhari-tiger-reserve' || (slug && slug.toLowerCase().includes('tadoba'))) {
    return <TadobaDetails destination={destination || DEFAULT_TADOBA_DESTINATION} resorts={resorts} />;
  }

  // Route specifically to Pench custom details component
  if (
    slug === 'pench-tiger-reserve' ||
    slug === 'pench-national-park' ||
    (slug && slug.toLowerCase().includes('pench'))
  ) {
    return <PenchInformation destination={destination || DEFAULT_PENCH_DESTINATION} resorts={resorts} />;
  }

  if (!destination) {
    return (
      <div className="dest-details-error">
        <AlertTriangle className="dest-details-error-icon" />
        <h2 className="dest-details-error-title">Destination Not Found</h2>
        <p className="dest-details-error-desc">The destination you are trying to view is not available or has been removed.</p>
        <Link to="/destinations" className="dest-details-error-btn">Browse Destinations</Link>
      </div>
    );
  }

  // --- GENERAL RESERVE GENERIC LAYOUT FALLBACK ---
  return (
    <div className="dest-details-page">

      {/* Hero Section */}
      <div className="dest-details-hero">
        {(destination.coverImage || (destination.images && destination.images.length > 0)) && (
          <img
            src={destination.coverImage || (destination.images ? destination.images[0] : '')}
            alt={destination.name}
            className="dest-details-hero-img"
          />
        )}
        <div className="dest-details-hero-overlay"></div>
        <div className="dest-details-hero-content">
          <div className="dest-details-hero-wrapper">
            <h1 className="dest-details-hero-title">{destination.name}</h1>
            <div className="dest-details-hero-meta">
              <div className="dest-details-hero-meta-item">
                <MapPin className="dest-details-hero-meta-icon" />
                <span>{destination.state}, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="dest-details-container">
        <div className="dest-details-layout">

          {/* Main Content */}
          <div className="dest-details-main">
            <section className="dest-details-card">
              <h2 className="dest-details-card-title">
                <Compass className="dest-details-card-icon" />
                About the Park
              </h2>
              <div className="dest-details-text">
                {destination.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Gallery */}
            {destination.images && destination.images.length > 1 && (
              <section className="dest-details-card">
                <h2 className="dest-details-card-title">Landscape Gallery</h2>
                <div className="dest-details-gallery-grid">
                  {destination.images.slice(1).map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="Gallery" 
                      className="dest-details-gallery-img" 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="dest-details-sidebar">
            <div className="dest-details-proposal-card">
              <h3 className="dest-details-proposal-title">Plan Your Journey</h3>
              <p className="dest-details-proposal-desc">
                Connect with our expert naturalists to get a custom-tailored safari itinerary, resort recommendations, and permit reservation support.
              </p>
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="dest-details-proposal-btn"
              >
                Request Proposal
              </Link>
            </div>

            <div className="dest-details-resorts-card">
              <h3 className="dest-details-resorts-title">
                <Tent />
                Featured Resorts
              </h3>
              {resorts.length === 0 ? (
                <p className="dest-details-section-info">No resorts listed yet for this destination.</p>
              ) : (
                <div className="dest-details-resorts-list">
                  {resorts.slice(0, 3).map(resort => (
                    <Link key={resort.id} to={`/resorts/${resort.slug}`} className="dest-details-resort-item">
                      <div className="dest-details-resort-thumb">
                        {resort.images?.[0] && (
                          <img 
                            src={resort.images[0]} 
                            alt={resort.name} 
                          />
                        )}
                      </div>
                      <div className="dest-details-resort-info">
                        <h4 className="dest-details-resort-name">{resort.name}</h4>
                        <p className="dest-details-resort-price">Inquire for Stay</p>
                      </div>
                    </Link>
                  ))}
                  {resorts.length > 3 && (
                    <Link to="/resorts" className="dest-details-resorts-viewall">
                      View all stays &amp; resorts
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
