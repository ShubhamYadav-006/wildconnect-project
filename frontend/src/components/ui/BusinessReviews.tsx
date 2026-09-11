import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../../styles/public/BusinessReviews.css';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface BusinessReviewsProps {
  businessId: string;
}

const BusinessReviews: React.FC<BusinessReviewsProps> = ({ businessId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  // Review Form State
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchUserBookings();
  }, [businessId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/business-reviews/business/${businessId}`);
      setReviews(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await api.get('/business-bookings/my');
      const allBookings = Array.isArray(res?.data?.data) ? res.data.data : [];
      const eligible = allBookings.filter(
        (b: any) => b.business?.id === businessId && !b.review
      );
      setUserBookings(eligible);
      if (eligible.length > 0) {
        setSelectedBookingId(eligible[0].id);
      }
    } catch (err) {
      // Ignored for unauthenticated users
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      toast.error('Please select a valid booking');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/business-reviews', {
        businessBookingId: selectedBookingId,
        rating,
        comment,
      });
      toast.success('Thank you for your review!');
      setShowReviewModal(false);
      fetchReviews();
      fetchUserBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="business-reviews-section">
      <div className="reviews-header">
        <div>
          <h2>Guest Reviews & Ratings</h2>
          {avgRating && (
            <div className="avg-rating-badge">
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span>{avgRating} / 5</span>
              <span className="reviews-count">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        {userBookings.length > 0 && (
          <button className="btn-secondary" onClick={() => setShowReviewModal(true)}>
            <Plus size={16} /> Write a Review
          </button>
        )}
      </div>

      {loading ? (
        <div className="no-reviews-state">
          <p>Loading verified reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews-state">
          <MessageSquare size={32} />
          <p>No reviews yet. Be the first to book and share your experience!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-card-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {r.user.firstName[0]}
                  </div>
                  <div>
                    <strong>{r.user.firstName} {r.user.lastName}</strong>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < r.rating ? '#f59e0b' : 'none'}
                      color={i < r.rating ? '#f59e0b' : '#d1d5db'}
                    />
                  ))}
                </div>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Leave a Review</h2>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Select Verified Stay:</label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  required
                >
                  {userBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.room.name} ({new Date(b.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rating:</label>
                <div className="star-rating-select">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="star-btn"
                    >
                      <Star
                        size={24}
                        fill={s <= rating ? '#f59e0b' : 'none'}
                        color={s <= rating ? '#f59e0b' : '#d1d5db'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Feedback:</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="Share details of your experience, service quality, hospitality..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessReviews;
