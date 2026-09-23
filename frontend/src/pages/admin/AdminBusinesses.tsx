import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Building2, Pencil, Eye } from 'lucide-react';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import { authService, type User } from '../../services/auth.service';
import ImageUpload from '../../components/ui/ImageUpload';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminBusinesses.css';

const BUSINESS_TYPES = [
  { value: 'RESORT', label: 'Resort / Stay' },
  { value: 'TAXI', label: 'Safari / Taxi Service' },
  { value: 'CAMERA_RENTAL', label: 'Camera / Gear Rental' },
];

const AdminBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [partners, setPartners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'REMOVED'>('PENDING');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'RESORT',
    description: '',
    destinationId: '',
    userId: '', // Partner assignment (optional)
    status: 'APPROVED',
    coverImage: '',
    images: [] as string[],
    contactEmail: '',
    contactPhone: '',
    address: '',
    starRating: 4,
    amenitiesText: '',
  });

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getAdminBusinesses();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching admin businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportingData = async () => {
    try {
      // Fetch destinations
      const destRes = await destinationService.getAll();
      const destData = destRes?.data || destRes;
      if (Array.isArray(destData)) {
        setDestinations(destData);
      }

      // Fetch users for partner assignment
      const usersRes = await authService.getAllUsers();
      const usersData = usersRes?.data || usersRes;
      if (Array.isArray(usersData)) {
        setPartners(usersData.filter((u: User) => u.role === 'BUSINESS_PARTNER'));
      }
    } catch (error) {
      console.error('Error fetching supporting data:', error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchSupportingData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingBusiness(null);
    setFormData({
      name: '',
      type: 'RESORT',
      description: '',
      destinationId: destinations[0]?.id || '',
      userId: '',
      status: 'APPROVED',
      coverImage: '',
      images: [],
      contactEmail: '',
      contactPhone: '',
      address: '',
      starRating: 4,
      amenitiesText: 'WiFi, Parking, Restaurant, Room Service',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (biz: Business) => {
    setEditingBusiness(biz);
    setFormData({
      name: biz.name || '',
      type: biz.type || 'RESORT',
      description: biz.description || '',
      destinationId: biz.destinationId || (biz.destination?.id || ''),
      userId: biz.userId || '',
      status: biz.status || 'APPROVED',
      coverImage: biz.coverImage || '',
      images: Array.isArray(biz.images) ? biz.images : [],
      contactEmail: biz.contactEmail || '',
      contactPhone: biz.contactPhone || '',
      address: biz.address || '',
      starRating: biz.starRating || 4,
      amenitiesText: Array.isArray(biz.amenities) ? biz.amenities.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingBusiness(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'starRating' ? Number(value) : value,
    }));
  };

  const handleSubmitBusiness = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Business name is required');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    try {
      setIsSubmitting(true);

      const amenitiesArray = formData.amenitiesText
        ? formData.amenitiesText.split(',').map((a) => a.trim()).filter(Boolean)
        : [];

      const payload: any = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
        destinationId: formData.destinationId || undefined,
        status: formData.status,
        coverImage: formData.coverImage.trim() || undefined,
        images: formData.images,
        contactEmail: formData.contactEmail.trim() || undefined,
        contactPhone: formData.contactPhone.trim() || undefined,
        address: formData.address.trim() || undefined,
        starRating: formData.type === 'RESORT' ? Number(formData.starRating) : undefined,
        amenities: amenitiesArray,
        userId: formData.userId || undefined,
      };

      if (editingBusiness) {
        // Admin direct edit on published or any listing
        await businessService.updateBusiness(editingBusiness.id, payload);
        toast.success(`"${formData.name}" updated successfully!`);
      } else {
        // Create new business
        await businessService.createBusiness(payload);
        toast.success('Business created successfully!');
      }

      setIsModalOpen(false);
      setEditingBusiness(null);
      fetchBusinesses();
    } catch (error: any) {
      console.error('Error saving business:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save business';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedBusinesses = activeTab === 'ALL' 
    ? businesses
    : activeTab === 'PENDING'
    ? businesses.filter(b => b.status === 'PENDING_REVIEW' && !b.deletedAt)
    : activeTab === 'APPROVED'
    ? businesses.filter(b => b.status === 'APPROVED' && !b.deletedAt)
    : activeTab === 'REJECTED'
    ? businesses.filter(b => b.status === 'REJECTED' && !b.deletedAt)
    : activeTab === 'SUSPENDED'
    ? businesses.filter(b => b.status === 'SUSPENDED' && !b.deletedAt)
    : businesses.filter(b => !!b.deletedAt);

  return (
    <div className="admin-businesses-page fade-in">
      <div className="admin-header-row">
        <div className="admin-header">
          <h2>Business Management</h2>
          <p>Review, create, and manage partner business applications & platform listings.</p>
        </div>
        <button className="admin-create-btn" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          <span>Add Business</span>
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          Pending Review ({businesses.filter(b => b.status === 'PENDING_REVIEW' && !b.deletedAt).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setActiveTab('APPROVED')}
        >
          Approved ({businesses.filter(b => b.status === 'APPROVED' && !b.deletedAt).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setActiveTab('REJECTED')}
        >
          Rejected ({businesses.filter(b => b.status === 'REJECTED' && !b.deletedAt).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'SUSPENDED' ? 'active' : ''}`}
          onClick={() => setActiveTab('SUSPENDED')}
        >
          Suspended ({businesses.filter(b => b.status === 'SUSPENDED' && !b.deletedAt).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'REMOVED' ? 'active' : ''}`}
          onClick={() => setActiveTab('REMOVED')}
        >
          Removed ({businesses.filter(b => !!b.deletedAt).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Businesses ({businesses.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading businesses...</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Owner / Partner</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No businesses found in this category.
                  </td>
                </tr>
              ) : (
                displayedBusinesses.map((biz) => (
                  <tr key={biz.id}>
                    <td>
                      <strong>{biz.name}</strong>
                      {biz.destination?.name && (
                        <div className="table-subtext">📍 {biz.destination.name}</div>
                      )}
                    </td>
                    <td>
                      <span className="business-type-badge">
                        {biz.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {biz.user ? (
                        <div className="owner-cell">
                          <span className="owner-name">{biz.user.firstName} {biz.user.lastName}</span>
                          <span className="owner-email">{biz.user.email}</span>
                        </div>
                      ) : (
                        <span className="owner-admin-tag">Admin Managed</span>
                      )}
                    </td>
                    <td>{new Date(biz.createdAt).toLocaleDateString()}</td>
                    <td>
                      {biz.deletedAt ? (
                        <span className="status-badge status-REMOVED">REMOVED</span>
                      ) : (
                        <span className={`status-badge status-${biz.status}`}>{biz.status.replace('_', ' ')}</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <Link to={`/admin/businesses/${biz.id}`} className="action-link-btn" title="View Application Details">
                          <Eye size={14} style={{ marginRight: '4px' }} />
                          View
                        </Link>
                        <button
                          type="button"
                          className="action-link-btn"
                          style={{ background: '#1F4D3A', color: '#FFFFFF', borderColor: '#1F4D3A', cursor: 'pointer' }}
                          onClick={() => handleOpenEditModal(biz)}
                          title="Edit Published Business Details"
                        >
                          <Pencil size={13} style={{ marginRight: '4px' }} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ==========================================
          Create / Edit Business Modal
      ========================================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content admin-business-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Building2 className="modal-icon" size={24} />
                <div>
                  <h3>{editingBusiness ? `Edit Business: ${editingBusiness.name}` : 'Create New Business'}</h3>
                  <p>{editingBusiness ? 'Directly update live listing details, photos, or ownership.' : 'Register a verified business listing or assign to a partner.'}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal} disabled={isSubmitting}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitBusiness} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Business Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Tadoba Wilderness Resort"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Safari Destination</label>
                  <select
                    name="destinationId"
                    value={formData.destinationId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- No Destination / Independent --</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign Partner Owner (Optional)</label>
                  <select name="userId" value={formData.userId} onChange={handleInputChange}>
                    <option value="">Admin Managed (No Partner Owner)</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Comprehensive description of the business, wildlife offerings, accessibility, and highlights..."
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload from Local Device */}
              <div className="form-group">
                <label>Listing Images (Upload from local device or set cover photo)</label>
                <ImageUpload
                  coverImage={formData.coverImage}
                  images={formData.images}
                  onChange={(newCover, newImages) => {
                    setFormData(prev => ({
                      ...prev,
                      coverImage: newCover,
                      images: newImages,
                    }));
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Listing Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="APPROVED">APPROVED (Live on Public Portal)</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                {formData.type === 'RESORT' && (
                  <div className="form-group">
                    <label>Star Rating (1 - 5)</label>
                    <input
                      type="number"
                      name="starRating"
                      min={1}
                      max={5}
                      value={formData.starRating}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="contact@business.com"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Physical Address / Location</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Near Moharli Gate, Tadoba, Maharashtra"
                />
              </div>

              <div className="form-group">
                <label>Amenities / Tags (Comma-separated)</label>
                <input
                  type="text"
                  name="amenitiesText"
                  value={formData.amenitiesText}
                  onChange={handleInputChange}
                  placeholder="WiFi, Swimming Pool, Safari Gypsy, Restaurant, AC"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingBusiness ? 'Save Changes' : 'Create Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusinesses;
