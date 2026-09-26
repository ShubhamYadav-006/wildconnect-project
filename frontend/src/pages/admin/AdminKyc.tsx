/* ==========================================================
   Admin KYC Verification Desk Component (2-Document Verification)
   ========================================================== */

import { useState, useEffect } from 'react';
import { kycService, PartnerKyc } from '../../services/kyc.service';
import { Check, X, ShieldCheck, FileCheck2, UserCheck, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/admin/AdminKyc.css';

const DOC_LABELS: Record<string, string> = {
  AADHAAR_CARD: 'Aadhaar Card',
  PAN_CARD: 'PAN Card',
  DRIVING_LICENSE: 'Driving License',
  VOTER_ID: 'Voter ID (EPIC)',
  PASSPORT: 'Indian Passport',
  GSTIN_REGISTRATION: 'GSTIN / Business Reg',
};

export const AdminKyc = () => {
  const [records, setRecords] = useState<PartnerKyc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchKycRecords();
  }, []);

  const fetchKycRecords = async () => {
    try {
      setIsLoading(true);
      const res = await kycService.getAllKyc();
      setRecords(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch KYC records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'KYC_VERIFIED' | 'KYC_REJECTED') => {
    let rejectionReason = '';
    if (status === 'KYC_REJECTED') {
      const inputReason = prompt('Please enter a reason for rejecting these document numbers:');
      if (inputReason === null) return;
      rejectionReason = inputReason.trim() || 'Document numbers could not be validated.';
    }

    try {
      setProcessingId(id);
      await kycService.reviewKyc(id, status, rejectionReason);
      await fetchKycRecords();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update KYC status.');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDocType = (type?: string | null, fallback = 'Aadhaar Card') => {
    if (!type) return fallback;
    return DOC_LABELS[type] || type.replace(/_/g, ' ');
  };

  if (isLoading) {
    return (
      <div className="admin-kyc-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <LoadingSpinner size="md" />
          <p style={{ marginTop: '1rem', color: '#6F7B73' }}>Loading partner KYC compliance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-kyc-container">
      <div className="admin-kyc-header">
        <h1 className="admin-kyc-title">Partner Identity Verification Desk</h1>
        <p className="admin-kyc-subtitle">
          Review and verify submitted partner identification document numbers to authorize businesses for live bookings.
        </p>
      </div>

      <div className="admin-kyc-grid">
        {records.map((r) => (
          <div key={r.id} className="admin-kyc-card">
            <div className="admin-kyc-card-top">
              <div className="admin-kyc-user-info">
                <UserCheck size={20} className="admin-kyc-user-icon" />
                <h3 className="admin-kyc-user">
                  {r.user?.firstName} {r.user?.lastName}
                </h3>
              </div>
              <span
                className={`admin-kyc-badge ${
                  r.status === 'KYC_VERIFIED'
                    ? 'verified'
                    : r.status === 'KYC_PENDING'
                    ? 'pending'
                    : r.status === 'KYC_REJECTED'
                    ? 'rejected'
                    : 'unsubmitted'
                }`}
              >
                {r.status.replace(/^KYC_/, '').replace(/_/g, ' ')}
              </span>
            </div>

            <div className="admin-kyc-field">
              <strong>Email:</strong> <span>{r.user?.email || 'N/A'}</span>
            </div>

            {r.user?.phone && (
              <div className="admin-kyc-field">
                <strong>Phone:</strong> <span>{r.user.phone}</span>
              </div>
            )}

            {/* Submitted 2-Document Details */}
            <div className="admin-kyc-docs-block">
              <div className="admin-kyc-doc-item">
                <div className="admin-kyc-doc-label">
                  <FileCheck2 size={15} />
                  <span>{formatDocType(r.doc1Type, 'Primary Document')}</span>
                </div>
                <div className="admin-kyc-doc-val">
                  {r.doc1Number || r.aadhaarNumber || 'Not Provided'}
                </div>
              </div>

              <div className="admin-kyc-doc-item">
                <div className="admin-kyc-doc-label">
                  <FileCheck2 size={15} />
                  <span>{formatDocType(r.doc2Type, 'Secondary Document')}</span>
                </div>
                <div className="admin-kyc-doc-val">
                  {r.doc2Number || r.businessPan || 'Not Provided'}
                </div>
              </div>
            </div>

            {r.rejectionReason && (
              <div className="admin-kyc-rejection-note">
                <AlertTriangle size={15} />
                <span>
                  <strong>Rejection Note:</strong> {r.rejectionReason}
                </span>
              </div>
            )}

            {r.status === 'KYC_PENDING' && (
              <div className="admin-kyc-actions">
                <button
                  onClick={() => handleReview(r.id, 'KYC_VERIFIED')}
                  disabled={processingId === r.id}
                  className="admin-btn-approve"
                >
                  <Check size={16} />
                  <span>{processingId === r.id ? 'Updating...' : 'Approve & Verify'}</span>
                </button>
                <button
                  onClick={() => handleReview(r.id, 'KYC_REJECTED')}
                  disabled={processingId === r.id}
                  className="admin-btn-reject"
                >
                  <X size={16} />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6F7B73' }}>
          <ShieldCheck size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
          <p>No partner document verification records found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminKyc;
