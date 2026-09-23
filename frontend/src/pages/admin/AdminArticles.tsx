import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  CheckCircle,
  Archive,
  Search,
  Tag,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react';
import { articleService, type Article } from '../../services/article.service';
import { destinationService, type Destination } from '../../services/destination.service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminArticles.css';
import '../../styles/globals/modals.css';
import '../../styles/globals/forms.css';

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    tagsString: '',
    destinationId: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
  });

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await articleService.getAll();
      if (res.success) {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);
        setArticles(list);
      }
    } catch (error: any) {
      console.error('Failed to load articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await destinationService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setDestinations(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch destinations for article dropdown:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchDestinations();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedArticle(null);
    setFormData({
      title: '',
      content: '',
      featuredImage: '',
      tagsString: '',
      destinationId: '',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      featuredImage: article.featuredImage || article.image || '',
      tagsString: article.tags && Array.isArray(article.tags) ? article.tags.join(', ') : '',
      destinationId: article.destinationId || '',
      status: article.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long');
      return;
    }

    if (!formData.content.trim() || formData.content.trim().length < 10) {
      toast.error('Content must be at least 10 characters long');
      return;
    }

    const parsedTags = formData.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      featuredImage: formData.featuredImage.trim() || undefined,
      tags: parsedTags,
      destinationId: formData.destinationId ? formData.destinationId : null,
      status: formData.status,
    };

    try {
      setIsSubmitting(true);
      if (selectedArticle) {
        const res = await articleService.update(selectedArticle.id, payload);
        if (res.success) {
          toast.success('Article updated successfully!');
          handleCloseModal();
          fetchArticles();
        } else {
          toast.error(res.message || 'Failed to update article');
        }
      } else {
        const res = await articleService.create(payload);
        if (res.success) {
          toast.success('Article created successfully!');
          handleCloseModal();
          fetchArticles();
        } else {
          toast.error(res.message || 'Failed to create article');
        }
      }
    } catch (error: any) {
      console.error('Save article error:', error);
      toast.error(error.response?.data?.message || 'Error saving article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await articleService.publish(id);
      if (res.success) {
        toast.success('Article published!');
        fetchArticles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish article');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await articleService.archive(id);
      if (res.success) {
        toast.success('Article moved to archive');
        fetchArticles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to archive article');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await articleService.delete(id);
      if (res.success) {
        toast.success('Article deleted successfully');
        fetchArticles();
      } else {
        toast.error(res.message || 'Failed to delete article');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete article');
    }
  };

  // Filter and search articles
  const filteredArticles = articles.filter(article => {
    const matchesTab = activeTab === 'ALL' || article.status === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Articles & Guides</h1>
          <p className="admin-page-subtitle">
            Create, edit, publish, and manage wildlife stories, safari guides, and photography tips.
          </p>
        </div>
        <button className="admin-btn admin-btn-accent" onClick={handleOpenAddModal}>
          <Plus size={16} /> Write Article
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="admin-article-controls">
        <div className="admin-article-tabs">
          <button
            className={`admin-article-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All ({articles.length})
          </button>
          <button
            className={`admin-article-tab-btn ${activeTab === 'PUBLISHED' ? 'active' : ''}`}
            onClick={() => setActiveTab('PUBLISHED')}
          >
            Published ({articles.filter(a => a.status === 'PUBLISHED').length})
          </button>
          <button
            className={`admin-article-tab-btn ${activeTab === 'DRAFT' ? 'active' : ''}`}
            onClick={() => setActiveTab('DRAFT')}
          >
            Drafts ({articles.filter(a => a.status === 'DRAFT').length})
          </button>
          <button
            className={`admin-article-tab-btn ${activeTab === 'ARCHIVED' ? 'active' : ''}`}
            onClick={() => setActiveTab('ARCHIVED')}
          >
            Archived ({articles.filter(a => a.status === 'ARCHIVED').length})
          </button>
        </div>

        <div className="admin-article-search-wrapper">
          <Search size={16} className="admin-article-search-icon" />
          <input
            type="text"
            placeholder="Search articles by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-article-search-input"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="admin-loading-state">
          <LoadingSpinner message="Loading articles..." />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="admin-card">
          <div className="admin-article-empty-state">
            <BookOpen className="admin-article-empty-icon" />
            <h3 className="admin-article-empty-title">
              {searchQuery ? 'No Matching Articles Found' : 'No Articles Found'}
            </h3>
            <p className="admin-article-empty-desc">
              {searchQuery
                ? 'Try adjusting your search query or switching tabs.'
                : 'Start sharing wildlife insights by writing your first article.'}
            </p>
            {!searchQuery && (
              <button
                className="admin-btn admin-btn-accent"
                style={{ marginTop: '1.25rem' }}
                onClick={handleOpenAddModal}
              >
                <Plus size={16} /> Write Article Now
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-articles-grid">
          {filteredArticles.map(article => (
            <div key={article.id} className="admin-article-card">
              <div className="admin-article-card-media">
                {article.featuredImage || article.image ? (
                  <img
                    src={article.featuredImage || article.image}
                    alt={article.title}
                    className="admin-article-card-img"
                  />
                ) : (
                  <div className="admin-article-no-img">
                    <FileText size={28} />
                    <span>No cover image</span>
                  </div>
                )}
                <span className={`admin-article-status-badge ${article.status?.toLowerCase() || 'draft'}`}>
                  {article.status || 'DRAFT'}
                </span>
              </div>

              <div className="admin-article-card-body">
                {article.tags && article.tags.length > 0 && (
                  <div className="admin-article-tags-row">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="admin-article-tag">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="admin-article-tag more">+{article.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <h3 className="admin-article-card-title">{article.title}</h3>

                <p className="admin-article-card-excerpt">
                  {article.excerpt || (article.content ? article.content.substring(0, 110) + '...' : '')}
                </p>

                <div className="admin-article-card-meta">
                  {article.destination && (
                    <span className="admin-article-meta-item">
                      <MapPin size={12} /> {article.destination.name}
                    </span>
                  )}
                  <span className="admin-article-meta-item">
                    <Calendar size={12} /> {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="admin-article-card-actions">
                  <div className="admin-article-actions-left">
                    <Link
                      to={`/articles/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-action-btn view"
                      title="Preview article"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      className="admin-action-btn edit"
                      onClick={() => handleOpenEditModal(article)}
                      title="Edit article"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => handleDelete(article.id, article.title)}
                      title="Delete article"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="admin-article-actions-right">
                    {article.status === 'DRAFT' && (
                      <button
                        className="admin-status-btn publish"
                        onClick={() => handlePublish(article.id)}
                        title="Publish this article"
                      >
                        <CheckCircle size={13} /> Publish
                      </button>
                    )}
                    {article.status === 'PUBLISHED' && (
                      <button
                        className="admin-status-btn archive"
                        onClick={() => handleArchive(article.id)}
                        title="Archive this article"
                      >
                        <Archive size={13} /> Archive
                      </button>
                    )}
                    {article.status === 'ARCHIVED' && (
                      <button
                        className="admin-status-btn publish"
                        onClick={() => handlePublish(article.id)}
                        title="Restore & publish"
                      >
                        <CheckCircle size={13} /> Re-publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content admin-article-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedArticle ? 'Edit Wildlife Article' : 'Write New Wildlife Article'}</h2>
              <button className="modal-close" onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form admin-article-form">
              <div className="form-group">
                <label htmlFor="article-title" className="form-label required">
                  Article Title
                </label>
                <input
                  id="article-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Ultimate Guide to Tiger Safaris in Tadoba"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  minLength={3}
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="article-destination" className="form-label">
                    Related Wildlife Destination
                  </label>
                  <select
                    id="article-destination"
                    className="form-select"
                    value={formData.destinationId}
                    onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                  >
                    <option value="">General Wildlife / No Specific Park</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="article-status" className="form-label">
                    Initial Status
                  </label>
                  <select
                    id="article-status"
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                  >
                    <option value="PUBLISHED">Published (Visible to all users)</option>
                    <option value="DRAFT">Draft (Saved privately)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="article-image" className="form-label">
                  Featured Cover Image URL
                </label>
                <input
                  id="article-image"
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/... or image link"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                />
                <span className="form-helper-text">
                  Provide a high-resolution image link for the article banner.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="article-tags" className="form-label">
                  Tags & Categories
                </label>
                <input
                  id="article-tags"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Tiger Safari, Photography, Travel Guide, Tadoba"
                  value={formData.tagsString}
                  onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                />
                <span className="form-helper-text">
                  Separate multiple tags with commas.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="article-content" className="form-label required">
                  Article Body / Content
                </label>
                <textarea
                  id="article-content"
                  className="form-textarea admin-article-content-area"
                  rows={10}
                  placeholder="Write the full story, safari guide, tips, and insights here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  minLength={10}
                ></textarea>
                <span className="form-helper-text">
                  Paragraph breaks will be formatted cleanly on the public article view.
                </span>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : selectedArticle
                      ? 'Update Article'
                      : formData.status === 'PUBLISHED'
                        ? 'Publish Article'
                        : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;

