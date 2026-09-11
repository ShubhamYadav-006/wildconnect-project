import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, Bell, Plus, XCircle, Calendar, MessageSquare } from 'lucide-react';
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
    return <LoadingSpinner message="Loading your partner dashboard..." />;
  }

  // ============================================================
  // Calculated Stats
  // ============================================================

  const approvedBusinesses = businesses.filter(b => b.status === 'APPROVED').length;
  const pendingBusinesses = businesses.filter(b => b.status === 'PENDING_REVIEW').length;
  const rejectedBusinesses = businesses.filter(b => b.status === 'REJECTED').length;
  
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="partner-dashboard-container fade-in">
      
      {/* Admin Banner */}
      {user?.role === 'ADMIN' && (
        <div className="partner-admin-banner">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="partner-admin-banner-indicator"></span>
            You are logged in as an Administrator (Viewing Partner View)
          </div>
          <Link to="/admin" className="text-link" style={{ color: '#8c6a34', fontWeight: 700 }}>
            Go to Admin Panel &rarr;
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="partner-dashboard-header-row">
        <div>
          <h1 className="partner-dashboard-header-title">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="partner-dashboard-header-subtitle">
            Manage your wildlife businesses and partnerships.
          </p>
        </div>

        <Link
          to="/partner/businesses/new"
          className="quick-action-btn primary-action"
          style={{ padding: '0.875rem 1.5rem', margin: 0 }}
        >
          <Plus size={18} />
          Add New Business
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="partner-dashboard-stats-grid">
        
        {/* Total Businesses */}
        <Link to="/partner/businesses" className="partner-stat-card">
          <div className="partner-stat-icon-container stat-total">
            <Briefcase size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="partner-stat-label">Total Businesses</div>
            <div className="partner-stat-value">{businesses.length}</div>
            <div className="partner-stat-subtext">Registered on WildConnect</div>
          </div>
        </Link>

        {/* Approved Businesses */}
        <Link to="/partner/businesses" className="partner-stat-card">
          <div className="partner-stat-icon-container stat-approved">
            <CheckCircle size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="partner-stat-label">Approved</div>
            <div className="partner-stat-value">{approvedBusinesses}</div>
            <div className="partner-stat-subtext">Active listings</div>
          </div>
        </Link>

        {/* Pending / Draft Businesses */}
        <Link to="/partner/businesses" className="partner-stat-card">
          <div className="partner-stat-icon-container stat-pending">
            <Clock size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="partner-stat-label">Pending / Draft</div>
            <div className="partner-stat-value">{pendingBusinesses}</div>
            <div className="partner-stat-subtext">Awaiting review or draft</div>
          </div>
        </Link>

        {/* Direct Bookings */}
        <Link to="/partner/bookings" className="partner-stat-card">
          <div className="partner-stat-icon-container stat-approved">
            <Calendar size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="partner-stat-label">Direct Bookings</div>
            <div className="partner-stat-value">{bookingsCount}</div>
            <div className="partner-stat-subtext">Customer reservations</div>
          </div>
        </Link>

        {/* Inquiries */}
        <Link to="/partner/inquiries" className="partner-stat-card">
          <div className="partner-stat-icon-container stat-notif">
            <MessageSquare size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="partner-stat-label">Inquiries</div>
            <div className="partner-stat-value">{inquiriesCount}</div>
            <div className="partner-stat-subtext">Received customer messages</div>
          </div>
        </Link>

        {/* Notifications */}
        <Link to="/partner/notifications" className="partner-stat-card">
          <div className="partner-stat-icon-container stat-notif">
            <Bell size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="partner-stat-label">Notifications</div>
            <div className="partner-stat-value">{unreadNotificationsCount}</div>
            <div className="partner-stat-subtext">{unreadNotificationsCount} unread updates</div>
          </div>
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="partner-dashboard-main-layout">
        
        {/* Left Column: Recent Businesses */}
        <div>
          <div className="partner-section-header">
            <h2 className="partner-section-title">Recent Businesses</h2>
            <Link to="/partner/businesses" className="partner-section-link">
              View all &rarr;
            </Link>
          </div>

          <div className="partner-list-card">
            {businesses.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>No businesses found. Start by adding your first business!</p>
              </div>
            ) : (
              businesses.slice(0, 3).map((biz) => (
                <Link to={`/partner/businesses/${biz.id}`} key={biz.id} className="partner-list-item">
                  <div>
                    <h3 className="partner-item-title">{biz.name}</h3>
                    <div className="partner-item-meta">
                      <span>{biz.type.replace('_', ' ')}</span>
                      <span className="partner-item-meta-dot"></span>
                      <span
                        style={{
                          color:
                            biz.status === 'APPROVED' ? '#2E7559' :
                            biz.status === 'REJECTED' ? '#ef4444' :
                            biz.status === 'PENDING_REVIEW' ? '#D96B27' :
                            'inherit',
                          fontWeight: 600,
                        }}
                      >
                        {biz.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="partner-item-action">
                    View &rarr;
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Rejected/Action Required or Quick Actions */}
        <div>
          <div className="partner-section-header">
            <h2 className="partner-section-title">Action Required</h2>
          </div>

          {rejectedBusinesses > 0 ? (
            <div className="partner-action-required-card">
              <div className="action-icon">
                <XCircle size={24} color="#ef4444" />
              </div>
              <div className="action-content">
                <h3>{rejectedBusinesses} business(es) rejected</h3>
                <p>Please review the rejection reasons and update your listings to resubmit.</p>
                <Link to="/partner/businesses" className="quick-action-btn primary-action">
                  Review Listings
                </Link>
              </div>
            </div>
          ) : (
             <div className="partner-quick-actions">
               <Link to="/partner/businesses/new" className="quick-action-btn primary-action">
                 <Plus size={18} />
                 Add New Business
               </Link>
               <Link to="/partner/profile" className="quick-action-btn">
                 Update Profile
               </Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
