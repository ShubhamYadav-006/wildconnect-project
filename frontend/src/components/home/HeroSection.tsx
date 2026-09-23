/* ==========================================================
   HeroSection Component
   ----------------------------------------------------------
   Purpose:
   - Luxury Wildlife Hero Section
   - Single-platform safari exploration & planning
   - 5-image automatic & interactive carousel
   - Left-aligned editorial typography with gold accents
 ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Leaf,
  BedDouble,
  Users,
} from "lucide-react";

// Image Carousel Assets
import matkasur from "../../assets/Tiger&Logo Image/Matkasur.JPG";
import matkasur2 from "../../assets/Tiger&Logo Image/Matkasur2.JPG";
import maya from "../../assets/Tiger&Logo Image/Maya.jpg";
import tadoba from "../../assets/Tiger&Logo Image/Tadoba.jpg";
import kuwani from "../../assets/Tiger&Logo Image/Kuwani.JPG";
import leopard from "../../assets/Tiger&Logo Image/Leopard.JPG";

// Component CSS
import "../../styles/home/HeroSection.css";

const CAROUSEL_IMAGES = [
  matkasur,
  matkasur2,
  maya,
  tadoba,
  kuwani,
  leopard,
];

const HeroSection = () => {
  // Start with a random initial image from the collection
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(Math.random() * CAROUSEL_IMAGES.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * CAROUSEL_IMAGES.length);
        } while (nextIndex === prevIndex && CAROUSEL_IMAGES.length > 1);
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  const handleNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
  };

  const handleScrollToDestinations = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById("featured-destinations");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      {/* Background Image Carousel */}
      <div className="hero-background-carousel">
        {CAROUSEL_IMAGES.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`WildConnect Safari Background ${index + 1}`}
            className={`hero-carousel-slide ${index === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Cinematic Forest Gradient Overlay */}
      <div className="hero-gradient-overlay"></div>

      {/* Main Container */}
      <div className="hero-container">
        {/* Left Content Area */}
        <div className="hero-content">
          {/* Main Editorial Heading */}
          <h1 className="hero-title">
            Plan Your Perfect<br />
            <span className="hero-title-accent">Wildlife</span> Adventure
          </h1>

          {/* Supporting Description */}
          <p className="hero-description">
            Discover India's most iconic wildlife destinations, explore trusted accommodations, and receive personalized travel proposals — all from one platform.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <Link to="/login" className="hero-btn-primary">
              <span>Start Planning</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href="#featured-destinations"
              onClick={handleScrollToDestinations}
              className="hero-btn-secondary"
            >
              <span>Explore Destinations</span>
            </a>
          </div>

          {/* Trust Highlights Row */}
          <div className="hero-trust-bar">
            <div className="hero-trust-item">
              <Leaf size={22} className="hero-trust-icon" />
              <div className="hero-trust-label">
                <span>Verified</span>
                <span>Destinations</span>
              </div>
            </div>

            <div className="hero-trust-divider"></div>

            <div className="hero-trust-item">
              <BedDouble size={22} className="hero-trust-icon" />
              <div className="hero-trust-label">
                <span>Trusted</span>
                <span>Accommodations</span>
              </div>
            </div>

            <div className="hero-trust-divider"></div>

            <div className="hero-trust-item">
              <Users size={22} className="hero-trust-icon" />
              <div className="hero-trust-label">
                <span>Personalized</span>
                <span>Proposals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slider Controls */}
      <div className="hero-bottom-bar">
        <div className="hero-bottom-container">
          {/* Bottom Right Slider Controls & Pagination */}
          <div className="hero-bottom-controls">
            {/* Dots */}
            <div className="hero-dots">
              {CAROUSEL_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`hero-dot ${index === activeIndex ? "active" : ""}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}


            {/* Navigation Arrows */}
            <div className="hero-nav-arrows">
              <button
                onClick={handlePrevSlide}
                className="hero-arrow-btn"
                aria-label="Previous image"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={handleNextSlide}
                className="hero-arrow-btn"
                aria-label="Next image"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;