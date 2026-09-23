/* ================/* ==========================================================
   ArticlesSection Component
   ----------------------------------------------------------
   Purpose:
   Display the latest wildlife articles, travel guides,
   safari tips and conservation stories dynamically.
  ========================================================== */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { articleService, type Article } from "../../services/article.service";

import "../../styles/home/ArticlesSection.css";

const DEFAULT_ARTICLES = [
  {
    id: "1",
    title: "Best Time to Visit Tadoba National Park",
    date: "March 12, 2026",
    category: "Travel Guide",
    slug: "best-time-to-visit-tadoba",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqvJq3pP5N0k45BGLAZolKtxGRHmu8-UpkCgi2SODg9mxZ4L2OfTu_2leBFkGVlfOu-ukE6fsT8f-LMyqf7D0XJnjf-MacxqhYqj3H0KIBuOvoKdWgo_M7qMa6LY26IT1TYwwxTW7Ic7c6waKEYPlN0c3rV1HT0TiHFkBFAjF9CVVVoGKNRyEamPla5LUhINOCj7F67qo2W7LBSEszHwVCwPtODzTl4m1wT4h9j8yUkwCeWGZFRev8",
  },
  {
    id: "2",
    title: "Essential Safari Tips for First-Time Visitors",
    date: "March 20, 2026",
    category: "Safari Guide",
    slug: "essential-safari-tips",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC25WZyc7pxS1NtQQ457v1xdSvajj531WcAYukvJbCx4PUAmC6okaqPx6vEfuEYfECqxlC9oZ_jAvuvAe2WxORr_F5_RYWITEHEkn6b-GXrc19cxmh4uwKXS5xLjtCmvEoMF6kBGTZibBDiNXe3AhJuTW8D5Dv0fk1kQU47tbasmIT0RSozDqVCx79B2tWKODiiCqDOAyIrrM-2RJs_gYCuocqzzhsIMhYHNj9hBp_kJTwnmRhyBA43",
  },
  {
    id: "3",
    title: "Wildlife Photography Tips for Beginners",
    date: "April 05, 2026",
    category: "Photography",
    slug: "wildlife-photography-tips",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJUcxlQaAxg9_qLEeMtA_-HgYeN9EuFYX6J4_KaJrLP0RgrO7kjzd37EIsvuP1B_xm1gWioMuwxcXUFQRqOF9i7BWXB6dPo0hyxB1kjQbLonaHoWGxlrkp0mRItDJMPnKV9DVg6O7y-HLOZbhP-Z4r7dLo5bFeAI21XraaMrF3j8bFYqc559s2CETKc8e8aF-GdREW-q1U2Nhwl3Q30WvihZS53AxwUKwyNP6VNDm0U_vNubHk22NR",
  },
];

const ArticlesSection = () => {
  const [articlesList, setArticlesList] = useState<any[]>(DEFAULT_ARTICLES);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articleService.getAll({ limit: 3 });
        if (res.success) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);
          
          if (list.length > 0) {
            setArticlesList(
              list.slice(0, 3).map((a: Article) => ({
                id: a.id,
                title: a.title,
                date: new Date(a.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }),
                category: a.tags && a.tags.length > 0 ? a.tags[0] : (a.destination?.name || "Wildlife Guide"),
                slug: a.slug,
                image: a.featuredImage || a.image || DEFAULT_ARTICLES[0].image,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to load articles for home section:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className="articles-section">
      <div className="articles-container">
        {/* Section Header */}
        <div className="articles-header">
          <span className="articles-badge">Wildlife Articles</span>
          <h2 className="articles-title">Learn Before You Explore</h2>
          <p className="articles-description">
            Explore expert travel guides, wildlife stories, photography tips and safari planning resources.
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="articles-grid">
          {articlesList.map((article) => (
            <article key={article.id} className="article-card">
              {/* Article Image Wrapper */}
              <div className="article-img-wrap">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-card-img"
                />
              </div>

              {/* Article Card Body */}
              <div className="article-card-body">
                <div>
                  <div className="article-meta-row">
                    <span className="article-category-tag">{article.category}</span>
                    <span className="article-date-text">{article.date}</span>
                  </div>

                  <h3 className="article-card-title">{article.title}</h3>
                </div>

                <Link
                  to={`/articles/${article.slug || article.id}`}
                  className="article-read-link"
                >
                  <span>Read Article</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="articles-action-wrapper">
          <Link to="/articles" className="articles-outline-btn">
            <span>View All Articles</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;