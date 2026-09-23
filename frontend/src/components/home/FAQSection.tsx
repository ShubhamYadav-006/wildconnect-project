/* ==========================================================
   FAQSection Component
   ----------------------------------------------------------
   Purpose:
   Interactive Frequently Asked Questions section for WildConnect.
 ========================================================== */

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

import "../../styles/home/FAQSection.css";

const faqs = [
  {
    question: "What is WildConnect?",
    answer:
      "WildConnect is a centralized wildlife tourism platform where you can discover destinations, explore verified resorts, learn about safari gates, and request personalized wildlife travel plans.",
  },
  {
    question: "Do I need an account to explore destinations?",
    answer:
      "No. You can browse destinations, resorts, safari gates, articles, and experiences without creating an account. Login is only required when submitting a Trip Request.",
  },
  {
    question: "How do I request a customized safari trip?",
    answer:
      "Simply click on 'Plan My Safari', log in or register, and fill out the Trip Request form with your travel preferences. Our team will prepare a personalized proposal.",
  },
  {
    question: "Are the listed resorts verified?",
    answer:
      "Yes. WildConnect showcases verified wildlife resorts located near popular safari destinations to help travelers make informed decisions.",
  },
  {
    question: "Can I compare multiple destinations before booking?",
    answer:
      "Yes. You can freely explore destinations, resorts, safari gates, articles, and experiences before submitting your trip request.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Section Heading */}
        <div className="faq-header">
          <span className="faq-badge">FAQ</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-description">
            Everything you need to know before planning your wildlife adventure with WildConnect.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} className={`faq-card ${isOpen ? "open" : ""}`}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                >
                  <div className="faq-question-left">
                    <HelpCircle size={20} className="faq-question-icon" />
                    <h3 className="faq-question-text">{faq.question}</h3>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`faq-chevron ${isOpen ? "rotated" : ""}`}
                  />
                </button>

                <div className={`faq-collapse-body ${isOpen ? "expanded" : ""}`}>
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;