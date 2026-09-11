/* ==========================================================
   CTASection Component
   ----------------------------------------------------------
   Purpose:
   Final Call-To-Action encouraging visitors to
   start planning their wildlife adventure.
========================================================== */

import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

import "../../styles/home/CTASection.css";

const CTASection = () => {
  return (
    <section className="cta-section">

      <div className="cta-container">

        {/* Left Content */}
        <div className="cta-content">

          <span className="cta-badge">
            Start Your Wildlife Journey
          </span>

          <h2 className="cta-title">
            Ready to Experience the Wild?
          </h2>

          <p className="cta-description">
            Discover India's finest wildlife destinations,
            explore verified resorts, and receive a personalized
            safari itinerary crafted by travel experts.
          </p>

        </div>

        {/* CTA Buttons */}
        <div className="cta-actions">

          <Link
            to="/login"
            className="cta-btn-primary"
          >
            Plan My Safari
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/destinations"
            className="cta-btn-secondary"
          >
            <Compass size={16} />
            Explore Destinations
          </Link>

        </div>

      </div>

    </section>
  );
};

export default CTASection;