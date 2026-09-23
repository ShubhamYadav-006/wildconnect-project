import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService, Article } from '../../services/article.service';
import { Calendar, User as UserIcon, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/public/ArticleDetails.css';

export const ArticleDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const response = await articleService.getBySlug(slug);
        if (response.success) {
          setArticle(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch article details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return <LoadingSpinner message="Loading article..." />;
  }

  if (!article) {
    return (
      <div className="article-details-container">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <article className="article-details-container">
      <Link to="/articles" className="article-details-back-link">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <header className="article-details-header">
        {article.tags && article.tags.length > 0 && (
          <div className="article-details-tags">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="article-details-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="article-details-title">{article.title}</h1>

        <div className="article-details-meta">
          <span className="article-details-meta-item">
            <UserIcon className="article-details-meta-icon" />
            <span>{article.author?.firstName || 'WildConnect Admin'}</span>
          </span>
          <span className="article-details-meta-item">
            <Calendar className="article-details-meta-icon" />
            <span>
              {new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </span>
        </div>
      </header>

      {(article.featuredImage || article.image) && (
        <div className="article-details-hero-image">
          <img
            src={article.featuredImage || article.image}
            alt={article.title}
          />
        </div>
      )}

      <div className="article-details-body">
        {article.content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="article-details-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};

export default ArticleDetails;
