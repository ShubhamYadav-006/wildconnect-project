import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, XCircle } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import '../../../styles/partner/PartnerBookings.css';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  specialRequests?: string;
  business: {
    name: string;
  };
  room: {
    name: string;
  };
}

const PartnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/business-bookings/partner');
      setBookings(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/business-bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <LoadingSpinner message="Loading bookings..." />;

  return (
    <div className="partner-page fade-in">
      <div className="partner-page-header">
        <div>
          <h1 className="partner-page-title">Direct Bookings</h1>
          <p className="partner-page-subtitle">Manage customer reservations and guest information.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} className="empty-icon" />
          <h3>No direct bookings yet</h3>
          <p>Bookings made on your approved property listings will appear here automatically.</p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Property & Room</th>
                <th>Dates</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span className="booking-id">#{b.id.slice(0, 8)}</span>
                  </td>
                  <td>
                    <div className="guest-info">
                      <strong>{b.guestName}</strong>
                      <span className="text-muted"><Mail size={12} /> {b.guestEmail}</span>
                      {b.guestPhone && <span className="text-muted"><Phone size={12} /> {b.guestPhone}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="prop-room-info">
                      <strong>{b.business.name}</strong>
                      <span className="text-muted">{b.room.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="dates-info">
                      <span>{new Date(b.startDate).toLocaleDateString()}</span>
                      <span className="text-muted">to {new Date(b.endDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>{b.travelerCount}</td>
                  <td>
                    <strong>${b.totalAmount}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => handleCancel(b.id)} 
                        className="btn-cancel-sm"
                        title="Cancel Reservation"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PartnerBookings;
