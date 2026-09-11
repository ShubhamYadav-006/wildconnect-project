import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationService, type Notification } from '../../../services/notification.service';
import { ArrowLeft, Bell, BellOff, CheckCheck, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Card from '../../../components/cards/Card';

import '../../../styles/partner/PartnerNotifications.css';

export const PartnerNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getMyNotifications();

      if (!response.success) {
        toast.error('Failed to load notifications');
        setNotifications([]);
        return;
      }

      const notificationData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.notifications)
          ? response.data.notifications
          : [];

      setNotifications(notificationData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        toast.success('All notifications marked as read');
        setNotifications((current) =>
          current.map((notification) => ({ ...notification, isRead: true }))
        );
      } else {
        toast.error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((current) =>
          current.map((item) => item.id === notification.id ? { ...item, isRead: true } : item)
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Redirect logic depending on referenceId (e.g., business approval)
    if (notification.referenceId && notification.type.startsWith('BUSINESS')) {
      navigate(`/partner/businesses/${notification.referenceId}`);
      return;
    }
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    try {
      const response = await notificationService.delete(id);
      if (response.success) {
        toast.success('Notification deleted');
        setNotifications((current) => current.filter((notification) => notification.id !== id));
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Checking notifications..." />;
  }

  const hasUnreadNotifications = notifications.some((n) => !n.isRead);

  return (
    <div className="partner-notifications-container fade-in">
      <div className="notif-header-row">
        <div>
          <Link to="/partner" className="back-link" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
          </Link>
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">Stay up to date with updates on your business listings.</p>
        </div>

        {hasUnreadNotifications && (
          <button className="mark-read-btn" onClick={handleMarkAllRead}>
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="notif-content">
        {notifications.length === 0 ? (
          <div className="notif-empty-state">
            <div className="empty-icon-wrapper">
              <BellOff size={48} color="var(--color-primary)" />
            </div>
            <h2>No Notifications</h2>
            <p>Your inbox is clear! We will notify you here when there are updates on your listings.</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`notif-card ${notification.isRead ? 'read' : 'unread'}`}
              >
                <Card.Body>
                  <div className="notif-card-inner">
                    <div className="notif-info">
                      <div className="notif-icon-wrapper">
                        <Bell size={18} />
                      </div>
                      <div className="notif-text">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notif-time">{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="notif-actions">
                      {notification.referenceId && (
                        <button
                          type="button"
                          className="icon-action-btn view-btn"
                          title="View details"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="icon-action-btn delete-btn"
                        title="Delete"
                        onClick={(e) => handleDelete(e, notification.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerNotifications;
