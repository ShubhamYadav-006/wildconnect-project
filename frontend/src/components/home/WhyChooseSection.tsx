/* ==========================================================
   WhyChooseSection Component
   ----------------------------------------------------------
   Purpose:
   Highlights the key benefits of choosing WildConnect
   for planning wildlife adventures.
 ========================================================== */

import { Map, ShieldCheck, Headphones } from "lucide-react";
import "../../styles/home/WhyChooseSection.css";

const features = [
  {
    icon: <Map size={28} />,
    title: "Detailed Destination Guides",
    description:
      "Explore wildlife destinations with comprehensive information on safaris, wildlife, travel tips, and visitor essentials.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Verified Resorts",
    description:
      "Discover trusted resorts near safari gates, making your stay comfortable, convenient, and close to nature.",
  },
  {
    icon: <Headphones size={28} />,
    title: "Easy Trip Planning",
    description:
      "Plan your wildlife journey with destination insights, travel guidance, and personalized trip assistance.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="why-section">
      <div className="why-container">
        {/* Section Header */}
        <div className="why-header">
          <span className="why-badge">Why Choose WildConnect</span>
          <h2 className="why-title">Your Complete Wildlife Travel Companion</h2>
          <p className="why-description">
            Discover trusted destination information, verified stays, and
            practical travel guidance to plan memorable wildlife experiences
            with confidence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="why-grid">
          {features.map((feature, index) => (
            <div key={index} className="why-card">
              <div className="why-icon-wrapper">{feature.icon}</div>
              <h3 className="why-card-title">{feature.title}</h3>
              <p className="why-card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;