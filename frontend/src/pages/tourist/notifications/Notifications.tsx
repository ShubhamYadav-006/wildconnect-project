import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  notificationService,
  type Notification,
} from '../../../services/notification.service';
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';
import Card from '../../../components/cards/Card';
import SecondaryButton from '../../../components/buttons/SecondaryButton';

import '../../../styles/tourist/DashboardSubpages.css';
import '../../../styles/tourist/Dashboard.css';

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // ============================================================
  // Fetch Notifications
  // ============================================================

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      const response = await notificationService.getMyNotifications();

      if (!response.success) {
        toast.error('Failed to load notifications');
        setNotifications([]);
        return;
      }

      /*
       * Normalize the API response.
       *
       * Supported response formats:
       *
       * 1. data: Notification[]
       *
       * 2. data: {
       *      notifications: Notification[]
       *    }
       *
       * If the API returns anything else, use an empty array
       * instead of allowing the UI to crash.
       */

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

  // ============================================================
  // Mark All Notifications As Read
  // ============================================================

  const handleMarkAllRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();

      if (response.success) {
        toast.success('All notifications marked as read');

        /*
         * Update the current state immediately instead of making
         * another API request.
         */
        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      } else {
        toast.error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);

      toast.error('Failed to mark notifications as read');
    }
  };

  // ============================================================
  // Handle Notification Click
  // ============================================================

  const handleNotificationClick = async (
    notification: Notification
  ) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);

        /*
         * Update local state immediately.
         */
        setNotifications((currentNotifications) =>
          currentNotifications.map((item) =>
            item.id === notification.id
              ? {
                ...item,
                isRead: true,
              }
              : item
          )
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Redirect to proposal
    if (
      notification.referenceId &&
      notification.type.startsWith('PROPOSAL')
    ) {
      navigate(
        `/dashboard/proposals/${notification.referenceId}`
      );
      return;
    }

    // Redirect to bookings
    if (
      notification.referenceId &&
      notification.type.startsWith('BOOKING')
    ) {
      navigate('/dashboard/bookings');
      return;
    }
  };

  // ============================================================
  // Delete Notification
  // ============================================================

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();

    try {
      const response = await notificationService.delete(id);

      if (response.success) {
        toast.success('Notification deleted');

        /*
         * Functional state update prevents stale state issues.
         */
        setNotifications((currentNotifications) =>
          currentNotifications.filter(
            (notification) => notification.id !== id
          )
        );
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);

      toast.error('Failed to delete notification');
    }
  };

  // ============================================================
  // Loading State
  // ============================================================

  if (isLoading) {
    return (
      <LoadingSpinner message="Checking notifications..." />
    );
  }

  // ============================================================
  // Derived State
  // ============================================================

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="dashboard-container fade-in">

      {/* Back Navigation */}
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>

      {/* Page Header */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-header-title">
            Notifications
          </h1>

          <p className="dashboard-header-subtitle">
            Stay up to date with updates on requests and bookings.
          </p>
        </div>

        {hasUnreadNotifications && (
          <SecondaryButton
            onClick={handleMarkAllRead}
            size="sm"
            variant="outline"
          >
            <CheckCheck size={16} className="mr-2" />
            Mark All as Read
          </SecondaryButton>
        )}
      </div>

      {/* Content */}
      <div className="dashboard-page-content">

        {/* Empty State */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={<BellOff size={48} />}
            title="No Notifications"
            description="Your inbox is clear! We will notify you here when there are updates on your proposals or booking status."
          />
        ) : (

          /* Notification List */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className="hover-lift"
                style={{
                  borderLeft: notification.isRead
                    ? '1px solid var(--color-border)'
                    : '4px solid var(--color-primary)',

                  backgroundColor: notification.isRead
                    ? 'var(--color-surface)'
                    : '#fcfbf7',
                }}
              >
                <Card.Body>

                  <div className="flex-between">

                    {/* Notification Information */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                      }}
                    >

                      {/* Icon */}
                      <div
                        style={{
                          padding: '0.5rem',
                          borderRadius: '9999px',

                          backgroundColor:
                            notification.isRead
                              ? '#f3f4f6'
                              : 'rgb(var(--primary) / 0.1)',

                          color: notification.isRead
                            ? 'var(--color-text-muted)'
                            : 'var(--color-primary)',

                          marginTop: '0.25rem',
                        }}
                      >
                        <Bell size={18} />
                      </div>

                      {/* Text */}
                      <div>

                        <h4
                          className="h4-title"
                          style={{
                            fontSize: '1rem',
                            fontWeight:
                              notification.isRead
                                ? 600
                                : 700,
                            margin: 0,
                          }}
                        >
                          {notification.title}
                        </h4>

                        <p
                          className="text-muted"
                          style={{
                            margin: '0.25rem 0',
                            fontSize: '0.875rem',
                          }}
                        >
                          {notification.message}
                        </p>

                        <span className="text-xs-muted">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                      }}
                    >

                      {/* View */}
                      {notification.referenceId && (
                        <button
                          type="button"
                          className="modal-close-btn"
                          title="View details"
                          style={{
                            padding: '0.5rem',
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNotificationClick(
                              notification
                            );
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(event) =>
                          handleDelete(
                            event,
                            notification.id
                          )
                        }
                        className="modal-close-btn"
                        title="Delete"
                        style={{
                          padding: '0.5rem',
                          color: '#ef4444',
                        }}
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

export default Notifications;