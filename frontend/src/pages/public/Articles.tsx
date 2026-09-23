import { useState, useEffect } from 'react';
import { articleService, Article } from '../../services/article.service';
import { Calendar, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/public/Articles.css';

export const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articleService.getAll();
        if (response.success) {
          const articlesData = Array.isArray(response.data)
            ? response.data
            : (response.data && Array.isArray(response.data.data) ? response.data.data : []);
          setArticles(articlesData);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading articles..." />;
  }

  return (
    <div className="articles-page-container">
      <header className="articles-page-header">
        <h1 className="articles-page-title">Wildlife Stories & Guides</h1>
        <p className="articles-page-subtitle">
          Read the latest insights, travel tips, and stories from the wild.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="articles-empty-state">
          <p>No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="articles-page-grid">
          {articles.map((article) => (
            <article key={article.id} className="article-item-card">
              <div className="article-item-media">
                {(article.featuredImage || article.image) ? (
                  <img
                    src={article.featuredImage || article.image}
                    alt={article.title}
                  />
                ) : (
                  <div className="article-no-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="article-item-body">
                {article.tags && article.tags.length > 0 && (
                  <div className="article-item-tags">
                    {article.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="article-tag-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="article-item-title">
                  <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="article-item-excerpt">
                  {article.excerpt || (article.content ? article.content.substring(0, 100) + '...' : '')}
                </p>

                <div className="article-item-footer">
                  <span className="article-meta-group">
                    <UserIcon className="article-meta-icon" />
                    {article.author?.firstName || 'WildConnect Admin'}
                  </span>
                  <span className="article-meta-group">
                    <Calendar className="article-meta-icon" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
