import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Map, Tent, Calendar, Bell, MapPin, Plus, ArrowRight, Clock, CheckCircle } from 'lucide-react';
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
import '../../../styles/tourist/Dashboard.css';

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
        console.error('Failed to fetch tourist dashboard data', error);
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
    return <LoadingSpinner message="Loading your wildlife dashboard..." />;
  }

  // Calculated Stats
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

  // Find Upcoming Trip
  const confirmedBookings = [...bookings]
    .filter((booking) => booking.status === 'CONFIRMED')
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );

  const upcomingTrip = confirmedBookings[0] || null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="tourist-status-badge badge-warning">
            <Clock size={12} /> Pending Review
          </span>
        );
      case 'PROPOSAL_READY':
        return (
          <span className="tourist-status-badge badge-info">
            <CheckCircle size={12} /> Proposal Ready
          </span>
        );
      case 'ACCEPTED':
      case 'BOOKED':
        return (
          <span className="tourist-status-badge badge-success">
            <CheckCircle size={12} /> Confirmed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="tourist-status-badge badge-danger">
            Declined
          </span>
        );
      default:
        return <span className="tourist-status-badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="tourist-dashboard-page">
      <div className="tourist-dashboard-container">

        {/* Admin Switch Banner */}
        {user?.role === 'ADMIN' && (
          <div className="tourist-admin-banner">
            <div className="tourist-admin-banner-content">
              <span className="tourist-admin-banner-indicator"></span>
              <span>You are logged in as an Administrator (Viewing Traveler Mode)</span>
            </div>
            <Link to="/admin" className="tourist-admin-banner-link">
              <span>Go to Admin Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* =========================================
            1. PAGE HEADER
        ========================================= */}
        <header className="tourist-dashboard-header">
          <div className="tourist-dashboard-header-text">
            <span className="tourist-dashboard-eyebrow">
              TRAVELER MISSION CONTROL
            </span>
            <h1 className="tourist-dashboard-title">
              Good day, {user?.firstName || 'Traveler'} 👋
            </h1>
            <p className="tourist-dashboard-subtitle">
              Manage your wildlife safaris, incoming proposals, and reserve bookings.
            </p>
          </div>

          <div className="tourist-dashboard-header-action">
            <Link
              to="/trip-request/new"
              className="tourist-primary-btn"
            >
              <Plus size={18} />
              <span>Plan New Safari</span>
            </Link>
          </div>
        </header>

        {/* =========================================
            2. STATISTICS GRID (4 STAT CARDS)
        ========================================= */}
        <div className="tourist-stats-grid">

          {/* Card 1: Trip Requests */}
          <Link to="/dashboard/requests" className="tourist-stat-card">
            <div className="tourist-stat-top">
              <div className="tourist-stat-icon-box icon-amber">
                <Calendar size={20} />
              </div>
              <span className="tourist-stat-eyebrow">SAFARIS</span>
            </div>
            <div className="tourist-stat-bottom">
              <span className="tourist-stat-label">Trip Requests</span>
              <span className="tourist-stat-value">{requests.length}</span>
              <span className="tourist-stat-subtext">
                {pendingRequests > 0 ? `${pendingRequests} under review` : 'All requests up to date'}
              </span>
            </div>
          </Link>

          {/* Card 2: Confirmed Bookings */}
          <Link to="/dashboard/bookings" className="tourist-stat-card">
            <div className="tourist-stat-top">
              <div className="tourist-stat-icon-box icon-green">
                <Tent size={20} />
              </div>
              <span className="tourist-stat-eyebrow">RESERVATIONS</span>
            </div>
            <div className="tourist-stat-bottom">
              <span className="tourist-stat-label">Bookings</span>
              <span className="tourist-stat-value">{bookings.length}</span>
              <span className="tourist-stat-subtext">
                {upcomingBookingsCount > 0 ? `${upcomingBookingsCount} upcoming stay(s)` : 'No active bookings'}
              </span>
            </div>
          </Link>

          {/* Card 3: Ready Proposals */}
          <Link to="/dashboard/requests" className="tourist-stat-card">
            <div className="tourist-stat-top">
              <div className="tourist-stat-icon-box icon-blue">
                <Map size={20} />
              </div>
              <span className="tourist-stat-eyebrow">PROPOSALS</span>
            </div>
            <div className="tourist-stat-bottom">
              <span className="tourist-stat-label">Curated Proposals</span>
              <span className="tourist-stat-value">{proposalsCount}</span>
              <span className="tourist-stat-subtext">
                {proposalsCount > 0 ? `${proposalsCount} ready for review` : 'No pending proposals'}
              </span>
            </div>
          </Link>

          {/* Card 4: Updates & Notifications */}
          <Link to="/dashboard/notifications" className="tourist-stat-card">
            <div className="tourist-stat-top">
              <div className="tourist-stat-icon-box icon-purple">
                <Bell size={20} />
              </div>
              <span className="tourist-stat-eyebrow">ALERTS</span>
            </div>
            <div className="tourist-stat-bottom">
              <span className="tourist-stat-label">Notifications</span>
              <span className="tourist-stat-value">{unreadNotificationsCount}</span>
              <span className="tourist-stat-subtext">
                {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread updates` : 'All caught up'}
              </span>
            </div>
          </Link>

        </div>

        {/* =========================================
            3. UPCOMING TRIP HIGHLIGHT (IF AVAILABLE)
        ========================================= */}
        {upcomingTrip ? (
          <div className="tourist-upcoming-card">
            <div className="tourist-upcoming-left">
              <div className="tourist-upcoming-badge">
                <Tent size={14} />
                <span>NEXT EXPEDITION</span>
              </div>
              <h3 className="tourist-upcoming-title">
                {upcomingTrip.destination?.name || 'WildConnect Destination Reserve'}
              </h3>
              <div className="tourist-upcoming-meta">
                <span>{formatDate(upcomingTrip.startDate)} - {formatDate(upcomingTrip.endDate)}</span>
                <span className="tourist-meta-dot">•</span>
                <span>{upcomingTrip.travelerCount || 1} Traveler(s)</span>
                <span className="tourist-meta-dot">•</span>
                <span className="tourist-upcoming-status-text">Confirmed Booking</span>
              </div>
            </div>

            <div className="tourist-upcoming-action">
              <Link to="/dashboard/bookings" className="tourist-upcoming-btn">
                <span>View Booking Voucher</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : null}

        {/* =========================================
            4. LOWER CONTENT GRID (2 COLUMNS)
        ========================================= */}
        <div className="tourist-dashboard-content-grid">

          {/* Left Column: Recent Trip Requests */}
          <div className="tourist-card tourist-requests-card">
            <div className="tourist-card-header">
              <div>
                <span className="tourist-section-kicker">SAFARI PLANNING</span>
                <h2 className="tourist-card-title">Recent Trip Requests</h2>
              </div>
              <Link to="/dashboard/requests" className="tourist-view-all-link">
                <span>View All</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="tourist-requests-list">
              {requests.length === 0 ? (
                <div className="tourist-empty-state">
                  <MapPin size={32} className="tourist-empty-icon" />
                  <p className="tourist-empty-title">No Safari Requests Yet</p>
                  <p className="tourist-empty-subtitle">
                    Ready to explore India's tiger reserves? Create your first custom itinerary request.
                  </p>
                  <Link to="/trip-request/new" className="tourist-empty-action-btn">
                    <Plus size={16} />
                    <span>Plan a Trip</span>
                  </Link>
                </div>
              ) : (
                requests.slice(0, 4).map((req) => {
                  const proposalId = (req as any).proposals?.[0]?.id;
                  const isProposalAvailable = req.status === 'PROPOSAL_READY' && proposalId;
                  const itemLink = isProposalAvailable
                    ? `/dashboard/proposals/${proposalId}`
                    : `/dashboard/requests`;

                  return (
                    <Link
                      to={itemLink}
                      key={req.id}
                      className="tourist-request-item"
                    >
                      <div className="tourist-request-main">
                        <div className="tourist-request-icon-wrap">
                          <MapPin size={18} />
                        </div>
                        <div className="tourist-request-info">
                          <h4 className="tourist-request-title">
                            {req.destination?.name || 'Custom Wildlife Safari'}
                          </h4>
                          <div className="tourist-request-meta">
                            <span>{formatDate(req.startDate)} - {formatDate(req.endDate)}</span>
                            <span className="tourist-meta-dot">•</span>
                            <span>{req.travelerCount || 1} Travelers</span>
                          </div>
                        </div>
                      </div>

                      <div className="tourist-request-status-wrap">
                        {getRequestStatusBadge(req.status)}
                        <ArrowRight size={16} className="tourist-item-arrow" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Quick Access & Discover */}
          <div className="tourist-card tourist-quick-card">
            <div className="tourist-card-header">
              <div>
                <span className="tourist-section-kicker">EXPLORATION</span>
                <h2 className="tourist-card-title">Quick Actions</h2>
              </div>
            </div>

            <div className="tourist-quick-list">
              <Link to="/trip-request/new" className="tourist-quick-item group-highlight">
                <div className="tourist-quick-item-left">
                  <div className="tourist-quick-icon-box box-amber">
                    <Plus size={19} />
                  </div>
                  <div className="tourist-quick-info">
                    <span className="tourist-quick-item-title">Plan New Safari</span>
                    <span className="tourist-quick-item-subtitle">Request tailored itinerary & quotes</span>
                  </div>
                </div>
                <ArrowRight size={18} className="tourist-quick-arrow" />
              </Link>

              <Link to="/dashboard/bookings" className="tourist-quick-item">
                <div className="tourist-quick-item-left">
                  <div className="tourist-quick-icon-box box-green">
                    <Tent size={19} />
                  </div>
                  <div className="tourist-quick-info">
                    <span className="tourist-quick-item-title">My Bookings</span>
                    <span className="tourist-quick-item-subtitle">View stay vouchers & schedules</span>
                  </div>
                </div>
                <ArrowRight size={18} className="tourist-quick-arrow" />
              </Link>

              <Link to="/destinations" className="tourist-quick-item">
                <div className="tourist-quick-item-left">
                  <div className="tourist-quick-icon-box box-forest">
                    <Map size={19} />
                  </div>
                  <div className="tourist-quick-info">
                    <span className="tourist-quick-item-title">Explore Reserves</span>
                    <span className="tourist-quick-item-subtitle">Browse top tiger reserves & parks</span>
                  </div>
                </div>
                <ArrowRight size={18} className="tourist-quick-arrow" />
              </Link>

              <Link to="/resorts" className="tourist-quick-item">
                <div className="tourist-quick-item-left">
                  <div className="tourist-quick-icon-box box-blue">
                    <Tent size={19} />
                  </div>
                  <div className="tourist-quick-info">
                    <span className="tourist-quick-item-title">Jungle Resorts</span>
                    <span className="tourist-quick-item-subtitle">Eco-lodges and luxury stays</span>
                  </div>
                </div>
                <ArrowRight size={18} className="tourist-quick-arrow" />
              </Link>

              <Link to="/articles" className="tourist-quick-item">
                <div className="tourist-quick-item-left">
                  <div className="tourist-quick-icon-box box-neutral">
                    <Calendar size={19} />
                  </div>
                  <div className="tourist-quick-info">
                    <span className="tourist-quick-item-title">Safari Guides & Tips</span>
                    <span className="tourist-quick-item-subtitle">Best sighting seasons & advice</span>
                  </div>
                </div>
                <ArrowRight size={18} className="tourist-quick-arrow" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;