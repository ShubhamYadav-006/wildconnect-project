import React, { useState, useEffect, useCallback } from 'react';
import { Users, Check, Calendar, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../../styles/public/RoomAvailability.css';

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  totalInventory: number;
  amenities: string[];
  images: string[];
}

interface RoomAvailabilityProps {
  businessId: string;
  businessName: string;
}

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({ businessId, businessName }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Default dates: tomorrow and day after
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(dayAfter.toISOString().split('T')[0]);
  const [availabilityMap, setAvailabilityMap] = useState<{ [roomId: string]: boolean }>({});
  const [checking, setChecking] = useState(false);

  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [travelerCount, setTravelerCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const checkAllAvailability = useCallback(async (roomList: Room[], start: string, end: string) => {
    try {
      setChecking(true);
      const map: { [roomId: string]: boolean } = {};

      for (const room of roomList) {
        const res = await api.get('/business-bookings/availability', {
          params: { roomId: room.id, startDate: start, endDate: end },
        });
        map[room.id] = res.data.data.isAvailable;
      }
      setAvailabilityMap(map);
    } catch (err) {
      console.error('Error checking availability', err);
    } finally {
      setChecking(false);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/rooms/public/${businessId}`);
      const roomList = Array.isArray(res?.data?.data) ? res.data.data : [];
      setRooms(roomList);
      if (roomList.length > 0) {
        checkAllAvailability(roomList, startDate, endDate);
      }
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [businessId, startDate, endDate, checkAllAvailability]);

  useEffect(() => {
    fetchRooms();
    // Auto-fill logged in user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setGuestName(`${u.firstName} ${u.lastName}`);
        setGuestEmail(u.email);
      } catch { }
    }
  }, [fetchRooms]);

  const handleDateChange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    if (rooms.length > 0) {
      checkAllAvailability(rooms, newStart, newEnd);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      setBookingLoading(true);
      await api.post('/business-bookings', {
        businessId,
        roomId: selectedRoom.id,
        startDate,
        endDate,
        travelerCount,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      });

      toast.success('🎉 Stay Enquiry Submitted! Our team/host will contact you shortly with rates & availability.');
      setSelectedRoom(null);
      checkAllAvailability(rooms, startDate, endDate);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enquiry submission failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || rooms.length === 0) return null;

  return (
    <section className="room-availability-section">
      <div className="section-header">
        <h2>Available Rooms & Accommodation Units</h2>
        <p>Select dates to check real-time availability and reserve directly.</p>
      </div>

      <div className="date-picker-bar">
        <div className="date-picker-group">
          <label><Calendar size={14} /> Check-In</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value, endDate)}
          />
        </div>
        <div className="date-picker-group">
          <label><Calendar size={14} /> Check-Out</label>
          <input
            type="date"
            min={startDate}
            value={endDate}
            onChange={(e) => handleDateChange(startDate, e.target.value)}
          />
        </div>
      </div>

      <div className="public-rooms-grid">
        {rooms.map((room) => {
          const isAvailable = availabilityMap[room.id] !== false;

          return (
            <div key={room.id} className="public-room-card">
              {room.images && room.images[0] && (
                <img src={room.images[0]} alt={room.name} className="public-room-img" />
              )}
              <div className="public-room-info">
                <h3>{room.name}</h3>
                <p className="public-room-desc">{room.description}</p>

                <div className="public-room-meta">
                  <span><Users size={16} /> Up to {room.capacity} Guests</span>
                  <span className="room-enquiry-badge">Pricing on Enquiry</span>
                </div>

                {room.amenities.length > 0 && (
                  <div className="room-amenity-tags">
                    {room.amenities.map((am, idx) => (
                      <span key={idx} className="room-amenity-pill"><Check size={12} /> {am}</span>
                    ))}
                  </div>
                )}

                <button
                  className={`btn-book-now ${!isAvailable ? 'sold-out' : ''}`}
                  disabled={!isAvailable || checking}
                  onClick={() => setSelectedRoom(room)}
                >
                  {isAvailable ? 'Submit Enquiry' : 'Sold Out for Dates'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Checkout Modal */}
      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Submit Stay Enquiry</h2>
              <button className="close-btn" onClick={() => setSelectedRoom(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="booking-summary-box">
              <h3>{selectedRoom.name}</h3>
              <p><strong>Property:</strong> {businessName}</p>
              <p><strong>Requested Dates:</strong> {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}</p>
              <p><strong>Pricing:</strong> Verified customized tariff shared via email/phone upon enquiry</p>
            </div>

            <form onSubmit={handleBookSubmit} className="booking-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Number of Guests *</label>
                <input
                  type="number"
                  min={1}
                  max={selectedRoom.capacity}
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Late check-in, extra bedding, dietary notes..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setSelectedRoom(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={bookingLoading}>
                  {bookingLoading ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default RoomAvailability;
