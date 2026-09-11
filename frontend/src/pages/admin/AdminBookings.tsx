import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Search,
  Check,
} from 'lucide-react';
import { bookingService, type Booking } from '../../services/booking.service';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminBookings.css';
import '../../styles/globals/tables.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await bookingService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else if (Array.isArray(res)) {
        setBookings(res);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to fetch admin bookings:', error);
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      setUpdatingId(id);
      const res = await bookingService.updateStatus(id, newStatus);
      if (res.success) {
        toast.success(`Booking marked as ${newStatus.toLowerCase()}`);
        fetchBookings();
      } else {
        toast.error(res.message || 'Failed to update booking status');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="admin-badge success"><CheckCircle size={12} /> Confirmed</span>;
      case 'COMPLETED':
        return <span className="admin-badge info"><Check size={12} /> Completed</span>;
      case 'CANCELLED':
        return <span className="admin-badge danger"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="admin-badge neutral">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = activeFilter === 'ALL' || b.status === activeFilter;
    const userName = b.user ? `${b.user.firstName} ${b.user.lastName}`.toLowerCase() : '';
    const userEmail = b.user?.email?.toLowerCase() || '';
    const destName = b.destination?.name?.toLowerCase() || '';
    const bookingId = b.id.toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      userName.includes(query) ||
      userEmail.includes(query) ||
      destName.includes(query) ||
      bookingId.includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings Management</h1>
          <p className="admin-page-subtitle">View, track, and manage confirmed wildlife safari tour bookings.</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="admin-bookings-controls">
        <div className="admin-bookings-tabs">
          <button
            className={`admin-tab-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`admin-tab-btn ${activeFilter === 'CONFIRMED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('CONFIRMED')}
          >
            Confirmed ({bookings.filter((b) => b.status === 'CONFIRMED').length})
          </button>
          <button
            className={`admin-tab-btn ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('COMPLETED')}
          >
            Completed ({bookings.filter((b) => b.status === 'COMPLETED').length})
          </button>
          <button
            className={`admin-tab-btn ${activeFilter === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('CANCELLED')}
          >
            Cancelled ({bookings.filter((b) => b.status === 'CANCELLED').length})
          </button>
        </div>

        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search traveler, destination, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings Table / Content */}
      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: '3rem 0' }}>
            <LoadingSpinner message="Loading all bookings..." />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="admin-booking-empty-state">
            <Calendar className="admin-booking-empty-icon" />
            <h3 className="admin-booking-empty-title">No Bookings Found</h3>
            <p className="admin-booking-empty-desc">
              {bookings.length === 0
                ? 'No safari tour bookings have been created yet.'
                : 'No bookings match your selected filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking Reference</th>
                  <th>Traveler</th>
                  <th>Destination</th>
                  <th>Dates & Guests</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const startDateStr = new Date(booking.startDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const endDateStr = new Date(booking.endDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={booking.id}>
                      <td>
                        <span className="admin-booking-ref-id">#{booking.id.slice(0, 8)}</span>
                        <div className="admin-booking-created-date">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td>
                        <div className="admin-traveler-info">
                          <strong>
                            {booking.user
                              ? `${booking.user.firstName} ${booking.user.lastName}`
                              : 'Unknown Traveler'}
                          </strong>
                          <span className="admin-traveler-email">{booking.user?.email}</span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-booking-dest">
                          <MapPin size={14} className="admin-dest-icon" />
                          <span>{booking.destination?.name || 'Destination'}</span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-booking-dates">
                          <span>{startDateStr} - {endDateStr}</span>
                          <span className="admin-booking-guests">
                            <Users size={12} /> {booking.travelerCount} {booking.travelerCount === 1 ? 'Traveler' : 'Travelers'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong className="admin-booking-amount">
                          ₹{booking.totalAmount ? booking.totalAmount.toLocaleString('en-IN') : '0'}
                        </strong>
                      </td>

                      <td>{getStatusBadge(booking.status)}</td>

                      <td>
                        <div className="admin-booking-actions">
                          {booking.status === 'CONFIRMED' && (
                            <>
                              <button
                                className="admin-action-btn complete-btn"
                                onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                                disabled={updatingId === booking.id}
                                title="Mark Booking as Completed"
                              >
                                Complete
                              </button>
                              <button
                                className="admin-action-btn cancel-btn"
                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                disabled={updatingId === booking.id}
                                title="Cancel Booking"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status !== 'CONFIRMED' && (
                            <button
                              className="admin-action-btn reinstate-btn"
                              onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                              disabled={updatingId === booking.id}
                              title="Re-open/Confirm Booking"
                            >
                              Reinstate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
