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
        return (
          <span className="admin-badge status-warning">
            <Clock size={12} /> Pending
          </span>
        );
      case 'PROPOSAL_READY':
        return (
          <span className="admin-badge status-info">
            <CheckCircle size={12} /> Proposal Ready
          </span>
        );
      case 'ACCEPTED':
      case 'BOOKED':
        return (
          <span className="admin-badge status-success">
            <CheckCircle size={12} /> Confirmed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="admin-badge status-danger">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return <span className="admin-badge status-neutral">{status}</span>;
    }
  };

  const getUserInitials = (requestUser: any) => {
    if (!requestUser) return 'U';
    const first = requestUser.firstName?.trim()?.charAt(0) || '';
    const last = requestUser.lastName?.trim()?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getAvatarStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'avatar-warning';
      case 'PROPOSAL_READY':
        return 'avatar-info';
      case 'ACCEPTED':
      case 'BOOKED':
        return 'avatar-success';
      case 'REJECTED':
        return 'avatar-danger';
      default:
        return 'avatar-default';
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">

        {/* =========================================
            1. PAGE HEADER
        ========================================= */}
        <header className="admin-dashboard-page-header">
          <div className="admin-dashboard-header-text">
            <span className="admin-dashboard-eyebrow">
              WILDCONNECT ADMIN
            </span>
            <h1 className="admin-dashboard-page-title">
              Admin Dashboard
            </h1>
            <p className="admin-dashboard-page-subtitle">
              Welcome back, {user?.firstName || 'Admin'}. Here's what's happening across WildConnect.
            </p>
          </div>

          <div className="admin-dashboard-header-action">
            <Link
              to="/"
              className="admin-dashboard-user-button"
            >
              <Users size={18} className="admin-dashboard-user-btn-icon" />
              <span>Visit User Dashboard</span>
            </Link>
          </div>
        </header>

        {/* =========================================
            2. STATISTICS GRID (4 STAT CARDS)
        ========================================= */}
        <div className="admin-grid-stats">

          {/* Card 1: Users */}
          <div className="admin-stat-card admin-stat-users">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-wrapper icon-blue">
                <Users size={20} />
              </div>
              <span className="admin-stat-card-eyebrow">
                USERS
              </span>
            </div>
            <div className="admin-stat-card-bottom">
              <span className="admin-stat-label">Total Users</span>
              <span className="admin-stat-value">
                {isLoading ? '...' : usersCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 2: Destinations */}
          <div className="admin-stat-card admin-stat-destinations">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-wrapper icon-primary">
                <Map size={20} />
              </div>
              <span className="admin-stat-card-eyebrow">
                DESTINATIONS
              </span>
            </div>
            <div className="admin-stat-card-bottom">
              <span className="admin-stat-label">Destinations</span>
              <span className="admin-stat-value">
                {isLoading ? '...' : destinationsCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 3: Resorts */}
          <div className="admin-stat-card admin-stat-resorts">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-wrapper icon-green">
                <Tent size={20} />
              </div>
              <span className="admin-stat-card-eyebrow">
                STAYS
              </span>
            </div>
            <div className="admin-stat-card-bottom">
              <span className="admin-stat-label">Resorts</span>
              <span className="admin-stat-value">
                {isLoading ? '...' : resortsCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 4: Trip Requests */}
          <div className="admin-stat-card admin-stat-requests">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-wrapper icon-amber">
                <Activity size={20} />
              </div>
              <span className="admin-stat-card-eyebrow">
                ACTIVITY
              </span>
            </div>
            <div className="admin-stat-card-bottom">
              <span className="admin-stat-label">Trip Requests</span>
              <span className="admin-stat-value">
                {isLoading ? '...' : requests.length.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* =========================================
            3. LOWER DASHBOARD CONTENT GRID (2 COLUMNS)
        ========================================= */}
        <div className="admin-dashboard-content-grid">

          {/* Left Column: Management (Quick Access) */}
          <div className="admin-card admin-dashboard-management-card">
            <div className="admin-dashboard-section-header">
              <span className="admin-section-kicker">
                QUICK ACCESS
              </span>
              <h2 className="admin-dashboard-menu-title">
                Management
              </h2>
            </div>

            <div className="admin-dashboard-menu-list">
              {/* Item 1: Destinations */}
              <Link
                to="/admin/destinations"
                className="admin-dashboard-menu-link group-destinations"
              >
                <div className="admin-menu-item-left">
                  <div className="admin-menu-icon-box box-destinations">
                    <Map size={19} />
                  </div>
                  <div className="admin-menu-item-info">
                    <span className="admin-menu-item-title">Destinations</span>
                    <span className="admin-menu-item-subtitle">Manage wildlife destinations</span>
                  </div>
                </div>
                <ArrowRight size={18} className="admin-menu-item-arrow" />
              </Link>

              {/* Item 2: Resorts */}
              <Link
                to="/admin/resorts"
                className="admin-dashboard-menu-link group-resorts"
              >
                <div className="admin-menu-item-left">
                  <div className="admin-menu-icon-box box-resorts">
                    <Tent size={19} />
                  </div>
                  <div className="admin-menu-item-info">
                    <span className="admin-menu-item-title">Resorts</span>
                    <span className="admin-menu-item-subtitle">Manage accommodations</span>
                  </div>
                </div>
                <ArrowRight size={18} className="admin-menu-item-arrow" />
              </Link>

              {/* Item 3: Articles */}
              <Link
                to="/admin/articles"
                className="admin-dashboard-menu-link group-articles"
              >
                <div className="admin-menu-item-left">
                  <div className="admin-menu-icon-box box-articles">
                    <FileText size={19} />
                  </div>
                  <div className="admin-menu-item-info">
                    <span className="admin-menu-item-title">Articles</span>
                    <span className="admin-menu-item-subtitle">Manage wildlife content</span>
                  </div>
                </div>
                <ArrowRight size={18} className="admin-menu-item-arrow" />
              </Link>

              {/* Item 4: Businesses */}
              <Link
                to="/admin/businesses"
                className="admin-dashboard-menu-link group-businesses"
              >
                <div className="admin-menu-item-left">
                  <div className="admin-menu-icon-box box-businesses">
                    <Briefcase size={19} />
                  </div>
                  <div className="admin-menu-item-info">
                    <span className="admin-menu-item-title">Businesses</span>
                    <span className="admin-menu-item-subtitle">Review partner applications</span>
                  </div>
                </div>
                <ArrowRight size={18} className="admin-menu-item-arrow" />
              </Link>

              {/* Item 5: Users */}
              <Link
                to="/admin/users"
                className="admin-dashboard-menu-link group-users"
              >
                <div className="admin-menu-item-left">
                  <div className="admin-menu-icon-box box-users">
                    <Users size={19} />
                  </div>
                  <div className="admin-menu-item-info">
                    <span className="admin-menu-item-title">Users</span>
                    <span className="admin-menu-item-subtitle">Manage registered users</span>
                  </div>
                </div>
                <ArrowRight size={18} className="admin-menu-item-arrow" />
              </Link>
            </div>
          </div>

          {/* Right Column: Recent Activity (Trip Requests) */}
          <div className="admin-card admin-dashboard-requests-card">
            <div className="admin-dashboard-requests-header">
              <div>
                <span className="admin-section-kicker">
                  RECENT ACTIVITY
                </span>
                <h2 className="admin-dashboard-requests-title">
                  Trip Requests
                </h2>
              </div>

              {requests.length > 0 && (
                <Link
                  to="/admin/trip-requests"
                  className="admin-dashboard-view-all-link"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
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
                  <Activity size={32} className="admin-dashboard-no-data-icon" />
                  <p className="admin-dashboard-no-data-text">
                    No recent trip requests found.
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
                        <div className={`admin-request-avatar ${getAvatarStatusClass(request.status)}`}>
                          {getUserInitials(request.user)}
                        </div>

                        <div className="admin-request-info">
                          <h4 className="admin-dashboard-request-user">
                            {request.user
                              ? `${request.user.firstName || ''} ${request.user.lastName || ''}`.trim() || 'Unknown User'
                              : 'Unknown User'}
                          </h4>

                          <div className="admin-dashboard-request-meta">
                            <span>
                              Trip to{' '}
                              <strong>
                                {request.destination?.name || 'Destination'}
                              </strong>
                            </span>
                            <span className="admin-meta-dot">•</span>
                            <span>{request.travelerCount || 1} travelers</span>
                            <span className="admin-meta-dot">•</span>
                            <span>
                              {request.startDate ? new Date(request.startDate).toLocaleDateString() : 'Date TBA'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="admin-request-status-wrap">
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
    </div>
  );
};

export default AdminDashboard;