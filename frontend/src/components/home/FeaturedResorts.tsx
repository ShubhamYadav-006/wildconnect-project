/* ==========================================================
   FeaturedResorts Component
   ----------------------------------------------------------
   Purpose:
   Display verified wildlife businesses and resorts dynamically
   from the database with luxury safari dark card design.
 ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, Waves, Utensils, Bed, Wifi } from "lucide-react";
import { businessService, type Business } from "../../services/business.service";
import { resortService } from "../../services/resort.service";

import "../../styles/home/FeaturedResorts.css";

interface FeaturedResortsProps {
  destinationId?: string;
}

const DEFAULT_AMENITIES = ["Pool", "Restaurant", "AC Rooms"];

const FeaturedResorts = ({ destinationId }: FeaturedResortsProps) => {
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResortBusinesses = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch approved partner businesses of type RESORT
        const filterParams: { type: string; destinationId?: string } = {
          type: 'RESORT',
        };
        if (destinationId) {
          filterParams.destinationId = destinationId;
        }

        let businesses: any[] = [];
        try {
          const bizData = await businessService.getPublicBusinesses(filterParams);
          if (Array.isArray(bizData) && bizData.length > 0) {
            businesses = bizData.filter((b: any) => b.status === 'APPROVED' || !b.status);
          }
        } catch {
          businesses = [];
        }

        // 2. Fallback to general resort endpoint if no partner resorts found
        if (businesses.length === 0) {
          try {
            const resortRes = destinationId
              ? await resortService.getByDestination(destinationId)
              : await resortService.getAll();

            const resortData = Array.isArray(resortRes.data)
              ? resortRes.data
              : Array.isArray(resortRes)
                ? resortRes
                : [];
            businesses = resortData;
          } catch {
            // Resort endpoint fallback
          }
        }

        // Pick 3 random stays
        const shuffled = [...businesses].sort(() => 0.5 - Math.random());
        setBusinessList(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch available resort businesses:", error);
        setBusinessList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResortBusinesses();
  }, [destinationId]);

  // Helper for amenity icon
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("pool") || lower.includes("swim") || lower.includes("water")) {
      return <Waves size={13} />;
    }
    if (lower.includes("restaurant") || lower.includes("dining") || lower.includes("food") || lower.includes("bar")) {
      return <Utensils size={13} />;
    }
    if (lower.includes("ac") || lower.includes("room") || lower.includes("bed") || lower.includes("stay")) {
      return <Bed size={13} />;
    }
    if (lower.includes("wifi") || lower.includes("internet")) {
      return <Wifi size={13} />;
    }
    return <Sparkles size={13} />;
  };

  if (isLoading) {
    return (
      <section className="featured-resorts-section">
        <div className="resort-loading-container">
          <div className="resort-loading-spinner"></div>
          <p className="resort-loading-text">Loading verified wildlife resorts &amp; stays...</p>
        </div>
      </section>
    );
  }

  // If no resorts exist in the database, display clean informative state
  if (businessList.length === 0) {
    return (
      <section className="featured-resorts-section">
        <div className="featured-resorts-container">
          <div className="featured-resorts-header">
            <span className="featured-resorts-badge">Verified Accommodations</span>
            <h2 className="featured-resorts-title">Stay Close To Nature</h2>
            <p className="featured-resorts-description">
              Browse verified wildlife resorts and jungle stays located near India's top safari destinations.
            </p>
          </div>
          <div className="resorts-empty-container">
            <Sparkles size={36} className="resorts-empty-icon" />
            <h3 className="resorts-empty-title">No Partner Resorts Listed Yet</h3>
            <p className="resorts-empty-desc">
              Verified partner resorts are currently being onboarded for this region. Explore all destinations or check back soon!
            </p>
            <Link to="/destinations" className="resorts-primary-btn">
              <span>Explore Destinations</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-resorts-section">
      <div className="featured-resorts-container">
        {/* Section Heading */}
        <div className="featured-resorts-header">
          <h2 className="featured-resorts-title">Stay Close To Nature</h2>
          <p className="featured-resorts-description">
            Browse verified wildlife resorts, eco-lodges, and safari homestays with real-time availability and genuine local hospitality.
          </p>
        </div>

        {/* Resort Cards Grid */}
        <div className="resorts-grid">
          {businessList.map((business) => {
            const cardId = business.id || business.slug || String((business as any)._id || Math.random());
            const displayImage =
              business.coverImage ||
              business.images?.[0] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

            const detailUrl = business.slug
              ? `/resorts/${business.slug}`
              : `/resorts/${business.id}`;

            const amenitiesList =
              business.amenities && business.amenities.length > 0
                ? business.amenities
                : DEFAULT_AMENITIES;

            const visibleAmenities = amenitiesList.slice(0, 3);
            const extraAmenitiesCount =
              amenitiesList.length > 3
                ? amenitiesList.length - 3
                : 0;

            const locationText = business.destination
              ? `${business.destination.name}${business.destination.state ? `, ${business.destination.state}` : ''}`
              : business.address || "Tadoba, Maharashtra";

            const gateInfo = (business as any).nearestGate || (business as any).metadata?.nearestGate;

            return (
              <div key={cardId} className="resort-card">
                {/* Resort Card Image */}
                <div className="resort-image-wrap">
                  <img
                    src={displayImage}
                    alt={business.name}
                    className="resort-card-img"
                    loading="lazy"
                  />
                </div>

                {/* Resort Card Content Body */}
                <div className="resort-card-body">
                  {/* Title */}
                  <h3 className="resort-card-title">{business.name}</h3>

                  {/* Location & Gate Proximity Row */}
                  <div className="resort-meta-info-row">
                    <div className="resort-location-row">
                      <MapPin size={12} className="resort-location-icon" />
                      <span>{locationText}</span>
                    </div>
                    {gateInfo && (
                      <span className="resort-gate-badge">Near {gateInfo}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="resort-card-desc">
                    {business.description ||
                      "Nature's peaceful jungle retreat nestled amid teak and bamboo forests."}
                  </p>

                  {/* Amenities Row */}
                  <div className="resort-amenities-row">
                    {visibleAmenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="resort-amenity-item">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}

                    {extraAmenitiesCount > 0 && (
                      <span className="resort-amenity-extra">+{extraAmenitiesCount}</span>
                    )}
                  </div>

                  {/* Action Row */}
                  <div className="resort-pricing-action-row">
                    <Link to={detailUrl} className="resort-view-stay-btn">
                      <span>Submit Enquiry</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="resorts-action-wrapper">
          <Link to="/businesses?type=RESORT" className="resorts-primary-btn">
            <span>Explore All Stays &amp; Resorts</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResorts;