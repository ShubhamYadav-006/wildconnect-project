import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, DollarSign, Layers } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ImageUpload from '../../../components/ui/ImageUpload';
import '../../../styles/partner/PartnerRooms.css';

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

interface Business {
  id: string;
  name: string;
  type: string;
}

const PartnerRooms: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 2,
    basePrice: 100,
    totalInventory: 5,
    amenities: '',
    images: [] as string[],
  });

  useEffect(() => {
    fetchAccommodationBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchRooms(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const fetchAccommodationBusinesses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/businesses/my/all');
      const all = Array.isArray(res?.data?.data) ? res.data.data : [];
      const accommodations = all.filter((b: Business) => b.type === 'RESORT');
      setBusinesses(accommodations);
      if (accommodations.length > 0) {
        setSelectedBusinessId(accommodations[0].id);
      }
    } catch {
      toast.error('Failed to load your accommodation businesses');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (bId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/rooms/business/${bId}`);
      setRooms(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      description: '',
      capacity: 2,
      basePrice: 100,
      totalInventory: 5,
      amenities: '',
      images: [],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      basePrice: room.basePrice,
      totalInventory: room.totalInventory,
      amenities: room.amenities.join(', '),
      images: room.images || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room type?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      toast.success('Room deleted successfully');
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch {
      toast.error('Failed to delete room');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        businessId: selectedBusinessId,
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity),
        basePrice: Number(formData.basePrice),
        totalInventory: Number(formData.totalInventory),
        amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
        images: formData.images,
      };

      if (editingRoom) {
        const res = await api.put(`/rooms/${editingRoom.id}`, payload);
        toast.success('Room updated successfully');
        setRooms(rooms.map(r => (r.id === editingRoom.id ? res.data.data : r)));
      } else {
        const res = await api.post('/rooms', payload);
        toast.success('Room created successfully');
        setRooms([...rooms, res.data.data]);
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    }
  };

  if (loading && businesses.length === 0) return <LoadingSpinner message="Loading inventory..." />;

  if (businesses.length === 0) {
    return (
      <div className="partner-page fade-in">
        <div className="partner-empty-card">
          <h2>No Accommodation Businesses Found</h2>
          <p>Inventory management is available only for Resorts, Hotels, and Homestays.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-page fade-in">
      <div className="partner-page-header">
        <div>
          <h1 className="partner-page-title">Room & Inventory Management</h1>
          <p className="partner-page-subtitle">Manage room units, pricing, capacity, and total inventory.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Add Room Type
        </button>
      </div>

      <div className="business-selector-bar">
        <label>Select Property:</label>
        <select 
          value={selectedBusinessId} 
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          className="select-input"
        >
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name} ({b.type})</option>
          ))}
        </select>
      </div>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            {room.images && room.images[0] && (
              <img src={room.images[0]} alt={room.name} className="room-card-img" />
            )}
            <div className="room-card-body">
              <div className="room-card-header">
                <h3>{room.name}</h3>
                <div className="room-actions">
                  <button onClick={() => handleOpenEdit(room)} className="icon-btn" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="icon-btn text-danger" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="room-desc">{room.description}</p>

              <div className="room-stats">
                <div className="room-stat">
                  <Users size={16} />
                  <span>Max {room.capacity} Guests</span>
                </div>
                <div className="room-stat">
                  <DollarSign size={16} />
                  <span>${room.basePrice} / night</span>
                </div>
                <div className="room-stat">
                  <Layers size={16} />
                  <span>{room.totalInventory} Units Total</span>
                </div>
              </div>

              {room.amenities.length > 0 && (
                <div className="room-amenities">
                  {room.amenities.map((am, i) => (
                    <span key={i} className="amenity-badge">{am}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingRoom ? 'Edit Room Type' : 'Add New Room Type'}</h2>
            <form onSubmit={handleSubmit} className="room-form">
              <div className="form-group">
                <label>Room Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                  placeholder="e.g. Deluxe Jungle Villa" 
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Details about the room, view, bedding..." 
                  rows={3} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Guests (Capacity) *</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={formData.capacity} 
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Price Per Night ($) *</label>
                  <input 
                    type="number" 
                    min={0} 
                    value={formData.basePrice} 
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Total Physical Units (Inventory) *</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={formData.totalInventory} 
                    onChange={(e) => setFormData({ ...formData, totalInventory: Number(e.target.value) })} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Amenities (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.amenities} 
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} 
                  placeholder="AC, King Bed, Jungle View, Balcony" 
                />
              </div>

              <div className="form-group">
                <label>Room Images</label>
                <ImageUpload 
                  coverImage={formData.images[0] || ''}
                  images={formData.images} 
                  onChange={(cover, imgs) => {
                    const all = cover ? [cover, ...imgs.filter(i => i !== cover)] : imgs;
                    setFormData(prev => ({ ...prev, images: all }));
                  }} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerRooms;
