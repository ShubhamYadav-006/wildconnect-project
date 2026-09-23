/* ==========================================================
   Partner Safari Vehicles Management Component (TAXI)
   ========================================================== */

import { useState, useEffect } from 'react';
import { vehicleService, BusinessVehicle } from '../../../services/vehicle.service';
import { businessService, Business } from '../../../services/business.service';
import { Car, Plus, Trash2, Users, Clock } from 'lucide-react';
import '../../../styles/partner/PartnerVehicles.css';

export const PartnerVehicles = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [vehicles, setVehicles] = useState<BusinessVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: 'SAFARI_GYPSY_4X4',
    modelName: '',
    registrationNumber: '',
    driverName: '',
    driverPhone: '',
    maxPassengers: 6,
    supportedSlots: ['MORNING_SAFARI', 'AFTERNOON_SAFARI'],
    basePricePerSlot: 4500,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
  });

  useEffect(() => {
    fetchMyBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchVehicles(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const fetchMyBusinesses = async () => {
    try {
      setIsLoading(true);
      const res = await businessService.getMyBusinesses();
      const taxiBusinesses = (res.data || []).filter((b: Business) => b.type === 'TAXI' || b.type === 'RESORT');
      setBusinesses(taxiBusinesses);
      if (taxiBusinesses.length > 0) {
        setSelectedBusinessId(taxiBusinesses[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVehicles = async (busId: string) => {
    try {
      const res = await vehicleService.getVehiclesByBusiness(busId);
      setVehicles(res.data || []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your fleet?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert('Failed to delete vehicle.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await vehicleService.createVehicle({
        ...formData,
        businessId: selectedBusinessId,
      } as any);
      setVehicles(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({
        vehicleType: 'SAFARI_GYPSY_4X4',
        modelName: '',
        registrationNumber: '',
        driverName: '',
        driverPhone: '',
        maxPassengers: 6,
        supportedSlots: ['MORNING_SAFARI', 'AFTERNOON_SAFARI'],
        basePricePerSlot: 4500,
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create vehicle.');
    }
  };

  if (isLoading) {
    return <div className="partner-vehicles-container"><p>Loading vehicle fleet...</p></div>;
  }

  return (
    <div className="partner-vehicles-container">
      <div className="vehicles-header">
        <div>
          <h1 className="vehicles-title">Safari Vehicle Fleet Manager</h1>
          <p className="vehicles-subtitle">
            Configure 4x4 safari Gypsies, transfer cabs, drivers, and safari slot availability.
          </p>
        </div>

        {businesses.length > 0 && (
          <button onClick={() => setIsModalOpen(true)} className="vehicles-btn-primary">
            <Plus size={18} />
            Add Vehicle
          </button>
        )}
      </div>

      {businesses.length === 0 ? (
        <div className="kyc-form-card">
          <p>Please create a business listing with category <strong>TAXI</strong> or <strong>RESORT</strong> first to add vehicles.</p>
        </div>
      ) : (
        <>
          <div className="vehicles-filter-bar">
            <label>Select Business:</label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="vehicles-select"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.type})
                </option>
              ))}
            </select>
          </div>

          <div className="vehicles-grid">
            {vehicles.map((v) => (
              <div key={v.id} className="vehicle-card">
                <img
                  src={v.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'}
                  alt={v.modelName}
                  className="vehicle-card-img"
                />
                <div className="vehicle-card-body">
                  <span className="vehicle-tag">{v.vehicleType.replace(/_/g, ' ')}</span>
                  <h3 className="vehicle-name">{v.modelName}</h3>

                  <div className="vehicle-meta-row">
                    <span>Plate: <strong>{v.registrationNumber}</strong></span>
                    <span><Users size={14} style={{ display: 'inline', marginRight: 4 }} /> Max {v.maxPassengers} Seats</span>
                  </div>

                  {v.driverName && (
                    <div className="vehicle-meta-row">
                      <span>Driver: {v.driverName}</span>
                      <span>{v.driverPhone}</span>
                    </div>
                  )}

                  <div className="vehicle-slots-list">
                    {v.supportedSlots?.map((slot, i) => (
                      <span key={i} className="vehicle-slot-pill">
                        <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                        {slot.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="vehicle-price">
                    ₹{v.basePricePerSlot?.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#6F7B73' }}>/ safari slot</span>
                  </div>

                  <div className="vehicle-card-actions">
                    <button onClick={() => handleDelete(v.id)} className="vehicle-btn-delete">
                      <Trash2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {vehicles.length === 0 && (
            <div className="kyc-form-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Car size={40} color="#6F7B73" style={{ marginBottom: '1rem' }} />
              <h3>No Vehicles Added Yet</h3>
              <p style={{ color: '#6F7B73', marginTop: '0.5rem' }}>Click 'Add Vehicle' above to register your first safari vehicle.</p>
            </div>
          )}
        </>
      )}

      {/* Modal for adding vehicle */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1F4D3A' }}>Add Safari Vehicle</h2>
            
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
                    className="vehicles-select"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  >
                    <option value="SAFARI_GYPSY_4X4">Safari Gypsy 4x4 (Open Top)</option>
                    <option value="INNOVA_TRANSFER">Innova Transfer Cab</option>
                    <option value="CANTER_SAFARI">Canter Safari Safari Bus</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Vehicle Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maruti Suzuki Gypsy King 4x4"
                    value={formData.modelName}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    className="kyc-form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Registration Number Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH 34 AA 9988"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="kyc-form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Driver Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patil"
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Driver Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 9876543210"
                      value={formData.driverPhone}
                      onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Max Passengers</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.maxPassengers}
                      onChange={(e) => setFormData({ ...formData, maxPassengers: Number(e.target.value) })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Price Per Slot (₹) *</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={formData.basePricePerSlot}
                      onChange={(e) => setFormData({ ...formData, basePricePerSlot: Number(e.target.value) })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.625rem 1.25rem', border: '1px solid #DCE2DC', background: '#FFFFFF', borderRadius: '0.5rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" className="vehicles-btn-primary">
                    Save Vehicle
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerVehicles;
