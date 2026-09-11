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
import tadobaImg from "../../assets/images/tadoba.jpg";

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
];

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState<any[]>(DEFAULT_DESTINATIONS);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationService.getAll();
        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="featured-destinations" id="featured-destinations">
      <div className="featured-destinations-container">

        {/* Section Header */}
        <div className="featured-header">
          <span className="featured-subtitle">
            Wildlife Destinations
          </span>
          <h2 className="featured-title">
            Discover India's Rich Wildlife Heritage
          </h2>
          <p className="featured-description">
            Explore India's renowned national parks, tiger reserves, and wildlife sanctuaries with comprehensive travel guides, safari information, and everything you need to plan your wildlife adventure.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="destination-grid">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="destination-card"
            >
              {/* Destination Image */}
              <div className="destination-image-wrapper">
                <img
                  src={destination.coverImage || destination.image || tadobaImg}
                  alt={destination.name}
                  className="destination-image"
                />
              </div>

              {/* Card Content */}
              <div className="destination-content">
                <div className="destination-location">
                  <MapPin size={14} className="destination-location-icon" />
                  <span>{destination.state}</span>
                </div>

                <h3 className="destination-card-title">{destination.name}</h3>

                <p className="destination-card-text">
                  {destination.description || `Famous for wildlife and unforgettable safari experiences.`}
                </p>

                <Link
                  to={`/destinations/${destination.slug}`}
                  className="destination-link"
                >
                  Explore Destination
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="destination-action-wrapper">
          <Link
            to="/destinations"
            className="destination-action-btn"
          >
            View All Destinations
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedDestinations;