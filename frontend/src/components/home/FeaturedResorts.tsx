/* ==========================================================
   FeaturedResorts Component
   ----------------------------------------------------------
   Purpose:
   Display premium wildlife resorts near major safari gates.
 ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { resortService, Resort } from "../../services/resort.service";

import "../../styles/home/FeaturedResorts.css";

interface FeaturedResortsProps {
  destinationId?: string;
}

const FeaturedResorts = ({ destinationId }: FeaturedResortsProps) => {
  const [resortList, setResortList] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        let response;
        if (destinationId) {
          response = await resortService.getByDestination(destinationId);
        } else {
          response = await resortService.getAll();
        }

        if (response.success) {
          const data = Array.isArray(response.data)
            ? response.data
            : (response.data && Array.isArray(response.data.data) ? response.data.data : []);
          setResortList(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured resorts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResorts();
  }, [destinationId]);

  if (isLoading) {
    return (
      <section className="featured-resorts-section">
        <div className="resort-loading-container">
          <p className="resort-loading-text">Loading verified resorts...</p>
        </div>
      </section>
    );
  }

  if (resortList.length === 0) {
    return (
      <section className="featured-resorts-section">
        <div className="resort-loading-container">
          <p className="resort-loading-text">No verified resorts listed yet near this destination.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-resorts-section">

      <div className="featured-resorts-container">

        {/* Section Heading */}
        <div className="featured-resorts-header">

          <span className="featured-resorts-subtitle">
            Verified Resorts
          </span>

          <h2 className="featured-resorts-title">
            Stay Close To Nature
          </h2>

          <p className="featured-resorts-description">
            Browse verified wildlife resorts located near India's
            top safari destinations for a comfortable and memorable stay.
          </p>

        </div>

        {/* Resort Cards Grid */}
        <div className="resort-grid">

          {resortList.map((resort) => (

            <div
              key={resort.id}
              className="resort-card"
            >

              <div>
                {/* Resort Image */}
                <div className="resort-image-wrapper">

                  <img
                    src={resort.images?.[0] || resort.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                    alt={resort.name}
                    className="resort-image"
                  />

                </div>

                {/* Resort Content */}
                <div className="resort-content">

                  <div className="resort-title-row">
                    <h3 className="resort-name">{resort.name}</h3>

                    <div className="resort-rating">
                      <Star size={13} className="resort-rating-icon" />
                      <span>{resort.starRating || 4}.0</span>
                    </div>
                  </div>

                  <div className="resort-location">

                    <MapPin size={14} className="resort-location-icon" />

                    {resort.destination ? (
                      <Link to={`/destinations/${resort.destination.slug}`} className="resort-location-link">
                        {resort.destination.name}, {resort.destination.state}
                      </Link>
                    ) : (
                      <span>{resort.address || "Wildlife Sanctuary"}</span>
                    )}

                  </div>

                  <p className="resort-description">{resort.description}</p>
                </div>
              </div>

              <div className="resort-footer">
                <Link
                  to={`/resorts/${resort.slug}`}
                  className="resort-link"
                >
                  View Resort

                  <ArrowRight size={16} />

                </Link>
              </div>

            </div>

          ))}

        </div>

        {/* CTA */}
        <div className="resort-action-wrapper">

          <Link
            to="/resorts"
            className="resort-action-btn"
          >
            Explore All Resorts
          </Link>

        </div>

      </div>

    </section>
  );
};

export default FeaturedResorts;