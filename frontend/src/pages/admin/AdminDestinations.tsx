import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map, Plus, Edit, Trash2, X, Compass } from 'lucide-react';
import { destinationService, type Destination } from '../../services/destination.service';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminDestinations.css';
import '../../styles/globals/modals.css';
import '../../styles/globals/forms.css';

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    state: '',
    country: 'India',
    bestSeason: '',
    coverImage: ''
  });

  const fetchDestinations = async () => {
    try {
      const response = await destinationService.getAll();
      if (response.success) {
        setDestinations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch destinations', error);
      toast.error('Failed to load destinations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedDestination(null);
    setFormData({
      name: '',
      description: '',
      state: '',
      country: 'India',
      bestSeason: '',
      coverImage: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (destination: Destination) => {
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      state: destination.state,
      country: (destination as any).country || 'India',
      bestSeason: destination.bestSeason || '',
      coverImage: destination.coverImage || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination? This cannot be undone.')) {
      return;
    }

    try {
      const response = await destinationService.delete(id);
      if (response.success) {
        toast.success('Destination deleted successfully!');
        fetchDestinations();
      } else {
        toast.error(response.message || 'Failed to delete destination');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete destination');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.state) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        state: formData.state,
        country: formData.country,
        bestSeason: formData.bestSeason || undefined,
        coverImage: formData.coverImage || undefined
      };

      let response;
      if (selectedDestination) {
        response = await destinationService.update(selectedDestination.id, payload);
      } else {
        response = await destinationService.create(payload);
      }

      if (response.success) {
        toast.success(selectedDestination ? 'Destination updated!' : 'Destination created!');
        setIsModalOpen(false);
        fetchDestinations();
      } else {
        toast.error(response.message || 'Failed to save destination');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save destination');
    }
  };

  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Destinations</h1>
          <p className="admin-page-subtitle">Manage wildlife parks and reserves.</p>
        </div>
        <button onClick={handleOpenAddModal} className="admin-btn admin-btn-accent">
          <Plus size={16} /> Add Destination
        </button>
      </div>

      {isLoading ? (
        <div style={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-muted)' }}>
          Loading destinations...
        </div>
      ) : destinations.length === 0 ? (
        <div className="admin-card">
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Map size={48} style={{ color: 'var(--color-text-muted)', opacity: 0.5, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>No Destinations Found</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>Add your first destination to get started.</p>
          </div>
        </div>
      ) : (
        <div className="admin-destinations-grid">
          {destinations.map((destination) => (
            <div key={destination.id} className="admin-card admin-destination-card">
              <div>
                {destination.coverImage ? (
                  <img src={destination.coverImage} alt={destination.name} className="admin-destination-img" />
                ) : (
                  <div className="admin-destination-placeholder">
                    <Map size={48} />
                  </div>
                )}
                <div className="admin-destination-body">
                  <h3 className="admin-destination-title">{destination.name}</h3>
                  <p className="admin-destination-meta">
                    {destination.state}, {(destination as any).country || 'India'}
                  </p>
                  <p className="admin-destination-desc">{destination.description}</p>
                  {destination.bestSeason && (
                    <p className="admin-destination-season">
                      <strong>Best Season:</strong> {destination.bestSeason}
                    </p>
                  )}
                </div>
              </div>

              <div className="admin-destination-actions">
                <Link
                  to={`/destinations/${destination.slug}`}
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                >
                  <Compass size={14} /> View Page
                </Link>
                <button
                  onClick={() => handleOpenEditModal(destination)}
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(destination.id)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'var(--color-error)' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '36rem' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedDestination ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-container" style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <div className="form-group">
                <label className="form-label">Destination Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tadoba National Park"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about the park, safari activities, and geography..."
                  rows={4}
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. India"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Best Season to Visit (Optional)</label>
                <input
                  type="text"
                  value={formData.bestSeason}
                  onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                  placeholder="e.g. October to June"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>

              <div className="form-actions" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-accent"
                >
                  {selectedDestination ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDestinations;
