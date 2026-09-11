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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: 2,
    name: "Ananya Patel",
    location: "Ahmedabad",
    review:
      "Everything was well organized. We simply shared our requirements and received a perfect travel proposal.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: 3,
    name: "Amit Verma",
    location: "Delhi",
    review:
      "A wonderful platform for wildlife enthusiasts. Highly recommended for first-time safari travelers.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonial-section">

      <div className="testimonial-container">

        {/* Section Heading */}

        <div className="testimonial-header">

          <span className="section-tag">
            Testimonials
          </span>

          <h2>
            What Our Travelers Say
          </h2>

          <p>
            Hear from wildlife enthusiasts who trusted WildConnect
            to plan unforgettable safari adventures.
          </p>

        </div>

        {/* Testimonial Cards */}

        <div className="testimonial-grid">

          {testimonials.map((item) => (

            <div
              key={item.id}
              className="testimonial-card"
            >

              <img
                src={item.avatar}
                alt={item.name}
                className="testimonial-avatar"
              />

              <div className="testimonial-stars">

                {[...Array(5)].map((_, index) => (

                  <Star
                    key={index}
                    size={18}
                    fill="currentColor"
                  />

                ))}

              </div>

              <p className="testimonial-review">
                "{item.review}"
              </p>

              <h3>{item.name}</h3>

              <span>{item.location}</span>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default TestimonialsSection;