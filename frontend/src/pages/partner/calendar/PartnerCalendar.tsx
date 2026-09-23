/* ==========================================================
   Partner Availability & Blackout Calendar Component
   ========================================================== */

import { useState, useEffect } from 'react';
import { calendarBlockService, BusinessInventoryBlock } from '../../../services/calendarBlock.service';
import { businessService, Business } from '../../../services/business.service';
import { CalendarDays, Plus, Trash2, Ban } from 'lucide-react';
import '../../../styles/partner/PartnerCalendar.css';

export const PartnerCalendar = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [blocks, setBlocks] = useState<BusinessInventoryBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    unitsBlocked: 1,
    reason: 'PROPERTY_MAINTENANCE',
    notes: '',
  });

  useEffect(() => {
    fetchMyBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchBlocks(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const fetchMyBusinesses = async () => {
    try {
      setIsLoading(true);
      const res = await businessService.getMyBusinesses();
      setBusinesses(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedBusinessId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlocks = async (busId: string) => {
    try {
      const res = await calendarBlockService.getBlocksByBusiness(busId);
      setBlocks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch blocks:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this date block and release inventory back to availability?')) return;
    try {
      await calendarBlockService.deleteBlock(id);
      setBlocks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete block.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await calendarBlockService.createBlock({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        businessId: selectedBusinessId,
      } as any);
      setBlocks(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({
        startDate: '',
        endDate: '',
        unitsBlocked: 1,
        reason: 'PROPERTY_MAINTENANCE',
        notes: '',
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create blackout block.');
    }
  };

  if (isLoading) {
    return <div className="partner-calendar-container"><p>Loading availability calendar...</p></div>;
  }

  return (
    <div className="partner-calendar-container">
      <div className="calendar-header">
        <div>
          <h1 className="calendar-title">Date-Range Availability & Blackout Manager</h1>
          <p className="calendar-subtitle">
            Manually block specific dates for property maintenance, offline bookings, or monsoon closures.
          </p>
        </div>

        {businesses.length > 0 && (
          <button onClick={() => setIsModalOpen(true)} className="calendar-btn-primary">
            <Plus size={18} />
            Add Date Blackout
          </button>
        )}
      </div>

      {businesses.length === 0 ? (
        <div className="kyc-form-card">
          <p>Please create a business listing first to manage calendar availability.</p>
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

          <div className="calendar-blocks-list">
            {blocks.map((block) => {
              const start = new Date(block.startDate).toLocaleDateString();
              const end = new Date(block.endDate).toLocaleDateString();

              return (
                <div key={block.id} className="calendar-block-item">
                  <div>
                    <div className="block-dates">
                      <Ban size={18} color="#B94A48" />
                      Blocked from {start} to {end}
                    </div>
                    <span className="block-reason-tag">{block.reason.replace(/_/g, ' ')}</span>
                    {block.notes && <p style={{ fontSize: '0.85rem', color: '#6F7B73', marginTop: '0.25rem' }}>Notes: {block.notes}</p>}
                  </div>

                  <div>
                    <button onClick={() => handleDelete(block.id)} className="vehicle-btn-delete">
                      <Trash2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Release Block
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {blocks.length === 0 && (
            <div className="kyc-form-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CalendarDays size={40} color="#6F7B73" style={{ marginBottom: '1rem' }} />
              <h3>No Manual Date Blocks</h3>
              <p style={{ color: '#6F7B73', marginTop: '0.5rem' }}>All dates are open for bookings based on your normal inventory.</p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1F4D3A' }}>Add Date Blackout Block</h2>

            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>End Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="kyc-form-input"
                      style={{ width: '100%', marginTop: '0.35rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Reason for Blocking *</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
                    className="vehicles-select"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  >
                    <option value="PROPERTY_MAINTENANCE">Property Maintenance / Renovation</option>
                    <option value="WALK_IN_OFFLINE_BOOKING">Offline / Direct Walk-in Booking</option>
                    <option value="MONSOON_CLOSURE">Monsoon / Seasonal Park Closure</option>
                    <option value="PERSONAL_USE">Personal / Private Host Use</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Notes / Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual pool servicing"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="kyc-form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.625rem 1.25rem', border: '1px solid #DCE2DC', background: '#FFFFFF', borderRadius: '0.5rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" className="calendar-btn-primary">
                    Create Blackout
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

export default PartnerCalendar;
