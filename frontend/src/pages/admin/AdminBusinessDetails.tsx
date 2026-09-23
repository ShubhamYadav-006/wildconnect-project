import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { businessService, type Business } from '../../services/business.service';
import { destinationService, type Destination } from '../../services/destination.service';
import { authService, type User } from '../../services/auth.service';
import ImageUpload from '../../components/ui/ImageUpload';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Tag,
  CheckCircle,
  XCircle,
  PauseCircle,
  Trash2,
  Pencil,
  Building2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import '../../styles/admin/AdminBusinessDetails.css';

const BUSINESS_TYPES = [
  { value: 'RESORT', label: 'Resort / Stay' },
  { value: 'TAXI', label: 'Safari / Taxi Service' },
  { value: 'CAMERA_RENTAL', label: 'Camera / Gear Rental' },
];

export const AdminBusinessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [partners, setPartners] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status Modals
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Edit Business Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    type: 'RESORT',
    description: '',
    destinationId: '',
    userId: '',
    status: 'APPROVED',
    coverImage: '',
    images: [] as string[],
    contactEmail: '',
    contactPhone: '',
    address: '',
    starRating: 4,
    amenitiesText: '',
  });

  const fetchBusiness = React.useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await businessService.getAdminBusinessById(id);
      setBusiness(data);

      const destRes = await destinationService.getAll();
      const destData = destRes.data || destRes;
      if (Array.isArray(destData)) {
        setDestinations(destData);
        if (data?.destinationId) {
          const foundDest = destData.find((d: Destination) => d.id === data.destinationId);
          if (foundDest) setDestination(foundDest);
        }
      }

      const usersRes = await authService.getAllUsers();
      const usersData = usersRes?.data || usersRes;
      if (Array.isArray(usersData)) {
        setPartners(usersData.filter((u: User) => u.role === 'BUSINESS_PARTNER'));
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
      toast.error('Business not found or failed to load.');
      navigate('/admin/businesses');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const handleOpenEditModal = () => {
    if (!business) return;
    setEditFormData({
      name: business.name || '',
      type: business.type || 'RESORT',
      description: business.description || '',
      destinationId: business.destinationId || '',
      userId: business.userId || '',
      status: business.status || 'APPROVED',
      coverImage: business.coverImage || '',
      images: Array.isArray(business.images) ? business.images : [],
      contactEmail: business.contactEmail || '',
      contactPhone: business.contactPhone || '',
      address: business.address || '',
      starRating: business.starRating || 4,
      amenitiesText: Array.isArray(business.amenities) ? business.amenities.join(', ') : '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'starRating' ? Number(value) : value,
    }));
  };

  const handleSaveBusinessEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    if (!editFormData.name.trim()) {
      toast.error('Business name is required');
      return;
    }
    if (!editFormData.description.trim() || editFormData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    try {
      setIsSubmittingEdit(true);

      const amenitiesArray = editFormData.amenitiesText
        ? editFormData.amenitiesText.split(',').map((a) => a.trim()).filter(Boolean)
        : [];

      const payload: any = {
        name: editFormData.name.trim(),
        type: editFormData.type,
        description: editFormData.description.trim(),
        destinationId: editFormData.destinationId || undefined,
        status: editFormData.status,
        coverImage: editFormData.coverImage.trim() || undefined,
        images: editFormData.images,
        contactEmail: editFormData.contactEmail.trim() || undefined,
        contactPhone: editFormData.contactPhone.trim() || undefined,
        address: editFormData.address.trim() || undefined,
        starRating: editFormData.type === 'RESORT' ? Number(editFormData.starRating) : undefined,
        amenities: amenitiesArray,
        userId: editFormData.userId || undefined,
      };

      await businessService.updateBusiness(business.id, payload);
      toast.success('Business listing updated successfully!');
      setIsEditModalOpen(false);
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to update business:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update business';
      toast.error(msg);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleApprove = async () => {
    if (!business || !window.confirm('Approve this business? It will become public.')) return;
    try {
      await businessService.updateBusinessStatus(business.id, 'APPROVED');
      toast.success('Business approved and is now live!');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to approve', error);
      toast.error(error.response?.data?.message || 'Failed to approve business.');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !rejectionReason.trim()) return;
    try {
      await businessService.updateBusinessStatus(business.id, 'REJECTED', rejectionReason);
      toast.success('Business application rejected.');
      setRejecting(false);
      setRejectionReason('');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to reject', error);
      toast.error(error.response?.data?.message || 'Failed to reject business.');
    }
  };

  const handleSuspend = async () => {
    if (!business || !window.confirm('Suspend this business? It will be removed from public view.')) return;
    try {
      await businessService.updateBusinessStatus(business.id, 'SUSPENDED');
      toast.success('Business suspended.');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to suspend', error);
      toast.error(error.response?.data?.message || 'Failed to suspend business.');
    }
  };

  const handleDelete = async () => {
    if (!business || !window.confirm('Are you sure you want to remove this business listing? It will no longer be considered an active listing for its partner.')) return;
    try {
      await businessService.deleteBusiness(business.id);
      toast.success('Business listing removed successfully.');
      fetchBusiness();
    } catch (error: any) {
      console.error('Failed to remove business', error);
      toast.error(error.response?.data?.message || 'Failed to remove business.');
    }
  };

  if (isLoading || !business) {
    return <LoadingSpinner message="Loading application details..." />;
  }

  return (
    <div className="admin-business-details fade-in">
      {/* Header */}
      <div className="details-header-row">
        <Link to="/admin/businesses" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Businesses</span>
        </Link>
        <div className="details-actions">
          {!business.deletedAt && (
            <>
              {/* Admin Direct Edit Button */}
              <button
                className="action-btn btn-primary"
                style={{ background: '#1F4D3A', color: '#FFFFFF', borderColor: '#1F4D3A', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={handleOpenEditModal}
                title="Edit published listing details"
              >
                <Pencil size={15} /> Edit Business
              </button>

              {business.status === 'PENDING_REVIEW' && (
                <>
                  <button className="action-btn btn-success" onClick={handleApprove}>
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button className="action-btn btn-danger" onClick={() => setRejecting(true)}>
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}
              {(business.status === 'APPROVED' || business.status === 'DRAFT' || business.status === 'REJECTED') && (
                <button className="action-btn btn-danger" onClick={() => setRejecting(true)}>
                  <XCircle size={16} /> Reject/Revoke
                </button>
              )}
              {business.status === 'APPROVED' && (
                <button className="action-btn btn-secondary" onClick={handleSuspend}>
                  <PauseCircle size={16} /> Suspend
                </button>
              )}
              {business.status === 'SUSPENDED' && (
                <button className="action-btn btn-success" onClick={handleApprove}>
                  <CheckCircle size={16} /> Re-Approve
                </button>
              )}
              <button className="action-btn btn-danger" onClick={handleDelete} title="Remove listing">
                <Trash2 size={16} /> Remove Listing
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Review Card */}
      <div className="review-card">
        {business.deletedAt && (
          <div className="rejection-alert" style={{ backgroundColor: '#fce8e6', borderColor: '#fad2cf', color: '#c5221f' }}>
            <strong>⚠️ Removed Listing:</strong> This business was removed on {new Date(business.deletedAt).toLocaleString()} and is no longer an active listing.
          </div>
        )}

        <div className="review-header">
          <div className="review-title">
            <h1>{business.name}</h1>
            {business.deletedAt ? (
              <span className="status-badge status-REMOVED" style={{ backgroundColor: '#fce8e6', color: '#c5221f' }}>REMOVED</span>
            ) : (
              <span className={`status-badge status-${business.status}`}>{business.status.replace('_', ' ')}</span>
            )}
          </div>
          <div className="review-meta">
            <span><strong>Type:</strong> {business.type.replace('_', ' ')}</span>
            <span><strong>Applied:</strong> {new Date(business.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {business.rejectionReason && (
          <div className="rejection-alert">
            <strong>Rejection / Flag Reason:</strong> {business.rejectionReason}
          </div>
        )}

        <div className="review-grid">
          <div className="review-main">
            <section className="review-section">
              <h3>Description</h3>
              <p className="description-text">{business.description}</p>
            </section>

            <section className="review-section">
              <h3>Media Assets</h3>
              <div className="images-preview-grid">
                {business.coverImage && (
                  <div className="image-item cover-item">
                    <img src={business.coverImage} alt="Cover" />
                    <span className="cover-tag">Cover Photo</span>
                  </div>
                )}
                {business.images?.map((img, i) => (
                  <div key={i} className="image-item">
                    <img src={img} alt={`Gallery ${i + 1}`} />
                  </div>
                ))}
                {!business.coverImage && (!business.images || business.images.length === 0) && (
                  <p className="no-media-text">No images uploaded for this listing.</p>
                )}
              </div>
            </section>

            {(business.amenities?.length || business.metadata?.services?.length) ? (
              <section className="review-section">
                <h3>Offerings</h3>
                <div className="tags-container">
                  {business.amenities?.map((am, i) => (
                    <span key={i} className="tag"><Tag size={12} /> {am}</span>
                  ))}
                  {business.metadata?.services?.map((sv: string, i: number) => (
                    <span key={i} className="tag"><Tag size={12} /> {sv}</span>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="review-sidebar">
            <div className="info-box">
              <h3>Owner Information</h3>
              {business.user ? (
                <>
                  <p><strong>Name:</strong> {business.user.firstName} {business.user.lastName}</p>
                  <p><strong>Email:</strong> {business.user.email}</p>
                  <p><strong>User ID:</strong> {business.user.id}</p>
                </>
              ) : (
                <p><strong>User ID:</strong> <br/>{business.userId || 'Admin Managed'}</p>
              )}
            </div>

            <div className="info-box">
              <h3>Contact & Location</h3>
              <div className="contact-item">
                <Mail size={16} /> {business.contactEmail || 'N/A'}
              </div>
              <div className="contact-item">
                <Phone size={16} /> {business.contactPhone || 'N/A'}
              </div>
              <div className="contact-item">
                <MapPin size={16} /> {business.address || 'N/A'}
              </div>
              {destination && (
                <div className="contact-item">
                  <strong>Destination:</strong> {destination.name}
                </div>
              )}
            </div>

            {business.metadata?.pricing && (
              <div className="info-box">
                <h3>Pricing Info</h3>
                <p className="pricing-text">
                  {typeof business.metadata.pricing === 'object'
                    ? (business.metadata.pricing.pricePerNight
                      ? `₹${business.metadata.pricing.pricePerNight} / night`
                      : JSON.stringify(business.metadata.pricing))
                    : String(business.metadata.pricing)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          Admin Edit Business Modal
      ========================================== */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => !isSubmittingEdit && setIsEditModalOpen(false)}>
          <div className="modal-content admin-business-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Building2 className="modal-icon" size={24} />
                <div>
                  <h3>Edit Business: {business.name}</h3>
                  <p>Directly modify published listing details, photos, or ownership.</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmittingEdit}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBusinessEdit} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Business Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    placeholder="e.g. Tadoba Wilderness Resort"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business Type *</label>
                  <select name="type" value={editFormData.type} onChange={handleEditInputChange}>
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
                    value={editFormData.destinationId}
                    onChange={handleEditInputChange}
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
                  <select name="userId" value={editFormData.userId} onChange={handleEditInputChange}>
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
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Comprehensive description of the business..."
                  rows={3}
                  required
                />
              </div>

              {/* Local Device Image Upload */}
              <div className="form-group">
                <label>Listing Images (Upload from device or set cover photo)</label>
                <ImageUpload
                  coverImage={editFormData.coverImage}
                  images={editFormData.images}
                  onChange={(newCover, newImages) => {
                    setEditFormData(prev => ({
                      ...prev,
                      coverImage: newCover,
                      images: newImages,
                    }));
                  }}
                  disabled={isSubmittingEdit}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Listing Status</label>
                  <select name="status" value={editFormData.status} onChange={handleEditInputChange}>
                    <option value="APPROVED">APPROVED (Live on Public Portal)</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                {editFormData.type === 'RESORT' && (
                  <div className="form-group">
                    <label>Star Rating (1 - 5)</label>
                    <input
                      type="number"
                      name="starRating"
                      min={1}
                      max={5}
                      value={editFormData.starRating}
                      onChange={handleEditInputChange}
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
                    value={editFormData.contactEmail}
                    onChange={handleEditInputChange}
                    placeholder="contact@business.com"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={editFormData.contactPhone}
                    onChange={handleEditInputChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Physical Address / Location</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                  placeholder="Near Moharli Gate, Tadoba, Maharashtra"
                />
              </div>

              <div className="form-group">
                <label>Amenities / Tags (Comma-separated)</label>
                <input
                  type="text"
                  name="amenitiesText"
                  value={editFormData.amenitiesText}
                  onChange={handleEditInputChange}
                  placeholder="WiFi, Swimming Pool, Safari Gypsy, Restaurant, AC"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmittingEdit}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-submit" disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejecting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Application</h3>
            <p>Please provide a reason. This will be visible to the partner.</p>
            <form onSubmit={handleReject}>
              <div className="form-group">
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Photos are blurry, incomplete description..."
                  rows={4}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setRejecting(false)}>Cancel</button>
                <button type="submit" className="btn-danger">Confirm Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusinessDetails;
