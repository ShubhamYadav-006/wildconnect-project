/* ==========================================================
   ExperiencesSection Component
   ----------------------------------------------------------
   Purpose:
   Showcase memorable wildlife experiences shared by travelers.
 ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Camera } from "lucide-react";
import { experienceService, Experience } from "../../services/experience.service";

import "../../styles/home/ExperiencesSection.css";

const ExperiencesSection = () => {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceService.getAll();
        if (response.success) {
          const data = Array.isArray(response.data)
            ? response.data
            : (response.data && Array.isArray(response.data.data) ? response.data.data : []);
          setExperienceList(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) {
    return (
      <section className="experience-section">
        <div className="experience-loading-container">
          <p className="experience-loading-text">Loading experiences...</p>
        </div>
      </section>
    );
  }

  if (experienceList.length === 0) {
    return (
      <section className="experience-section">
        <div className="experience-loading-container">
          <p className="experience-loading-text">No traveler stories shared yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="experience-section">

      <div className="experience-container">

        {/* Section Header */}
        <div className="experience-header">

          <span className="experience-subtitle">
            Traveler Experiences
          </span>

          <h2 className="experience-title">
            Stories From The Wild
          </h2>

          <p className="experience-description">
            Read inspiring wildlife travel stories shared by our community
            of explorers and nature lovers.
          </p>

        </div>

        {/* Experience Cards Grid */}
        <div className="experience-grid">

          {experienceList.map((experience) => (

            <div
              key={experience.id}
              className="experience-card"
            >

              <div>
                {/* Experience Image */}
                <div className="experience-image-wrapper">

                  <img
                    src={experience.featuredImage || (experience.images && experience.images[0]) || "https://images.unsplash.com/photo-1615963249187-513f56b3e34b?auto=format&fit=crop&w=800&q=80"}
                    alt={experience.title}
                    className="experience-image"
                  />

                </div>

                <div className="experience-content">

                  <div className="experience-location">

                    <MapPin size={14} className="experience-location-icon" />

                    {experience.destination ? (
                      <Link to={`/destinations/${experience.destination.slug}`} className="experience-location-link">
                        {experience.destination.name}
                      </Link>
                    ) : (
                      <span>Traveler Story</span>
                    )}

                  </div>

                  <h3 className="experience-card-title">{experience.title}</h3>

                  <div className="experience-author">

                    <Camera size={14} className="experience-author-icon" />

                    <span>{experience.author ? `${experience.author.firstName} ${experience.author.lastName || ""}` : "Explorer"}</span>

                  </div>
                </div>
              </div>

              <div className="experience-footer">
                <Link
                  to={`/experiences/${experience.id}`}
                  className="experience-link"
                >
                  Read Story

                  <ArrowRight size={16} />

                </Link>
              </div>

            </div>

          ))}

        </div>

        {/* CTA */}
        <div className="experience-action-wrapper">

          <Link
            to="/experiences"
            className="experience-action-btn"
          >
            Explore All Experiences
          </Link>

        </div>

      </div>

    </section>
  );
};

export default ExperiencesSection;