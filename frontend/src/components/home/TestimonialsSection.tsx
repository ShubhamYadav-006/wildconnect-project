/* ==========================================================
   TestimonialsSection Component
   ----------------------------------------------------------
   Purpose:
   Display reviews from travelers to build trust
   and encourage new users to plan their safari.
 ========================================================== */

import { Star } from "lucide-react";
import "../../styles/home/TestimonialsSection.css";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai",
    review:
      "WildConnect made our Tadoba safari planning effortless. The itinerary and resort suggestions were excellent.",
  },
  {
    id: 2,
    name: "Ananya Patel",
    location: "Ahmedabad",
    review:
      "Everything was well organized. We simply shared our requirements and received a perfect travel proposal.",
  },
  {
    id: 3,
    name: "Amit Verma",
    location: "Delhi",
    review:
      "A wonderful platform for wildlife enthusiasts. Highly recommended for first-time safari travelers.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        {/* Section Heading */}
        <div className="testimonial-header">
          <span className="testimonial-badge">Testimonials</span>
          <h2 className="testimonial-title">What Our Travelers Say</h2>
          <p className="testimonial-description">
            Hear from wildlife enthusiasts who trusted WildConnect to plan unforgettable safari adventures.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="testimonial-card-top">
                {/* 5 Stars */}
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className="testimonial-star-icon"
                    />
                  ))}
                </div>

                <p className="testimonial-quote">"{item.review}"</p>
              </div>

              {/* Author Info */}
              <div className="testimonial-author-box">
                <div className="author-name">{item.name}</div>
                <div className="author-location">{item.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;