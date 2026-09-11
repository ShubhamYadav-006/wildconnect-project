/* ==========================================================
   HeroSection Component
   ----------------------------------------------------------
   Purpose:
   - Introduces WildConnect
   - Displays the primary Call-To-Action
   - Encourages visitors to start planning their safari
   - First impression of the platform
   - Automatic 5-image cinematic carousel background

   Notes:
   - No business logic
   - Fully responsive
   - Uses existing routes
 ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPinned,
  ShieldCheck,
  Trees,
} from "lucide-react";

// Image Carousel Assets
import matkasur from "../../assets/images/matkasur.JPG";
import maya2 from "../../assets/images/maya2.JPG";
import tadoba from "../../assets/images/tadoba.jpg";
import kuwani2 from "../../assets/images/kuwani2.JPG";
import leopard from "../../assets/images/leopard.JPG";

// Component CSS
import "../../styles/home/HeroSection.css";

const CAROUSEL_IMAGES = [
  matkasur,
  maya2,
  tadoba,
  kuwani2,
  leopard,
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
    }, 4000); // transition every exactly 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">

      <div className="hero-card">

        {/* Background Image Carousel (Preloaded to prevent blank flashes) */}
        <div className="hero-background">
          {CAROUSEL_IMAGES.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Cinematic safari background ${index + 1}`}
              className={`hero-image ${index === activeIndex ? "active" : ""}`}
            />
          ))}
        </div>

        {/* Directional light overlay blending image to text */}
        <div className="hero-overlay"></div>

        {/* Hero Content */}
        <div className="hero-container">

          <div className="hero-content">

            {/* Main Heading */}
            <h1 className="hero-title">
              Plan Your Perfect<br className="hero-title-br" />
              Wildlife Adventure
            </h1>

            {/* Supporting Text */}
            <p className="hero-description">
              Discover India's most iconic wildlife destinations, explore verified resorts, compare safari options, and receive personalized travel proposals — all from one trusted platform.
            </p>

            {/* CTA Buttons */}
            <div className="hero-actions">

              <Link
                to="/login"
                className="hero-btn-primary"
              >
                Plan My Safari
              </Link>

              <a
                href="#featured-destinations"
                onClick={(e) => {
                  e.preventDefault();
                  const targetElement = document.getElementById("featured-destinations");
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hero-btn-secondary"
              >
                Explore Destinations
              </a>

            </div>

            {/* Trust Highlights */}
            <div className="hero-features">

              <div className="hero-feature">
                <ShieldCheck size={18} className="hero-feature-icon" />
                <span>Verified Destinations</span>
              </div>

              <div className="hero-feature">
                <Trees size={18} className="hero-feature-icon" />
                <span>Trusted Resorts</span>
              </div>

              <div className="hero-feature">
                <MapPinned size={18} className="hero-feature-icon" />
                <span>Expert Trip Planning</span>
              </div>

            </div>

          </div>

        </div>

        {/* Carousel Indicators (Small, unobtrusive) */}
        <div className="hero-indicators">
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`hero-indicator ${index === activeIndex ? "active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
};

export default HeroSection;