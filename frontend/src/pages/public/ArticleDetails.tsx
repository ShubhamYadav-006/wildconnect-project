import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService, Article } from '../../services/article.service';
import { Calendar, User as UserIcon, ArrowLeft } from 'lucide-react';

const ArticleDetails = () => {
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

  if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center">Loading article...</div>;
  if (!article) return <div className="min-h-[60vh] flex justify-center items-center">Article not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/articles" className="inline-flex items-center text-[var(--color-primary)] hover:underline mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Articles
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags?.map((tag, idx) => (
            <span key={idx} className="text-sm bg-[var(--color-accent)/0.2] text-[rgb(var(--accent-foreground))] px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">{article.title}</h1>

        <div className="flex items-center text-[var(--color-text-muted)] space-x-6 border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            <span>{article.author?.firstName || 'WildConnect Admin'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {(article.featuredImage || article.image) && (
        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-12">
          <img src={article.featuredImage || article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-[var(--color-text-primary)]">
        {article.content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-6 leading-relaxed text-lg">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetails;
