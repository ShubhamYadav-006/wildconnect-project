/* ==========================================================
   FeaturedDestinations Component
   ----------------------------------------------------------
   Purpose:
   Showcase the top wildlife destinations available
   on the WildConnect platform dynamically from database.
 ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { destinationService } from "../../services/destination.service";

import "../../styles/home/FeaturedDestinations.css";
import tadobaImg from "../../assets/Tiger&Logo Image/Tadoba.jpg";

const DEFAULT_DESTINATIONS = [
  {
    id: "1",
    name: "Tadoba National Park",
    state: "Maharashtra",
    description: "Famous for Royal Bengal Tigers and unforgettable safari experiences.",
    coverImage: tadobaImg,
    slug: "tadoba-andhari-tiger-reserve",
  },
  {
    id: "2",
    name: "Pench National Park",
    state: "Madhya Pradesh",
    description: "Famous for Leopard & Tiger and pristine teak forests.",
    coverImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
    slug: "pench-national-park",
  },
  {
    id: "3",
    name: "Kanha Tiger Reserve",
    state: "Madhya Pradesh",
    description: "Lush sal forests and meadow habitats, inspiration for The Jungle Book.",
    coverImage: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
    slug: "kanha-tiger-reserve",
  },
];

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState<any[]>(DEFAULT_DESTINATIONS);

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
          setDestinations(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="featured-destinations" id="featured-destinations">
      <div className="destinations-container">
        {/* Section Header */}
        <div className="destinations-header">
          <h2 className="destinations-title">Discover India's Rich Wildlife Heritage</h2>
          <p className="destinations-description">
            Explore India's renowned national parks, tiger reserves, and wildlife sanctuaries with comprehensive travel guides, safari information, and everything you need to plan your wildlife adventure.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <div key={destination.id || destination._id} className="destination-card">
              {/* Destination Image Wrapper */}
              <div className="dest-image-wrapper">
                <img
                  src={destination.coverImage || destination.image || tadobaImg}
                  alt={destination.name}
                  className="dest-image"
                />
              </div>

              {/* Destination Card Body */}
              <div className="dest-card-body">
                <div>
                  <h3 className="dest-card-title">{destination.name}</h3>
                  {destination.state && (
                    <div className="dest-card-location">
                      <MapPin size={14} className="dest-location-icon" />
                      <span>{destination.state}</span>
                    </div>
                  )}
                  <p className="dest-card-desc">
                    {destination.description ||
                      "Famous for Royal Bengal Tigers and unforgettable safari experiences."}
                  </p>
                </div>

                <Link
                  to={`/destinations/${destination.slug || destination.id}`}
                  className="dest-card-link"
                >
                  <span>Explore Destination</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="destinations-action-wrapper">
          <Link to="/destinations" className="destinations-outline-btn">
            <span>View All Destinations</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;