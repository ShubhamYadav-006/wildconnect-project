/* ==========================================================
   PlanningSteps Component
   ----------------------------------------------------------
   Purpose:
   Explains how WildConnect works in three simple steps.
 ========================================================== */

import { Link } from "react-router-dom";
import {
  MapPinned,
  ClipboardList,
  FileCheck,
} from "lucide-react";

import "../../styles/home/PlanningSteps.css";

const PlanningSteps = () => {
  return (
    <section className="planning-section">

      <div className="planning-container">

        {/* Section Heading */}
        <div className="planning-header">
          <span className="planning-subtitle">
            How It Works
          </span>
          <h2 className="planning-title">
            Planning Your Wildlife Trip is Easy
          </h2>
          <p className="planning-description">
            We simplify your journey from discovering
            wildlife destinations to receiving a personalized
            travel proposal in one platform only.
          </p>
        </div>

        {/* Grid of Steps */}
        <div className="planning-grid">

          {/* Step 1 */}
          <div className="planning-card">

            <div className="planning-icon-wrapper">
              <MapPinned size={26} className="planning-icon" />
            </div>

            <h3 className="planning-card-title">
              Explore Wildlife Destinations
            </h3>

            <p className="planning-card-text">
              Discover India's renowned national parks, tiger reserves and wildlife sanctuaries explore authentic travel information, and plan unforgettable wildlife experiences.
            </p>

          </div>

          {/* Step 2 */}
          <div className="planning-card">

            <div className="planning-icon-wrapper">
              <ClipboardList size={26} className="planning-icon" />
            </div>

            <h3 className="planning-card-title">
              Know your Wildlife Destination
            </h3>

            <p className="planning-card-text">
              Explore detailed destination guides with safari information, travel essentials, nearby attractions and accommodation options, to help you plan an unforgettable wildlife experience.
            </p>

          </div>

          {/* Step 3 */}
          <div className="planning-card">

            <div className="planning-icon-wrapper">
              <ClipboardList size={26} className="planning-icon" />
            </div>

            <h3 className="planning-card-title">
              Submit Your Requirements
            </h3>

            <p className="planning-card-text">
              Share your travel dates, group size,
              accommodation preferences and budget
              through a simple trip request form.
            </p>

          </div>

          {/* Step 4 */}
          <div className="planning-card">

            <div className="planning-icon-wrapper">
              <FileCheck size={26} className="planning-icon" />
            </div>

            <h3 className="planning-card-title">
              Receive Your Proposal
            </h3>

            <p className="planning-card-text">
              Our travel experts prepare a personalized
              itinerary with verified resorts,
              safari recommendations and pricing.
            </p>

          </div>

        </div>

        {/* CTA */}
        <div className="planning-action-wrapper">

          <Link
            to="/login"
            className="planning-action-btn"
          >
            PLAN YOUR SAFARI
          </Link>

        </div>

      </div>

    </section>
  );
};

export default PlanningSteps;