import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { businessService } from '../../../services/business.service';
import { destinationService, type Destination } from '../../../services/destination.service';
import { ArrowLeft, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ImageUpload from '../../../components/ui/ImageUpload';

import '../../../styles/partner/BusinessForm.css';

const BUSINESS_TYPES = [
  'RESORT', 'TAXI', 'CAMERA_RENTAL'
];

export const BusinessForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessStatus, setBusinessStatus] = useState<string>('DRAFT');

  const [formData, setFormData] = useState({
    name: '',
    type: 'RESORT',
    description: '',
    coverImage: '',
    images: [] as string[],
    contactEmail: '',
    contactPhone: '',
    address: '',
    destinationId: '',
    starRating: 3,
    amenities: '', // Comma-separated
    services: '', // Comma-separated, stored in metadata
    pricing: '',  // Stored in metadata
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Fetch destinations for dropdown
        const destRes = await destinationService.getAll();
        const destData = destRes.data || destRes;
        setDestinations(destData);

        if (isEditMode) {
          // Fetch existing business
          // businessService doesn't expose getMyBusinessById directly, but we can get it from getMyBusinesses()
          const myBusinesses = await businessService.getMyBusinesses();
          const businessToEdit = (Array.isArray(myBusinesses) ? myBusinesses : []).find(b => b.id === id);
          
          if (businessToEdit) {
            setBusinessStatus(businessToEdit.status);
            setFormData({
              name: businessToEdit.name || '',
              type: businessToEdit.type || 'RESORT',
              description: businessToEdit.description || '',
              coverImage: businessToEdit.coverImage || '',
              images: businessToEdit.images || [],
              contactEmail: businessToEdit.contactEmail || '',
              contactPhone: businessToEdit.contactPhone || '',
              address: businessToEdit.address || '',
              destinationId: businessToEdit.destinationId || (destData[0]?.id || ''),
              starRating: businessToEdit.starRating || 3,
              amenities: businessToEdit.amenities ? businessToEdit.amenities.join(', ') : '',
              services: businessToEdit.metadata?.services ? businessToEdit.metadata.services.join(', ') : '',
              pricing: businessToEdit.metadata?.pricing || '',
            });
          } else {
            alert('Business not found or access denied.');
            navigate('/partner/businesses');
          }
        } else {
          setFormData(prev => ({ ...prev, destinationId: destData[0]?.id || '' }));
        }
      } catch (error) {
        console.error('Error fetching data for form:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, submitForReview: boolean = false) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      const payload: any = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        coverImage: formData.coverImage,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: formData.address,
        destinationId: formData.destinationId || null,
        images: formData.images,
        metadata: {
          services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
          pricing: formData.pricing
        }
      };

      if (formData.type === 'RESORT') {
        payload.starRating = Number(formData.starRating);
        payload.amenities = formData.amenities.split(',').map(s => s.trim()).filter(Boolean);
      }

      let savedBusinessId = id;

      if (isEditMode) {
        await businessService.updateBusiness(id!, payload);
      } else {
        const created = await businessService.createBusiness(payload);
        savedBusinessId = created.id;
      }

      if (submitForReview && savedBusinessId) {
        await businessService.submitForReview(savedBusinessId);
        toast.success('Business saved and submitted for review successfully!');
      } else {
        toast.success('Business saved successfully!');
      }

      navigate('/partner/businesses');
    } catch (error: any) {
      console.error('Error saving business:', error);
      toast.error(error.response?.data?.message || 'Failed to save business. Please check required fields.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading form..." />;
  }

  const isEditable = !['PENDING_REVIEW'].includes(businessStatus);

  return (
    <div className="business-form-container fade-in">
      <div className="form-header-row">
        <Link to="/partner/businesses" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Businesses</span>
        </Link>
      </div>

      <div className="business-form-card">
        <div className="form-card-header">
          <h2>{isEditMode ? 'Edit Business Details' : 'Add New Business'}</h2>
          <p>Fill in the details below to list your business on WildConnect.</p>
        </div>

        {!isEditable && (
          <div className="form-alert-info">
            This business is currently under review. You cannot edit details until a decision is made.
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="business-form">
          {/* Section 1: Basic Info */}
          <fieldset disabled={!isEditable}>
            <legend>Basic Information</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Business Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required minLength={2} />
              </div>
              <div className="form-group">
                <label>Business Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Destination *</label>
                <select name="destinationId" value={formData.destinationId} onChange={handleChange} required>
                  <option value="">Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} rows={5} placeholder="Describe your business and what makes it special..." />
            </div>
          </fieldset>

          {/* Section 2: Media */}
          <fieldset disabled={!isEditable}>
            <legend>Media & Images</legend>
            <div className="form-group">
              <label>Business Images * (First image is the cover)</label>
              <ImageUpload
                coverImage={formData.coverImage}
                images={formData.images}
                onChange={(coverImage, images) => setFormData(prev => ({ ...prev, coverImage, images }))}
                disabled={!isEditable}
              />
            </div>
          </fieldset>

          {/* Section 3: Contact & Location */}
          <fieldset disabled={!isEditable}>
            <legend>Contact & Location</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Detailed Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Safari Lodge Road..." />
              </div>
            </div>
          </fieldset>

          {/* Section 4: Specifics based on Type */}
          <fieldset disabled={!isEditable}>
            <legend>Offerings & Amenities</legend>
            
            {formData.type === 'RESORT' && (
              <div className="form-grid">
                <div className="form-group">
                  <label>Star Rating (1-5)</label>
                  <input type="number" name="starRating" value={formData.starRating} onChange={handleChange} min={1} max={5} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Amenities (comma separated)</label>
                  <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Pool, Spa, WiFi, Jeep Safari..." />
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Key Services (comma separated)</label>
                <input type="text" name="services" value={formData.services} onChange={handleChange} placeholder="Airport Pickup, Guided Tours, Photography..." />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Pricing Information</label>
                <textarea name="pricing" value={formData.pricing} onChange={handleChange} rows={3} placeholder="Starting from $100/night or $50/tour..." />
              </div>
            </div>
          </fieldset>

          {isEditable && (
            <div className="form-actions-footer">
              <Link to="/partner/businesses" className="cancel-btn">Cancel</Link>
              <div className="submit-group">
                <button 
                  type="submit" 
                  className="save-btn" 
                  disabled={isSaving}
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
                </button>
                <button 
                  type="button" 
                  className="submit-review-btn" 
                  disabled={isSaving}
                  onClick={(e) => {
                    if(window.confirm('Are you sure you want to save and submit for review?')) {
                      handleSubmit(e as any, true);
                    }
                  }}
                >
                  <Send size={18} />
                  <span>Submit for Review</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
