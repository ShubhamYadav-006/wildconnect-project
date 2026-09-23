/* ==========================================================
   Partner KYC Compliance Component
   ========================================================== */

import { useState, useEffect } from 'react';
import { kycService, PartnerKyc as KycData } from '../../../services/kyc.service';
import { ShieldCheck, Clock, AlertCircle, Landmark, CheckCircle2 } from 'lucide-react';
import '../../../styles/partner/PartnerKyc.css';

export const PartnerKyc = () => {
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    businessPan: '',
    gstin: '',
    idProofUrl: '',
    businessProofUrl: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: '',
    cancelledChequeUrl: '',
  });

  useEffect(() => {
    fetchKyc();
  }, []);

  const fetchKyc = async () => {
    try {
      setIsLoading(true);
      const res = await kycService.getMyKyc();
      if (res.data) {
        setKyc(res.data);
        setFormData({
          businessPan: res.data.businessPan || '',
          gstin: res.data.gstin || '',
          idProofUrl: res.data.idProofUrl || '',
          businessProofUrl: res.data.businessProofUrl || '',
          bankAccountName: res.data.bankAccountName || '',
          bankAccountNumber: res.data.bankAccountNumber || '',
          bankIfsc: res.data.bankIfsc || '',
          bankName: res.data.bankName || '',
          cancelledChequeUrl: res.data.cancelledChequeUrl || '',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch KYC:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await kycService.submitKyc(formData);
      setKyc(res.data);
      setSuccessMessage('KYC documents submitted successfully and queued for verification.');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit KYC documents.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = kyc?.status === 'KYC_VERIFIED';
  const isPending = kyc?.status === 'KYC_PENDING';
  const isRejected = kyc?.status === 'KYC_REJECTED';

  if (isLoading) {
    return <div className="partner-kyc-container"><p>Loading KYC compliance status...</p></div>;
  }

  return (
    <div className="partner-kyc-container">
      <div className="partner-kyc-header">
        <h1 className="partner-kyc-title">Partner KYC & Compliance</h1>
        <p className="partner-kyc-subtitle">
          Verify your business identity and bank settlement details to publish listings and receive direct payouts.
        </p>
      </div>

      {/* Status Banners */}
      {isVerified && (
        <div className="kyc-status-banner verified">
          <CheckCircle2 size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>KYC Verified & Active</h3>
            <p>Your business identity and settlement banking profile are verified. You can publish live listings and accept direct bookings.</p>
          </div>
        </div>
      )}

      {isPending && (
        <div className="kyc-status-banner pending">
          <Clock size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>Verification In Progress</h3>
            <p>Your documents have been received and are being reviewed by the compliance desk. This typically takes 12–24 hours.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="kyc-status-banner rejected">
          <AlertCircle size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>KYC Verification Rejected</h3>
            <p><strong>Reason:</strong> {kyc.rejectionReason || 'Please review document clarity and resubmit.'}</p>
          </div>
        </div>
      )}

      {successMessage && <div className="kyc-status-banner verified"><p>{successMessage}</p></div>}
      {errorMessage && <div className="kyc-status-banner rejected"><p>{errorMessage}</p></div>}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Business Identification */}
        <div className="kyc-form-card">
          <h2 className="kyc-section-title">
            <ShieldCheck size={20} />
            1. Business Identification Proofs
          </h2>

          <div className="kyc-grid-2">
            <div className="kyc-form-group">
              <label>Business PAN / Tax ID *</label>
              <input
                type="text"
                name="businessPan"
                value={formData.businessPan}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="kyc-form-group">
              <label>GSTIN (Optional for Unregistered Homestays)</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="27ABCDE1234F1Z5"
              />
            </div>
          </div>

          <div className="kyc-grid-2">
            <div className="kyc-form-group">
              <label>Government Photo ID URL (Passport / Aadhaar / DL) *</label>
              <input
                type="url"
                name="idProofUrl"
                value={formData.idProofUrl}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="https://.../id-proof.pdf"
              />
              <span className="kyc-helper-text">Direct secure link to passport/Aadhaar document.</span>
            </div>

            <div className="kyc-form-group">
              <label>Business Registration / Ownership Proof URL *</label>
              <input
                type="url"
                name="businessProofUrl"
                value={formData.businessProofUrl}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="https://.../msme-registration.pdf"
              />
              <span className="kyc-helper-text">MSME, Shop Act, or Property Ownership Deed.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Bank Settlement Details */}
        <div className="kyc-form-card">
          <h2 className="kyc-section-title">
            <Landmark size={20} />
            2. Bank Settlement & Payout Profile
          </h2>

          <div className="kyc-grid-2">
            <div className="kyc-form-group">
              <label>Bank Account Holder Name *</label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="As per bank passbook"
              />
            </div>

            <div className="kyc-form-group">
              <label>Bank Name *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="e.g. HDFC Bank"
              />
            </div>
          </div>

          <div className="kyc-grid-2">
            <div className="kyc-form-group">
              <label>Account Number *</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="50100234567890"
              />
            </div>

            <div className="kyc-form-group">
              <label>IFSC Code *</label>
              <input
                type="text"
                name="bankIfsc"
                value={formData.bankIfsc}
                onChange={handleChange}
                required
                disabled={isVerified}
                className="kyc-form-input"
                placeholder="HDFC0001234"
              />
            </div>
          </div>

          <div className="kyc-form-group">
            <label>Cancelled Cheque / Passbook Copy URL</label>
            <input
              type="url"
              name="cancelledChequeUrl"
              value={formData.cancelledChequeUrl}
              onChange={handleChange}
              disabled={isVerified}
              className="kyc-form-input"
              placeholder="https://.../cancelled-cheque.jpg"
            />
          </div>
        </div>

        {!isVerified && (
          <div className="kyc-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="kyc-btn-submit"
            >
              {isSubmitting ? 'Submitting Documents...' : 'Submit KYC for Verification'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PartnerKyc;
