/* ==========================================================
   Partner Businesses Management Component (Minimal & Clean)
   ========================================================== */

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../../services/business.service';
import {
  Plus,
  Edit2,
  Send,
  Eye,
  Building2,
  MapPin,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import '../../../styles/partner/MyBusinesses.css';

export const MyBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_REVIEW' | 'DRAFT'>('ALL');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      const data = await businessService.getMyBusinesses();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSubmitForReview = async (id: string) => {
    if (!window.confirm('Submit this listing for admin review?')) return;
    try {
      setSubmittingId(id);
      await businessService.submitForReview(id);
      toast.success('Submitted for review!');
      await fetchBusinesses();
    } catch (error: any) {
      console.error('Error submitting for review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please check required details.');
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'DRAFT' ? b.status === 'DRAFT' || b.status === 'REJECTED' : b.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [businesses, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="min-badge min-badge-active">
            <CheckCircle size={12} /> Active
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="min-badge min-badge-pending">
            <Clock size={12} /> In Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="min-badge min-badge-rejected">
            <AlertCircle size={12} /> Needs Edit
          </span>
        );
      case 'DRAFT':
      default:
        return <span className="min-badge min-badge-draft">Draft</span>;
    }
  };

  const formatType = (type: string) => {
    switch (type) {
      case 'RESORT':
        return 'Resort';
      case 'TAXI':
        return 'Safari Vehicle';
      case 'CAMERA_RENTAL':
        return 'Equipment';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your businesses..." />;
  }

  return (
    <div className="min-businesses-page">
      <div className="min-businesses-container">
        {/* Minimal Header */}
        <header className="min-businesses-header">
          <div>
            <h1 className="min-businesses-title">My Businesses</h1>
            <p className="min-businesses-subtitle">
              {businesses.length} {businesses.length === 1 ? 'listing' : 'listings'} registered
            </p>
          </div>
          <Link to="/partner/businesses/new" className="min-btn-primary">
            <Plus size={16} />
            <span>Add Business</span>
          </Link>
        </header>

        {/* Minimal Search & Filter Bar */}
        {businesses.length > 0 && (
          <div className="min-controls-bar">
            <div className="min-search-wrap">
              <Search size={16} className="min-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="min-search-input"
              />
            </div>

            <div className="min-filter-tabs">
              <button
                type="button"
                className={`min-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All
              </button>
              <button
                type="button"
                className={`min-tab ${statusFilter === 'APPROVED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('APPROVED')}
              >
                Active
              </button>
              <button
                type="button"
                className={`min-tab ${statusFilter === 'PENDING_REVIEW' ? 'active' : ''}`}
                onClick={() => setStatusFilter('PENDING_REVIEW')}
              >
                In Review
              </button>
              <button
                type="button"
                className={`min-tab ${statusFilter === 'DRAFT' ? 'active' : ''}`}
                onClick={() => setStatusFilter('DRAFT')}
              >
                Drafts
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 ? (
          <div className="min-empty-state">
            <div className="min-empty-icon">
              <Building2 size={28} />
            </div>
            <h3>No businesses found</h3>
            <p>
              {searchQuery || statusFilter !== 'ALL'
                ? 'No listings match your search criteria.'
                : 'Get started by creating your first business listing on WildConnect.'}
            </p>
            {searchQuery || statusFilter !== 'ALL' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="min-btn-secondary"
              >
                Reset Filters
              </button>
            ) : (
              <Link to="/partner/businesses/new" className="min-btn-primary">
                <Plus size={16} />
                <span>Create Listing</span>
              </Link>
            )}
          </div>
        ) : (
          /* Minimal Cards Grid */
          <div className="min-card-grid">
            {filteredBusinesses.map((biz) => {
              const coverImg =
                biz.coverImage ||
                (biz.images && biz.images[0]) ||
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';

              const isDraft = biz.status === 'DRAFT';
              const isRejected = biz.status === 'REJECTED';

              return (
                <div key={biz.id} className="min-card">
                  <div className="min-card-top">
                    <img
                      src={coverImg}
                      alt={biz.name}
                      className="min-card-thumbnail"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="min-card-details">
                      <div className="min-card-header-line">
                        <span className="min-card-type">{formatType(biz.type)}</span>
                        {getStatusBadge(biz.status)}
                      </div>
                      <h3 className="min-card-name">{biz.name}</h3>
                      <div className="min-card-location">
                        <MapPin size={13} />
                        <span>{biz.destination?.name || 'Central Reserve'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Note */}
                  {isRejected && biz.rejectionReason && (
                    <div className="min-rejection-note">
                      <strong>Admin note:</strong> {biz.rejectionReason}
                    </div>
                  )}

                  {/* Clean Bottom Action Row */}
                  <div className="min-card-actions">
                    <button
                      type="button"
                      onClick={() => navigate(`/partner/businesses/${biz.id}`)}
                      className="min-action-link"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/partner/businesses/${biz.id}/edit`)}
                      className="min-action-link"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>

                    {(isDraft || isRejected) && (
                      <button
                        type="button"
                        onClick={() => handleSubmitForReview(biz.id)}
                        disabled={submittingId === biz.id}
                        className="min-action-submit"
                      >
                        <Send size={13} />
                        <span>{submittingId === biz.id ? 'Sending...' : 'Submit'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBusinesses;
