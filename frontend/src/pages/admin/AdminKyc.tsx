/* ==========================================================
   Admin KYC Verification Desk Component
   ========================================================== */

import { useState, useEffect } from 'react';
import { kycService, PartnerKyc } from '../../services/kyc.service';
import { Check, X, ExternalLink } from 'lucide-react';
import '../../styles/admin/AdminKyc.css';

export const AdminKyc = () => {
  const [records, setRecords] = useState<PartnerKyc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKycRecords();
  }, []);

  const fetchKycRecords = async () => {
    try {
      setIsLoading(true);
      const res = await kycService.getAllKyc();
      setRecords(res.data || []);
    } catch (err) {
      console.error('Failed to fetch KYC records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'KYC_VERIFIED' | 'KYC_REJECTED') => {
    let reason: string | undefined;
    if (status === 'KYC_REJECTED') {
      reason = window.prompt('Enter reason for KYC rejection:') || undefined;
      if (!reason) return;
    }

    try {
      await kycService.reviewKyc(id, status, reason);
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status, rejectionReason: reason || null } : r));
    } catch (err) {
      alert('Failed to update KYC status.');
    }
  };

  if (isLoading) {
    return <div className="admin-kyc-container"><p>Loading partner KYC submissions...</p></div>;
  }

  return (
    <div className="admin-kyc-container">
      <div className="admin-kyc-header">
        <h1 className="admin-kyc-title">Partner KYC Compliance Desk</h1>
        <p className="admin-kyc-subtitle">
          Review business registration proofs, ID documents, and bank payout profiles to approve partners.
        </p>
      </div>

      <div className="admin-kyc-grid">
        {records.map((r) => (
          <div key={r.id} className="admin-kyc-card">
            <h3 className="admin-kyc-user">
              {r.user?.firstName} {r.user?.lastName} ({r.user?.email})
            </h3>

            <div className="admin-kyc-field"><strong>Status:</strong> <span className={`payout-status-tag ${r.status === 'KYC_VERIFIED' ? 'paid' : 'escrow'}`}>{r.status.replace(/_/g, ' ')}</span></div>
            <div className="admin-kyc-field"><strong>Business PAN:</strong> {r.businessPan}</div>
            {r.gstin && <div className="admin-kyc-field"><strong>GSTIN:</strong> {r.gstin}</div>}
            <div className="admin-kyc-field"><strong>Bank Account:</strong> {r.bankAccountName} | {r.bankName}</div>
            <div className="admin-kyc-field"><strong>Account No / IFSC:</strong> {r.bankAccountNumber} ({r.bankIfsc})</div>

            <div style={{ margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <a href={r.idProofUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#1F4D3A', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ExternalLink size={14} /> View ID Proof Document
              </a>
              <a href={r.businessProofUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#1F4D3A', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ExternalLink size={14} /> View Business Registration Proof
              </a>
              {r.cancelledChequeUrl && (
                <a href={r.cancelledChequeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#1F4D3A', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={14} /> View Cancelled Cheque Copy
                </a>
              )}
            </div>

            {r.status === 'KYC_PENDING' && (
              <div className="admin-kyc-actions">
                <button onClick={() => handleReview(r.id, 'KYC_VERIFIED')} className="admin-btn-approve">
                  <Check size={16} style={{ display: 'inline', marginRight: 4 }} />
                  Verify Partner
                </button>
                <button onClick={() => handleReview(r.id, 'KYC_REJECTED')} className="admin-btn-reject">
                  <X size={16} style={{ display: 'inline', marginRight: 4 }} />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6F7B73' }}>
          No KYC compliance records submitted yet.
        </div>
      )}
    </div>
  );
};

export default AdminKyc;
