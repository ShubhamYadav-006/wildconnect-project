import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Users, Map, Tent, FileText, Activity, Clock, CheckCircle, XCircle, ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { destinationService } from '../../services/destination.service';
import { resortService } from '../../services/resort.service';
import { tripRequestService } from '../../services/triprequest.service';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [destinationsCount, setDestinationsCount] = useState<number>(0);
  const [resortsCount, setResortsCount] = useState<number>(0);
  const [requests, setRequests] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destResponse, resortResponse, reqResponse] = await Promise.all([
          destinationService.getAll(),
          resortService.getAll(),
          tripRequestService.getAll()
        ]);

        if (destResponse.success) {
          setDestinationsCount(destResponse.data.length);
        }

        if (resortResponse.success) {
          setResortsCount(resortResponse.data.length);
        }

        if (reqResponse.success) {
          setRequests(reqResponse.data);

          // Calculate unique users who submitted requests, plus 1 (for admin)
          const emails = reqResponse.data.map((r: any) => r.user?.email).filter(Boolean);
          const uniqueUsersCount = new Set(emails).size;
          setUsersCount(Math.max(1, uniqueUsersCount + 1));
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="admin-badge warning"><Clock size={12} /> Pending</span>;
      case 'PROPOSAL_READY':
        return <span className="admin-badge info"><CheckCircle size={12} /> Proposal Ready</span>;
      case 'ACCEPTED':
      case 'BOOKED':
        return <span className="admin-badge success"><CheckCircle size={12} /> Confirmed</span>;
      case 'REJECTED':
        return <span className="admin-badge danger"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="admin-badge neutral">{status}</span>;
    }
  };

  return (
    <div className="admin-dashboard-page">

      {/* =========================================
          DASHBOARD HEADER
      ========================================= */}

      <div className="admin-dashboard-page-header">

        <div>
          <p className="admin-dashboard-eyebrow">
            WILDCONNECT ADMIN
          </p>

          <h1 className="admin-dashboard-page-title">
            Admin Dashboard
          </h1>

          <p className="admin-dashboard-page-subtitle">
            Welcome back, {user?.firstName || 'Admin'}.
            Here's what's happening across WildConnect.
          </p>
        </div>

        <Link
          to="/"
          className="admin-dashboard-user-button"
        >
          <Users size={17} />
          Visit User Dashboard
        </Link>

      </div>


      {/* =========================================
          STATISTICS
      ========================================= */}

      <div className="admin-grid-stats">

        {/* USERS */}

        <div className="admin-stat-card admin-stat-users">

          <div className="admin-stat-card-top">

            <div className="admin-stat-icon-wrapper blue">
              <Users size={21} />
            </div>

            <span className="admin-stat-card-label">
              USERS
            </span>

          </div>

          <div className="admin-stat-card-bottom">

            <div>
              <p className="admin-stat-label">
                Total Users
              </p>

              <p className="admin-stat-value">
                {isLoading ? '...' : usersCount}
              </p>
            </div>

          </div>

        </div>


        {/* DESTINATIONS */}

        <div className="admin-stat-card admin-stat-destinations">

          <div className="admin-stat-card-top">

            <div className="admin-stat-icon-wrapper primary">
              <Map size={21} />
            </div>

            <span className="admin-stat-card-label">
              DESTINATIONS
            </span>

          </div>

          <div className="admin-stat-card-bottom">

            <div>
              <p className="admin-stat-label">
                Destinations
              </p>

              <p className="admin-stat-value">
                {isLoading ? '...' : destinationsCount}
              </p>
            </div>

          </div>

        </div>


        {/* RESORTS */}

        <div className="admin-stat-card admin-stat-resorts">

          <div className="admin-stat-card-top">

            <div className="admin-stat-icon-wrapper green">
              <Tent size={21} />
            </div>

            <span className="admin-stat-card-label">
              STAYS
            </span>

          </div>

          <div className="admin-stat-card-bottom">

            <div>
              <p className="admin-stat-label">
                Resorts
              </p>

              <p className="admin-stat-value">
                {isLoading ? '...' : resortsCount}
              </p>
            </div>

          </div>

        </div>


        {/* TRIP REQUESTS */}

        <div className="admin-stat-card admin-stat-requests">

          <div className="admin-stat-card-top">

            <div className="admin-stat-icon-wrapper orange">
              <Activity size={21} />
            </div>

            <span className="admin-stat-card-label">
              ACTIVITY
            </span>

          </div>

          <div className="admin-stat-card-bottom">

            <div>
              <p className="admin-stat-label">
                Trip Requests
              </p>

              <p className="admin-stat-value">
                {isLoading ? '...' : requests.length}
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          LOWER DASHBOARD
      ========================================= */}

      <div className="admin-dashboard-content-grid">


        {/* =====================================
            MANAGEMENT
        ===================================== */}

        <div className="admin-card admin-dashboard-management-card">

          <div className="admin-dashboard-section-heading">

            <div>
              <p className="admin-section-kicker">
                QUICK ACCESS
              </p>

              <h2 className="admin-dashboard-menu-title">
                Management
              </h2>
            </div>

          </div>


          <div className="admin-dashboard-menu-list">

            <Link
              to="/admin/destinations"
              className="admin-dashboard-menu-link"
            >
              <span className="admin-menu-icon">
                <Map size={17} />
              </span>

              <span className="admin-menu-text">
                <strong>Destinations</strong>
                <small>Manage wildlife destinations</small>
              </span>

              <ArrowRight
                size={16}
                className="admin-menu-arrow"
              />
            </Link>


            <Link
              to="/admin/resorts"
              className="admin-dashboard-menu-link"
            >
              <span className="admin-menu-icon">
                <Tent size={17} />
              </span>

              <span className="admin-menu-text">
                <strong>Resorts</strong>
                <small>Manage accommodations</small>
              </span>

              <ArrowRight
                size={16}
                className="admin-menu-arrow"
              />
            </Link>


            <Link
              to="/admin/articles"
              className="admin-dashboard-menu-link"
            >
              <span className="admin-menu-icon">
                <FileText size={17} />
              </span>

              <span className="admin-menu-text">
                <strong>Articles</strong>
                <small>Manage wildlife content</small>
              </span>

              <ArrowRight
                size={16}
                className="admin-menu-arrow"
              />
            </Link>


            <Link
              to="/admin/businesses"
              className="admin-dashboard-menu-link"
            >
              <span className="admin-menu-icon">
                <Briefcase size={17} />
              </span>

              <span className="admin-menu-text">
                <strong>Businesses</strong>
                <small>Review partner applications</small>
              </span>

              <ArrowRight
                size={16}
                className="admin-menu-arrow"
              />
            </Link>

            <Link
              to="/admin/users"
              className="admin-dashboard-menu-link"
            >
              <span className="admin-menu-icon">
                <Users size={17} />
              </span>

              <span className="admin-menu-text">
                <strong>Users</strong>
                <small>Manage registered users</small>
              </span>

              <ArrowRight
                size={16}
                className="admin-menu-arrow"
              />
            </Link>

          </div>

        </div>


        {/* =====================================
            RECENT REQUESTS
        ===================================== */}

        <div className="admin-card admin-dashboard-requests-card">

          <div className="admin-dashboard-requests-header">

            <div>

              <p className="admin-section-kicker">
                RECENT ACTIVITY
              </p>

              <h2 className="admin-dashboard-requests-title">
                Trip Requests
              </h2>

            </div>


            {requests.length > 0 && (
              <Link
                to="/admin/trip-requests"
                className="admin-dashboard-view-all-link"
              >
                View All
                <ArrowRight size={15} />
              </Link>
            )}

          </div>


          <div className="admin-dashboard-requests-content">

            {isLoading ? (

              <div className="admin-dashboard-loading">
                Loading requests...
              </div>

            ) : requests.length === 0 ? (

              <div className="admin-dashboard-no-data">

                <Activity size={28} />

                <p>
                  No recent requests to review.
                </p>

              </div>

            ) : (

              <div className="admin-dashboard-requests-list">

                {requests.slice(0, 5).map((request) => (

                  <div
                    key={request.id}
                    className="admin-dashboard-request-item"
                  >

                    <div className="admin-request-main">

                      <div className="admin-request-avatar">
                        {request.user?.firstName?.charAt(0) || 'U'}
                      </div>


                      <div>

                        <h4 className="admin-dashboard-request-user">
                          {request.user
                            ? `${request.user.firstName} ${request.user.lastName}`
                            : 'Unknown User'}
                        </h4>

                        <div className="admin-dashboard-request-meta">

                          <span>
                            Trip to{' '}
                            <strong>
                              {request.destination?.name || 'Destination'}
                            </strong>
                          </span>

                          <span className="admin-meta-dot">
                            •
                          </span>

                          <span>
                            {request.travelerCount} travelers
                          </span>

                          <span className="admin-meta-dot">
                            •
                          </span>

                          <span>
                            {new Date(
                              request.startDate
                            ).toLocaleDateString()}
                          </span>

                        </div>

                      </div>

                    </div>


                    <div>
                      {getStatusBadge(request.status)}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;