import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Map, Tent, Calendar, Bell, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  tripRequestService,
  type TripRequest,
} from '../../../services/triprequest.service';
import {
  bookingService,
  type Booking,
} from '../../../services/booking.service';
import {
  notificationService,
  type Notification,
} from '../../../services/notification.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import '../../../styles/pages/Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [reqRes, bookRes, notifRes] = await Promise.all([
          tripRequestService.getMyRequests(),
          bookingService.getMyBookings(),
          notificationService.getMyNotifications(),
        ]);

        /*
         * API responses are expected to follow:
         *
         * {
         *   success: true,
         *   message: "...",
         *   data: [...]
         * }
         *
         * However, normalize the data here so the dashboard
         * always works with arrays.
         */

        if (reqRes.success) {
          const requestData = Array.isArray(reqRes.data)
            ? reqRes.data
            : Array.isArray(reqRes.data?.requests)
              ? reqRes.data.requests
              : [];

          setRequests(requestData);
        }

        if (bookRes.success) {
          const bookingData = Array.isArray(bookRes.data)
            ? bookRes.data
            : Array.isArray(bookRes.data?.bookings)
              ? bookRes.data.bookings
              : [];

          setBookings(bookingData);
        }

        if (notifRes.success) {
          const notificationData = Array.isArray(notifRes.data)
            ? notifRes.data
            : Array.isArray(notifRes.data?.notifications)
              ? notifRes.data.notifications
              : [];

          setNotifications(notificationData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);

        // Keep dashboard state safe even when the API fails.
        setRequests([]);
        setBookings([]);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  // ============================================================
  // Calculated Stats
  // ============================================================

  const pendingRequests = requests.filter(
    (request) => request.status === 'PENDING'
  ).length;

  const upcomingBookingsCount = bookings.filter(
    (booking) => booking.status === 'CONFIRMED'
  ).length;

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const proposalsCount = requests.filter(
    (request) => request.status === 'PROPOSAL_READY'
  ).length;

  const proposalsSubtext =
    proposalsCount > 0
      ? `${proposalsCount} await review`
      : 'No proposals';

  // ============================================================
  // Find Upcoming Trip
  // ============================================================

  const confirmedBookings = [...bookings]
    .filter((booking) => booking.status === 'CONFIRMED')
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );

  const upcomingTrip = confirmedBookings[0] || null;

  // ============================================================
  // Format Dates
  // ============================================================

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard-container fade-in">

      {/* Admin Banner */}
      {user?.role === 'ADMIN' && (
        <div className="dashboard-admin-banner">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="dashboard-admin-banner-indicator"></span>

            You are logged in as an Administrator
          </div>

          <Link
            to="/admin"
            className="text-link"
            style={{
              color: '#8c6a34',
              fontWeight: 700,
            }}
          >
            Go to Admin Panel &rarr;
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-header-title">
            Good morning, {user?.firstName} 👋
          </h1>

          <p className="dashboard-header-subtitle">
            Here's what's happening with your wildlife trips.
          </p>
        </div>

        <Link
          to="/trip-request/new"
          className="quick-action-btn primary-action"
          style={{
            padding: '0.875rem 1.5rem',
            margin: 0,
          }}
        >
          <Plus size={18} />
          New Trip Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">

        {/* Trip Requests */}
        <Link
          to="/dashboard/requests"
          className="dashboard-stat-card dashboard-stat-card-trip"
        >
          <div className="dashboard-stat-icon-container dashboard-stat-icon-trip">
            <Calendar size={24} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="dashboard-stat-label">
              Trip Requests
            </div>

            <div className="dashboard-stat-value">
              {requests.length}
            </div>

            <div className="dashboard-stat-subtext">
              {pendingRequests} pending review
            </div>
          </div>
        </Link>

        {/* Bookings */}
        <Link
          to="/dashboard/bookings"
          className="dashboard-stat-card dashboard-stat-card-booking"
        >
          <div className="dashboard-stat-icon-container dashboard-stat-icon-booking">
            <Tent size={24} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="dashboard-stat-label">
              Bookings
            </div>

            <div className="dashboard-stat-value">
              {bookings.length}
            </div>

            <div className="dashboard-stat-subtext">
              {upcomingBookingsCount} upcoming
            </div>
          </div>
        </Link>

        {/* Proposals */}
        <Link
          to="/dashboard/requests"
          className="dashboard-stat-card dashboard-stat-card-proposal"
        >
          <div className="dashboard-stat-icon-container dashboard-stat-icon-proposal">
            <Map size={24} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="dashboard-stat-label">
              Proposals
            </div>

            <div className="dashboard-stat-value">
              {proposalsCount}
            </div>

            <div className="dashboard-stat-subtext">
              {proposalsSubtext}
            </div>
          </div>
        </Link>

        {/* Notifications */}
        <Link
          to="/dashboard/notifications"
          className="dashboard-stat-card dashboard-stat-card-notif"
        >
          <div className="dashboard-stat-icon-container dashboard-stat-icon-notif">
            <Bell size={24} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="dashboard-stat-label">
              Updates
            </div>

            <div className="dashboard-stat-value">
              {unreadNotificationsCount}
            </div>

            <div className="dashboard-stat-subtext">
              {unreadNotificationsCount} unread
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-main-layout">

        {/* Left Column */}
        <div>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              Your Trip Requests
            </h2>

            <Link
              to="/dashboard/requests"
              className="dashboard-section-link"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="dashboard-list-card">
            {requests.length === 0 ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                }}
              >
                <p>
                  No trip requests found. Start planning your adventure!
                </p>
              </div>
            ) : (
              requests.slice(0, 3).map((req) => {
                const proposalId =
                  (req as any).proposals?.[0]?.id;

                const isProposalAvailable =
                  req.status === 'PROPOSAL_READY' && proposalId;

                const itemLink = isProposalAvailable
                  ? `/dashboard/proposals/${proposalId}`
                  : `/dashboard/requests`;

                return (
                  <Link
                    to={itemLink}
                    key={req.id}
                    className="dashboard-list-item"
                  >
                    <div>
                      <h3 className="dashboard-item-title">
                        {req.destination?.name ||
                          'WildConnect Destination'}
                      </h3>

                      <div className="dashboard-item-meta">
                        <span>
                          {formatDate(req.startDate)} -{' '}
                          {formatDate(req.endDate)}
                        </span>

                        <span className="dashboard-item-meta-dot"></span>

                        <span
                          style={{
                            color:
                              req.status === 'BOOKED' ||
                                req.status === 'ACCEPTED'
                                ? '#2E7559'
                                : req.status === 'PENDING' ||
                                  req.status === 'REVIEWING'
                                  ? '#D96B27'
                                  : req.status === 'PROPOSAL_READY'
                                    ? '#1e40af'
                                    : 'inherit',
                            fontWeight: 600,
                          }}
                        >
                          {req.status === 'PROPOSAL_READY'
                            ? 'Proposal Available'
                            : req.status === 'PENDING'
                              ? 'Reviewing'
                              : req.status}
                        </span>
                      </div>
                    </div>

                    <div className="dashboard-item-action">
                      {isProposalAvailable ? (
                        <span
                          className="view-proposal-btn-inline"
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor:
                              'rgba(var(--primary), 0.08)',
                            color: 'var(--color-primary)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border:
                              '1px solid rgba(var(--primary), 0.2)',
                          }}
                        >
                          View Proposal
                        </span>
                      ) : (
                        <>View &rarr;</>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              Quick Actions
            </h2>
          </div>

          <div className="dashboard-quick-actions">

            <Link
              to="/trip-request/new"
              className="quick-action-btn primary-action"
            >
              <Plus size={18} />
              New Trip Request
            </Link>

            <Link
              to="/dashboard/bookings"
              className="quick-action-btn"
            >
              <MapPin size={18} />
              View My Bookings
            </Link>

            <Link
              to="/destinations"
              className="quick-action-btn"
            >
              <Map size={18} />
              Explore Destinations
            </Link>

          </div>
        </div>
      </div>

      {/* Upcoming Trip */}
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">
          Upcoming Trip
        </h2>
      </div>

      {upcomingTrip ? (
        <div className="upcoming-trip-card">
          <div>
            <h3 className="upcoming-trip-title">
              {upcomingTrip.destination?.name ||
                'WildConnect Destination'}
            </h3>

            <div className="upcoming-trip-details">
              <span>
                {formatDate(upcomingTrip.startDate)} -{' '}
                {formatDate(upcomingTrip.endDate)}
              </span>

              <span className="dashboard-item-meta-dot"></span>

              <span>
                {upcomingTrip.travelerCount} Travelers
              </span>

              <span className="dashboard-item-meta-dot"></span>

              <span className="upcoming-trip-status">
                {upcomingTrip.status}
              </span>
            </div>
          </div>

          <Link
            to="/dashboard/bookings"
            className="dashboard-section-link"
            style={{
              fontSize: '1rem',
              padding: '0.75rem 1.25rem',
              border: '1px solid #C19A5B',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            View Booking &rarr;
          </Link>
        </div>
      ) : (
        <div
          className="upcoming-trip-card"
          style={{
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 1rem 0',
                color: 'var(--color-text-muted)',
              }}
            >
              No upcoming trips yet.
            </p>

            <Link
              to="/destinations"
              className="dashboard-section-link"
            >
              Plan a Trip &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;