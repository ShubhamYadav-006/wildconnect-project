/* ==========================================================
   ArticlesSection Component
   ----------------------------------------------------------
   Purpose:
   Display the latest wildlife articles, travel guides,
   safari tips and conservation stories.
========================================================== */

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  BookOpen,
} from "lucide-react";

import "../../styles/home/ArticlesSection.css";

const articles = [
  {
    id: 1,
    title: "Best Time to Visit Tadoba National Park",
    date: "March 12, 2026",
    category: "Travel Guide",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Essential Safari Tips for First-Time Visitors",
    date: "March 20, 2026",
    category: "Safari Guide",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Wildlife Photography Tips for Beginners",
    date: "April 05, 2026",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80",
  },
];

const ArticlesSection = () => {
  return (
    <section className="articles-section">

      <div className="articles-container">

        {/* Section Header */}
        <div className="articles-header">

          <span className="articles-subtitle">
            Wildlife Articles
          </span>

          <h2 className="articles-title">
            Learn Before You Explore
          </h2>

          <p className="articles-description">
            Explore expert travel guides, wildlife stories,
            photography tips and safari planning resources.
          </p>

        </div>

        {/* Article Cards Grid */}
        <div className="articles-grid">

          {articles.map((article) => (

            <div
              key={article.id}
              className="article-card"
            >

              <div className="article-card-top">
                {/* Article Image */}
                <div className="article-image-wrapper">

                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-image"
                  />

                </div>

                <div className="article-content">

                  <span className="article-category">
                    <BookOpen size={12} className="article-category-icon" />
                    {article.category}
                  </span>

                  <h3 className="article-card-title">{article.title}</h3>

                  <div className="article-date">

                    <Calendar size={14} className="article-date-icon" />

                    <span>{article.date}</span>

                  </div>
                </div>
              </div>

              <div className="article-card-bottom">
                <Link
                  to="/articles"
                  className="article-link"
                >
                  Read Article

                  <ArrowRight size={16} />

                </Link>
              </div>

            </div>

          ))}

        </div>

        {/* CTA */}
        <div className="articles-action-wrapper">

          <Link
            to="/articles"
            className="articles-action-btn"
          >
            View All Articles
          </Link>

        </div>

      </div>

    </section>
  );
};

export default ArticlesSection;