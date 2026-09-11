import { useState, useEffect } from 'react';
import { articleService, Article } from '../../services/article.service';
import { Calendar, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Articles = () => {
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
    return <div className="min-h-[60vh] flex justify-center items-center">Loading articles...</div>;
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Wildlife Stories & Guides</h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Read the latest insights, travel tips, and stories from the wild.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center p-12 card bg-gray-50">
          <p className="text-[var(--color-text-muted)]">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="card group flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-2/5 h-48 md:h-auto bg-gray-200 relative overflow-hidden">
                {(article.featuredImage || article.image) ? (
                  <img
                    src={article.featuredImage || article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                ) : (
                  <div className="w-full h-full bg-[var(--color-primary)/0.1] flex items-center justify-center">
                    <span className="text-[var(--color-primary)] font-medium">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6 md:w-3/5 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-xs bg-[var(--color-accent)/0.2] text-[rgb(var(--accent-foreground))] px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
                  {article.excerpt || article.content.substring(0, 100) + '...'}
                </p>

                <div className="mt-auto flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center">
                    <UserIcon className="h-3 w-3 mr-1" />
                    {article.author?.firstName || 'WildConnect Admin'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
