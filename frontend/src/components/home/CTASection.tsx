/* ==========================================================
   CTASection Component
   ----------------------------------------------------------
   Purpose:
   Final Call-To-Action banner encouraging visitors to
   start planning their wildlife adventure.
 ========================================================== */

import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

import "../../styles/home/CTASection.css";

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-banner">
          {/* Badge */}
          <span className="cta-badge">Start Your Wildlife Journey</span>

          {/* Heading */}
          <h2 className="cta-title">Ready to Experience the Wild?</h2>

          {/* Description */}
          <p className="cta-description">
            Discover India's finest wildlife destinations, explore verified resorts, and receive a personalized safari itinerary crafted by travel experts.
          </p>

          {/* Buttons */}
          <div className="cta-actions">
            <Link to="/login" className="cta-btn-accent">
              <span>Plan My Safari</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/destinations" className="cta-btn-outline">
              <Compass size={18} />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;