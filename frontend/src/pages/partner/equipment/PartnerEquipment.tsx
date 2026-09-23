/* ==========================================================
   Partner Cameras & Gear Management Component (CAMERA_RENTAL)
   ========================================================== */

import { useState, useEffect } from 'react';
import { equipmentService, BusinessEquipment } from '../../../services/equipment.service';
import { businessService, Business } from '../../../services/business.service';
import { Camera, Plus, Trash2, Check } from 'lucide-react';
import '../../../styles/partner/PartnerEquipment.css';

export const PartnerEquipment = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [equipment, setEquipment] = useState<BusinessEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    equipmentType: 'TELEPHOTO_LENS',
    brandAndModel: '',
    serialNumber: '',
    dailyRate: 1500,
    securityDeposit: 5000,
    condition: 'EXCELLENT',
    kitIncludes: ['Lens Hood', 'Front & Rear Caps', 'Carrying Pouch'],
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
  });

  useEffect(() => {
    fetchMyBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchEquipment(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const fetchMyBusinesses = async () => {
    try {
      setIsLoading(true);
      const res = await businessService.getMyBusinesses();
      const cameraBusinesses = (res.data || []).filter((b: Business) => b.type === 'CAMERA_RENTAL' || b.type === 'RESORT');
      setBusinesses(cameraBusinesses);
      if (cameraBusinesses.length > 0) {
        setSelectedBusinessId(cameraBusinesses[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEquipment = async (busId: string) => {
    try {
      const res = await equipmentService.getEquipmentByBusiness(busId);
      setEquipment(res.data || []);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this item from your rental catalog?')) return;
    try {
      await equipmentService.deleteEquipment(id);
      setEquipment(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete equipment.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await equipmentService.createEquipment({
        ...formData,
        businessId: selectedBusinessId,
      } as any);
      setEquipment(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({
        equipmentType: 'TELEPHOTO_LENS',
        brandAndModel: '',
        serialNumber: '',
        dailyRate: 1500,
        securityDeposit: 5000,
        condition: 'EXCELLENT',
        kitIncludes: ['Lens Hood', 'Front & Rear Caps', 'Carrying Pouch'],
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add equipment item.');
    }
  };

  if (isLoading) {
    return <div className="partner-equip-container"><p>Loading equipment catalog...</p></div>;
  }

  return (
    <div className="partner-equip-container">
      <div className="equip-header">
        <div>
          <h1 className="equip-title">Camera & Gear Rental Inventory</h1>
          <p className="equip-subtitle">
            Manage wildlife telephoto lenses, camera bodies, security deposits, and rental rates.
          </p>
        </div>

        {businesses.length > 0 && (
          <button onClick={() => setIsModalOpen(true)} className="equip-btn-primary">
            <Plus size={18} />
            Add Camera / Lens
          </button>
        )}
      </div>

      {businesses.length === 0 ? (
        <div className="kyc-form-card">
          <p>Please create a business listing with category <strong>CAMERA_RENTAL</strong> or <strong>RESORT</strong> first to add gear.</p>
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

          <div className="equip-grid">
            {equipment.map((item) => (
              <div key={item.id} className="equip-card">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'}
                  alt={item.brandAndModel}
                  className="equip-card-img"
                />
                <div className="equip-card-body">
                  <span className="equip-tag">{item.equipmentType.replace(/_/g, ' ')}</span>
                  <h3 className="equip-name">{item.brandAndModel}</h3>

                  <div className="equip-deposit">
                    Condition: <strong>{item.condition}</strong> | Deposit: <strong>₹{item.securityDeposit?.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="vehicle-slots-list">
                    {item.kitIncludes?.map((kit, i) => (
                      <span key={i} className="vehicle-slot-pill">
                        <Check size={12} style={{ display: 'inline', marginRight: 4, color: '#1F4D3A' }} />
                        {kit}
                      </span>
                    ))}
                  </div>

                  <div className="equip-price">
                    ₹{item.dailyRate?.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#6F7B73' }}>/ 24-hr rental day</span>
                  </div>

                  <div className="vehicle-card-actions">
                    <button onClick={() => handleDelete(item.id)} className="vehicle-btn-delete">
                      <Trash2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {equipment.length === 0 && (
            <div className="kyc-form-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Camera size={40} color="#6F7B73" style={{ marginBottom: '1rem' }} />
              <h3>No Camera Gear Listed Yet</h3>
              <p style={{ color: '#6F7B73', marginTop: '0.5rem' }}>Click 'Add Camera / Lens' above to register your first telephoto lens or camera body.</p>
            </div>
          )}
        </>
      )}

      {/* Modal for adding equipment */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1F4D3A' }}>Add Camera / Telephoto Lens</h2>
            
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Equipment Type *</label>
                  <select
                    value={formData.equipmentType}
                    onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value as any })}
                    className="vehicles-select"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  >
                    <option value="TELEPHOTO_LENS">Wildlife Telephoto Lens</option>
                    <option value="CAMERA_BODY">Camera Body (DSLR / Mirrorless)</option>
                    <option value="ACCESSORY_KIT">Accessory Kit / Gimbal / Tripod</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Brand & Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony FE 200-600mm f/5.6-6.3 G OSS"
                    value={formData.brandAndModel}
                    onChange={(e) => setFormData({ ...formData, brandAndModel: e.target.value })}
                    className="kyc-form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Serial Number / SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-8839210"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="kyc-form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Daily Rate (₹ / Day) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Security Deposit (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.625rem 1.25rem', border: '1px solid #DCE2DC', background: '#FFFFFF', borderRadius: '0.5rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" className="equip-btn-primary">
                    Save Gear
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

export default PartnerEquipment;
