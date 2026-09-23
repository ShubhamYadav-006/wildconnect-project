/* ==========================================================
   PlanningSteps Component
   ----------------------------------------------------------
   Purpose:
   Explains how WildConnect works in four structured steps.
   Follows luxury safari design aesthetics.
 ========================================================== */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../../styles/home/PlanningSteps.css";

const stepsData = [
  {
    stepNumber: "01",
    title: "Choose Destination",
    description:
      "Explore curated tiger reserves, national parks, safari zones, and wildlife guides across India.",
  },
  {
    stepNumber: "02",
    title: "Select Dates & Preferences",
    description:
      "Pick your travel dates, preferred safari gates, accommodation tier, and group size.",
  },
  {
    stepNumber: "03",
    title: "Submit Trip Request",
    description:
      "Share your requirements with our team through a quick, hassle-free online request form.",
  },
  {
    stepNumber: "04",
    title: "Receive Custom Proposal",
    description:
      "Our wildlife specialists curate a personalized itinerary with verified stays, permits, and transparent pricing.",
  },
];

const PlanningSteps = () => {
  return (
    <section className="planning-section">
      <div className="planning-container">
        {/* Section Header */}
        <div className="planning-header">
          <h2 className="planning-title">Planning Your Wildlife Trip is Easy</h2>
          <p className="planning-description">
            We simplify your journey from discovering wildlife destinations to receiving a personalized travel proposal in one unified platform.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="planning-grid">
          {stepsData.map((step) => (
            <div key={step.stepNumber} className="planning-card">
              <div className="planning-step-number">{step.stepNumber}</div>
              <h3 className="planning-card-title">{step.title}</h3>
              <p className="planning-card-text">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Action */}
        <div className="planning-action-wrapper">
          <Link to="/trip-request/new" className="planning-action-btn">
            <span>PLAN YOUR SAFARI</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlanningSteps;