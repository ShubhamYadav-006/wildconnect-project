import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, type Booking } from '../../../services/booking.service';
import { ArrowLeft, Calendar, Users, DollarSign, Ban, Tent } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/badges/StatusBadge';
import Card from '../../../components/cards/Card';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';
import '../../../styles/pages/DashboardSubpages.css';
import '../../../styles/pages/Dashboard.css';

export const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (id: string) => {
    setSelectedBookingId(id);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    setIsCancelling(true);
    try {
      const response = await bookingService.cancel(selectedBookingId);
      if (response.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        toast.error(response.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
      setIsCancelOpen(false);
      setSelectedBookingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading your bookings..." />;

  return (
    <div className="dashboard-container fade-in">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-header-title">My Bookings</h1>
          <p className="dashboard-header-subtitle">Manage and review your confirmed wildlife tour bookings.</p>
        </div>
      </div>

      <div className="dashboard-page-content">

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Tent size={48} />}
          title="No Bookings Found"
          description="You don't have any safari bookings confirmed yet. Browse our destinations to request a new safari package."
          actionText="Explore Destinations"
          onAction={() => window.location.href = '/destinations'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover-lift">
              <Card.Body>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  justifyContent: 'space-between'
                }}>
                  {/* Info Column */}
                  <div className="booking-card-row">
                    <div>
                      <div className="flex-row-center" style={{ gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 className="h3-title" style={{ margin: 0 }}>
                          {booking.destination?.name || 'Safari Package'}
                        </h3>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        columnGap: '2rem',
                        rowGap: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.75rem'
                      }}>
                        <span className="flex-row-center"><Calendar size={14} className="mr-2" style={{ color: 'var(--color-primary)' }} /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                        <span className="flex-row-center"><Users size={14} className="mr-2" style={{ color: 'var(--color-primary)' }} /> {booking.travelerCount} Travelers</span>
                        <span className="flex-row-center"><DollarSign size={14} className="mr-1" style={{ color: 'var(--color-primary)' }} /> Total Paid: ₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {booking.status === 'CONFIRMED' && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SecondaryButton
                          onClick={() => handleCancelClick(booking.id)}
                          variant="outline"
                          size="sm"
                          className="btn-danger"
                          style={{ borderColor: '#fca5a5', color: '#ef4444' }}
                        >
                          <Ban size={14} className="mr-2" /> Cancel Booking
                        </SecondaryButton>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      </div>

      <ConfirmationDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Safari Booking?"
        message="Are you sure you want to cancel this booking? This action is irreversible and our support team will contact you regarding refund details."
        confirmText="Yes, Cancel Booking"
        isDanger={true}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default Bookings;
