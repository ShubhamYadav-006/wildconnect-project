import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Bell,
  Plus,
  XCircle,
  Calendar,
  MessageSquare,
  ArrowRight,
  Building2,
  FileCheck,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { businessService, type Business } from '../../../services/business.service';
import { notificationService, type Notification } from '../../../services/notification.service';
import api from '../../../services/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import '../../../styles/partner/PartnerDashboard.css';

export const PartnerDashboard = () => {
  const { user } = useAuth();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bizRes, notifRes, inqRes, bookRes] = await Promise.all([
          businessService.getMyBusinesses(),
          notificationService.getMyNotifications(),
          api.get('/partner/inquiries'),
          api.get('/business-bookings/partner'),
        ]);

        const bizData = Array.isArray(bizRes) ? bizRes : [];
        setBusinesses(bizData);
        setInquiriesCount(inqRes.data.data?.length || 0);
        setBookingsCount(bookRes.data.data?.length || 0);

        if (notifRes.success) {
          const notificationData = Array.isArray(notifRes.data)
            ? notifRes.data
            : Array.isArray(notifRes.data?.notifications)
              ? notifRes.data.notifications
              : [];
          setNotifications(notificationData);
        }
      } catch (error) {
        console.error('Failed to fetch partner dashboard data', error);
        setBusinesses([]);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading partner mission control..." />;
  }

  // Calculated Stats
  const approvedBusinesses = businesses.filter((b) => b.status === 'APPROVED').length;
  const pendingBusinesses = businesses.filter((b) => b.status === 'PENDING_REVIEW' || b.status === 'DRAFT').length;
  const rejectedBusinesses = businesses.filter((b) => b.status === 'REJECTED').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const getBusinessStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="partner-status-badge badge-success">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="partner-status-badge badge-warning">
            <Clock size={12} /> Pending Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="partner-status-badge badge-danger">
            <XCircle size={12} /> Rejected
          </span>
        );
      case 'DRAFT':
        return <span className="partner-status-badge badge-neutral">Draft</span>;
      default:
        return <span className="partner-status-badge badge-neutral">{status.replace('_', ' ')}</span>;
    }
  };

  const formatBusinessType = (type: string) => {
    if (!type) return 'Safari Business';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="partner-dashboard-page">
      <div className="partner-dashboard-container">

        {/* Admin Banner */}
        {user?.role === 'ADMIN' && (
          <div className="partner-admin-banner">
            <div className="partner-admin-banner-content">
              <span className="partner-admin-banner-indicator"></span>
              <span>You are logged in as an Administrator (Viewing Partner Mode)</span>
            </div>
            <Link to="/admin" className="partner-admin-banner-link">
              <span>Go to Admin Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* =========================================
            1. PAGE HEADER
        ========================================= */}
        <header className="partner-dashboard-header">
          <div className="partner-dashboard-header-text">
            <span className="partner-dashboard-eyebrow">
              BUSINESS PARTNER DASHBOARD
            </span>
            <h1 className="partner-dashboard-title">
              Welcome back, {user?.firstName || 'Partner'} 👋
            </h1>
            <p className="partner-dashboard-subtitle">
              Manage your wildlife properties, accommodations, equipment listings & customer inquiries.
            </p>
          </div>

          <div className="partner-dashboard-header-action">
            <Link
              to="/partner/businesses/new"
              className="partner-primary-btn"
            >
              <Plus size={18} />
              <span>Add New Business</span>
            </Link>
          </div>
        </header>

        {/* =========================================
            2. STATISTICS GRID (4 KPI STAT CARDS)
        ========================================= */}
        <div className="partner-stats-grid">

          {/* Card 1: Total Businesses */}
          <Link to="/partner/businesses" className="partner-stat-card">
            <div className="partner-stat-top">
              <div className="partner-stat-icon-box icon-primary">
                <Building2 size={20} />
              </div>
              <span className="partner-stat-eyebrow">PROPERTIES</span>
            </div>
            <div className="partner-stat-bottom">
              <span className="partner-stat-label">Total Listings</span>
              <span className="partner-stat-value">{businesses.length}</span>
              <span className="partner-stat-subtext">
                {approvedBusinesses} active • {pendingBusinesses} in review
              </span>
            </div>
          </Link>

          {/* Card 2: Direct Bookings */}
          <Link to="/partner/bookings" className="partner-stat-card">
            <div className="partner-stat-top">
              <div className="partner-stat-icon-box icon-green">
                <Calendar size={20} />
              </div>
              <span className="partner-stat-eyebrow">BOOKINGS</span>
            </div>
            <div className="partner-stat-bottom">
              <span className="partner-stat-label">Customer Reservations</span>
              <span className="partner-stat-value">{bookingsCount}</span>
              <span className="partner-stat-subtext">Direct guest bookings</span>
            </div>
          </Link>

          {/* Card 3: Inquiries */}
          <Link to="/partner/inquiries" className="partner-stat-card">
            <div className="partner-stat-top">
              <div className="partner-stat-icon-box icon-amber">
                <MessageSquare size={20} />
              </div>
              <span className="partner-stat-eyebrow">MESSAGES</span>
            </div>
            <div className="partner-stat-bottom">
              <span className="partner-stat-label">Traveler Inquiries</span>
              <span className="partner-stat-value">{inquiriesCount}</span>
              <span className="partner-stat-subtext">Direct messages received</span>
            </div>
          </Link>

          {/* Card 4: Notifications */}
          <Link to="/partner/notifications" className="partner-stat-card">
            <div className="partner-stat-top">
              <div className="partner-stat-icon-box icon-blue">
                <Bell size={20} />
              </div>
              <span className="partner-stat-eyebrow">UPDATES</span>
            </div>
            <div className="partner-stat-bottom">
              <span className="partner-stat-label">Notifications</span>
              <span className="partner-stat-value">{unreadNotificationsCount}</span>
              <span className="partner-stat-subtext">
                {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread alerts` : 'All caught up'}
              </span>
            </div>
          </Link>

        </div>

        {/* =========================================
            3. ACTION REQUIRED NOTICE (IF REJECTED ITEMS EXIST)
        ========================================= */}
        {rejectedBusinesses > 0 && (
          <div className="partner-alert-card">
            <div className="partner-alert-icon-wrap">
              <XCircle size={22} className="partner-alert-icon" />
            </div>
            <div className="partner-alert-body">
              <h3 className="partner-alert-title">
                {rejectedBusinesses} listing(s) require your attention
              </h3>
              <p className="partner-alert-desc">
                One or more partner listings were rejected by the admin team. Please review the feedback notes and resubmit for approval.
              </p>
            </div>
            <Link to="/partner/businesses" className="partner-alert-btn">
              <span>Review Listings</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* =========================================
            4. LOWER CONTENT GRID (2 COLUMNS)
        ========================================= */}
        <div className="partner-dashboard-content-grid">

          {/* Left Column: Recent Business Listings */}
          <div className="partner-card partner-listings-card">
            <div className="partner-card-header">
              <div>
                <span className="partner-section-kicker">REGISTERED UNITS</span>
                <h2 className="partner-card-title">Recent Businesses</h2>
              </div>
              <Link to="/partner/businesses" className="partner-view-all-link">
                <span>View All</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="partner-listings-list">
              {businesses.length === 0 ? (
                <div className="partner-empty-state">
                  <Briefcase size={32} className="partner-empty-icon" />
                  <p className="partner-empty-title">No Registered Businesses</p>
                  <p className="partner-empty-subtitle">
                    List your safari stay, vehicle fleet, or equipment rentals on WildConnect to receive direct bookings.
                  </p>
                  <Link to="/partner/businesses/new" className="partner-empty-action-btn">
                    <Plus size={16} />
                    <span>Create First Listing</span>
                  </Link>
                </div>
              ) : (
                businesses.slice(0, 5).map((biz) => (
                  <Link
                    to={`/partner/businesses/${biz.id}`}
                    key={biz.id}
                    className="partner-listing-item"
                  >
                    <div className="partner-listing-main">
                      <div className="partner-listing-icon-box">
                        <Building2 size={18} />
                      </div>
                      <div className="partner-listing-info">
                        <h4 className="partner-listing-title">{biz.name}</h4>
                        <div className="partner-listing-meta">
                          <span>{formatBusinessType(biz.type)}</span>
                          <span className="partner-meta-dot">•</span>
                          <span>{biz.destination?.name || 'Central Reserve'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="partner-listing-status-wrap">
                      {getBusinessStatusBadge(biz.status)}
                      <ArrowRight size={16} className="partner-item-arrow" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Quick Management Links */}
          <div className="partner-card partner-quick-card">
            <div className="partner-card-header">
              <div>
                <span className="partner-section-kicker">PORTAL TOOLS</span>
                <h2 className="partner-card-title">Partner Management</h2>
              </div>
            </div>

            <div className="partner-quick-list">
              <Link to="/partner/businesses/new" className="partner-quick-item group-highlight">
                <div className="partner-quick-item-left">
                  <div className="partner-quick-icon-box box-primary">
                    <Plus size={19} />
                  </div>
                  <div className="partner-quick-info">
                    <span className="partner-quick-item-title">Add New Listing</span>
                    <span className="partner-quick-item-subtitle">Create property or service</span>
                  </div>
                </div>
                <ArrowRight size={18} className="partner-quick-arrow" />
              </Link>

              <Link to="/partner/rooms" className="partner-quick-item">
                <div className="partner-quick-item-left">
                  <div className="partner-quick-icon-box box-green">
                    <Building2 size={19} />
                  </div>
                  <div className="partner-quick-info">
                    <span className="partner-quick-item-title">Rooms & Stays</span>
                    <span className="partner-quick-item-subtitle">Manage inventory & rates</span>
                  </div>
                </div>
                <ArrowRight size={18} className="partner-quick-arrow" />
              </Link>

              <Link to="/partner/kyc" className="partner-quick-item">
                <div className="partner-quick-item-left">
                  <div className="partner-quick-icon-box box-blue">
                    <ShieldCheck size={19} />
                  </div>
                  <div className="partner-quick-info">
                    <span className="partner-quick-item-title">KYC Verification</span>
                    <span className="partner-quick-item-subtitle">Verify 2 ID document numbers</span>
                  </div>
                </div>
                <ArrowRight size={18} className="partner-quick-arrow" />
              </Link>

              <Link to="/partner/finances" className="partner-quick-item">
                <div className="partner-quick-item-left">
                  <div className="partner-quick-icon-box box-amber">
                    <FileCheck size={19} />
                  </div>
                  <div className="partner-quick-info">
                    <span className="partner-quick-item-title">Finances & Payouts</span>
                    <span className="partner-quick-item-subtitle">Revenue statements & history</span>
                  </div>
                </div>
                <ArrowRight size={18} className="partner-quick-arrow" />
              </Link>

              <Link to="/partner/profile" className="partner-quick-item">
                <div className="partner-quick-item-left">
                  <div className="partner-quick-icon-box box-neutral">
                    <UserCheck size={19} />
                  </div>
                  <div className="partner-quick-info">
                    <span className="partner-quick-item-title">Partner Profile</span>
                    <span className="partner-quick-item-subtitle">Contact info & business credentials</span>
                  </div>
                </div>
                <ArrowRight size={18} className="partner-quick-arrow" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PartnerDashboard;
