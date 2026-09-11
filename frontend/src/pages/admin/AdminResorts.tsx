import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Tent,
  Plus,
  X,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  resortService,
  type Resort,
} from '../../services/resort.service';

import {
  destinationService,
  type Destination,
} from '../../services/destination.service';

import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminResorts.css';
import '../../styles/globals/modals.css';
import '../../styles/globals/forms.css';

const AdminResorts = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    destinationId: '',
    starRating: '',
    amenities: '',
    coverImage: '',
    images: '',
  });


  /* ==========================================================
     FETCH RESORTS
     ========================================================== */

  const fetchResorts = async () => {
    try {
      const response = await resortService.getAll();

      if (response.success) {
        setResorts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch resorts', error);
      toast.error('Failed to load resorts');
    } finally {
      setIsLoading(false);
    }
  };


  /* ==========================================================
     FETCH DESTINATIONS
     ========================================================== */

  const fetchDestinations = async () => {
    try {
      const response = await destinationService.getAll();

      if (response.success) {
        setDestinations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch destinations', error);
      toast.error('Failed to load destinations');
    }
  };


  useEffect(() => {
    fetchResorts();
    fetchDestinations();
  }, []);


  /* ==========================================================
     OPEN ADD MODAL
     ========================================================== */

  const handleOpenAddModal = () => {
    setSelectedResort(null);

    setFormData({
      name: '',
      description: '',
      address: '',
      destinationId: '',
      starRating: '',
      amenities: '',
      coverImage: '',
      images: '',
    });

    setIsModalOpen(true);
  };


  /* ==========================================================
     OPEN EDIT MODAL
     ========================================================== */

  const handleOpenEditModal = (resort: Resort) => {
    setSelectedResort(resort);

    setFormData({
      name: resort.name || '',
      description: resort.description || '',
      address: resort.address || '',
      destinationId: resort.destinationId || '',
      starRating:
        resort.starRating !== undefined && resort.starRating !== null
          ? String(resort.starRating)
          : '',
      amenities: Array.isArray(resort.amenities)
        ? resort.amenities.join(', ')
        : '',
      coverImage: resort.coverImage || '',
      images: Array.isArray(resort.images)
        ? resort.images.join(', ')
        : '',
    });

    setIsModalOpen(true);
  };


  /* ==========================================================
     DELETE RESORT
     ========================================================== */

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this resort? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const response = await resortService.softDelete(id);

      if (response.success) {
        toast.success('Resort Deleted successfully!');
        fetchResorts();
      } else {
        toast.error(response.message || 'Failed to delete resort');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        'Failed to delete resort'
      );
    }
  };


  /* ==========================================================
     SUBMIT FORM
     ========================================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.address.trim() ||
      !formData.destinationId
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),

        description: formData.description.trim(),

        address: formData.address.trim(),

        destinationId: formData.destinationId,

        starRating: formData.starRating
          ? Number(formData.starRating)
          : undefined,

        amenities: formData.amenities
          ? formData.amenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
          : [],

        coverImage: formData.coverImage.trim() || undefined,

        images: formData.images
          ? formData.images
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
          : [],
      };

      if (payload.name.length < 2) {
        toast.error('Resort name must be at least 2 characters.');
        return;
      }
      if (payload.name.length > 150) {
        toast.error('Resort name must be at most 150 characters.');
        return;
      }

      if (payload.description.length < 10) {
        toast.error('Description must be at least 10 characters.');
        return;
      }

      if (payload.address.length < 5) {
        toast.error('Address must be at least 5 characters.');
        return;
      }

      if (payload.starRating !== undefined) {
        if (
          !Number.isInteger(payload.starRating) ||
          payload.starRating < 1 ||
          payload.starRating > 5
        ) {
          toast.error('Star Rating must be an integer between 1 and 5.');
          return;
        }
      }

      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      if (payload.coverImage && !isValidUrl(payload.coverImage)) {
        toast.error('Cover image must be a valid URL (starting with http:// or https://)');
        return;
      }

      if (payload.images.some((img) => !isValidUrl(img))) {
        toast.error(
          'All additional images must be valid URLs (starting with http:// or https://)'
        );
        return;
      }

      let response;

      if (selectedResort) {
        response = await resortService.updateBy(
          selectedResort.id,
          payload
        );
      } else {
        response = await resortService.create(payload);
      }

      if (response.success) {
        toast.success(
          selectedResort
            ? 'Resort updated successfully!'
            : 'Resort created successfully!'
        );

        setIsModalOpen(false);

        fetchResorts();
      } else {
        toast.error(
          response.message || 'Failed to save resort'
        );
      }
    } catch (error: any) {
      console.error('Failed to save resort', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to save resort'
      );
    }
  };


  /* ==========================================================
     GET DESTINATION NAME
     ========================================================== */

  const getDestinationName = (destinationId: string) => {
    const destination = destinations.find(
      (item) => item.id === destinationId
    );

    return destination?.name || 'Unknown Destination';
  };


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="admin-page-container fade-in">

      {/* Back */}

      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} />
        Back to Admin Dashboard
      </Link>


      {/* Header */}

      <div className="admin-page-header">

        <div>
          <h1 className="admin-page-title">
            Resorts
          </h1>

          <p className="admin-page-subtitle">
            Manage verified resorts and properties.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="admin-btn admin-btn-accent"
        >
          <Plus size={16} />
          Add Resort
        </button>

      </div>


      {/* Loading */}

      {isLoading ? (

        <div className="admin-resort-loading">
          Loading resorts...
        </div>

      ) : resorts.length === 0 ? (

        /* Empty State */

        <div className="admin-card">

          <div className="admin-resort-empty-state">

            <Tent className="admin-resort-empty-icon" />

            <h3 className="admin-resort-empty-title">
              No Resorts Found
            </h3>

            <p className="admin-resort-empty-desc">
              Add your first resort to get started.
            </p>

            <button
              onClick={handleOpenAddModal}
              className="admin-btn admin-btn-accent admin-resort-empty-btn"
            >
              <Plus size={16} />
              Add First Resort
            </button>

          </div>

        </div>

      ) : (

        /* Resort Grid */

        <div className="admin-resorts-grid">

          {resorts.map((resort) => (

            <div
              key={resort.id}
              className="admin-card admin-resort-card"
            >

              {/* Image */}

              {resort.coverImage ? (

                <img
                  src={resort.coverImage}
                  alt={resort.name}
                  className="admin-resort-img"
                />

              ) : (

                <div className="admin-resort-placeholder">
                  <Tent size={42} />
                </div>

              )}


              {/* Body */}

              <div className="admin-resort-body">

                <h3 className="admin-resort-title">
                  {resort.name}
                </h3>

                <p className="admin-resort-destination">
                  {getDestinationName(resort.destinationId)}
                </p>

                {resort.address && (
                  <p className="admin-resort-address">
                    {resort.address}
                  </p>
                )}

                <p className="admin-resort-description">
                  {resort.description}
                </p>

                {resort.starRating && (
                  <div className="admin-resort-rating">
                    ★ {resort.starRating}
                  </div>
                )}

              </div>


              {/* Actions */}

              <div className="admin-resort-actions">

                {resort.slug && (
                  <Link
                    to={`/resorts/${resort.slug}`}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                )}

                <button
                  onClick={() =>
                    handleOpenEditModal(resort)
                  }
                  className="admin-btn admin-btn-secondary"
                >
                  <Edit size={14} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(resort.id)
                  }
                  className="admin-btn admin-btn-danger"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ======================================================
          ADD / EDIT RESORT MODAL
          ====================================================== */}

      {isModalOpen && (

        <div className="modal-backdrop">

          <div className="modal-content admin-resort-modal">

            {/* Modal Header */}

            <div className="modal-header">

              <h2 className="modal-title">
                {selectedResort
                  ? 'Edit Resort'
                  : 'Add New Resort'}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="modal-close-btn"
              >
                <X size={20} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="form-container admin-resort-form"
            >

              {/* Resort Name */}

              <div className="form-group">

                <label className="form-label">
                  Resort Name *
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Tadoba Jungle Camp"
                  className="form-input"
                  required
                />

              </div>


              {/* Destination */}

              <div className="form-group">

                <label className="form-label">
                  Destination *
                </label>

                <select
                  value={formData.destinationId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationId: e.target.value,
                    })
                  }
                  className="form-input"
                  required
                >

                  <option value="">
                    Select a destination
                  </option>

                  {destinations.map((destination) => (

                    <option
                      key={destination.id}
                      value={destination.id}
                    >
                      {destination.name}
                    </option>

                  ))}

                </select>

              </div>


              {/* Description */}

              <div className="form-group">

                <label className="form-label">
                  Description *
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the resort, location and experience..."
                  rows={5}
                  className="form-textarea"
                  required
                />

              </div>


              {/* Address */}

              <div className="form-group">

                <label className="form-label">
                  Address *
                </label>

                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  placeholder="e.g. Moharli, Chandrapur, Maharashtra"
                  className="form-input"
                  required
                />

              </div>


              {/* Rating + Amenities */}

              <div className="admin-resort-form-grid">

                <div className="form-group">

                  <label className="form-label">
                    Star Rating (1-5)
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    value={formData.starRating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        starRating: e.target.value,
                      })
                    }
                    placeholder="e.g. 4"
                    className="form-input"
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Amenities
                  </label>

                  <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amenities: e.target.value,
                      })
                    }
                    placeholder="Wi-Fi, Parking, Restaurant"
                    className="form-input"
                  />

                  <small className="admin-form-help">
                    Separate amenities with commas.
                  </small>

                </div>

              </div>


              {/* Cover Image */}

              <div className="form-group">

                <label className="form-label">
                  Cover Image URL
                </label>

                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverImage: e.target.value,
                    })
                  }
                  placeholder="https://example.com/resort.jpg"
                  className="form-input"
                />

              </div>


              {/* Additional Images */}

              <div className="form-group">

                <label className="form-label">
                  Additional Image URLs
                </label>

                <textarea
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={3}
                  className="form-textarea"
                />

                <small className="admin-form-help">
                  Add multiple image URLs separated by commas.
                </small>

              </div>


              {/* Actions */}

              <div className="form-actions">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn-accent"
                >
                  {selectedResort
                    ? 'Save Changes'
                    : 'Create Resort'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminResorts;