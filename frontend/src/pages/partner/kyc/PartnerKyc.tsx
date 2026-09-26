/* ==========================================================
   Partner KYC Compliance Component (2-Document Number Verification)
   ========================================================== */

import { useState, useEffect } from 'react';
import { kycService, PartnerKyc as KycData } from '../../../services/kyc.service';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  FileText,
  BadgeCheck,
  CreditCard,
  Hash,
} from 'lucide-react';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import '../../../styles/partner/PartnerKyc.css';

interface DocumentOption {
  value: string;
  label: string;
  placeholder: string;
  hint: string;
}

const DOCUMENT_OPTIONS: DocumentOption[] = [
  {
    value: 'AADHAAR_CARD',
    label: 'Aadhaar Card',
    placeholder: 'e.g. 7113 8633 9171',
    hint: '12-digit Unique Identification Number (UIDAI)',
  },
  {
    value: 'PAN_CARD',
    label: 'PAN Card',
    placeholder: 'e.g. ABCDE1234F',
    hint: '10-character Permanent Account Number',
  },
  {
    value: 'DRIVING_LICENSE',
    label: 'Driving License',
    placeholder: 'e.g. MH31 20180012345',
    hint: 'Valid Indian State Driving License Number',
  },
  {
    value: 'VOTER_ID',
    label: 'Voter ID (EPIC)',
    placeholder: 'e.g. ABC1234567',
    hint: '10-character Election Photo Identity Card Number',
  },
  {
    value: 'PASSPORT',
    label: 'Indian Passport',
    placeholder: 'e.g. A1234567',
    hint: '8-character Passport Identification Number',
  },
  {
    value: 'GSTIN_REGISTRATION',
    label: 'GSTIN / Business Registration',
    placeholder: 'e.g. 27AAAAA0000A1Z5',
    hint: '15-character Goods and Services Tax ID',
  },
];

export const PartnerKyc = () => {
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    doc1Type: 'AADHAAR_CARD',
    doc1Number: '',
    doc2Type: 'PAN_CARD',
    doc2Number: '',
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
          doc1Type: res.data.doc1Type || (res.data.aadhaarNumber ? 'AADHAAR_CARD' : 'AADHAAR_CARD'),
          doc1Number: res.data.doc1Number || res.data.aadhaarNumber || '',
          doc2Type: res.data.doc2Type || (res.data.businessPan ? 'PAN_CARD' : 'PAN_CARD'),
          doc2Number: res.data.doc2Number || res.data.businessPan || '',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch KYC:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doc1Type || !formData.doc1Number.trim()) {
      setErrorMessage('Please provide the Document 1 type and identification number.');
      return;
    }

    if (!formData.doc2Type || !formData.doc2Number.trim()) {
      setErrorMessage('Please provide the Document 2 type and identification number.');
      return;
    }

    if (formData.doc1Type === formData.doc2Type) {
      setErrorMessage('Please select two distinct documents from the approved list.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await kycService.submitKyc({
        doc1Type: formData.doc1Type,
        doc1Number: formData.doc1Number.trim(),
        doc2Type: formData.doc2Type,
        doc2Number: formData.doc2Number.trim(),
        aadhaarNumber: formData.doc1Type === 'AADHAAR_CARD' ? formData.doc1Number.trim() : (formData.doc2Type === 'AADHAAR_CARD' ? formData.doc2Number.trim() : undefined),
        businessPan: formData.doc1Type === 'PAN_CARD' ? formData.doc1Number.trim() : (formData.doc2Type === 'PAN_CARD' ? formData.doc2Number.trim() : undefined),
      });
      setKyc(res.data);
      setSuccessMessage('KYC identification numbers submitted successfully for verification!');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit KYC numbers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = kyc?.status === 'KYC_VERIFIED';
  const isPending = kyc?.status === 'KYC_PENDING';
  const isRejected = kyc?.status === 'KYC_REJECTED';
  const isUnsubmitted = !kyc || kyc.status === 'KYC_UNSUBMITTED';

  const isFormDisabled = isVerified || isPending;

  const getDocMeta = (docType: string) => {
    return DOCUMENT_OPTIONS.find((d) => d.value === docType) || DOCUMENT_OPTIONS[0];
  };

  const doc1Meta = getDocMeta(formData.doc1Type);
  const doc2Meta = getDocMeta(formData.doc2Type);

  if (isLoading) {
    return (
      <div className="partner-kyc-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <LoadingSpinner size="md" />
          <p style={{ marginTop: '1rem', color: '#6F7B73' }}>Loading KYC details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-kyc-container">
      <div className="partner-kyc-header">
        <h1 className="partner-kyc-title">Partner Identity & Compliance</h1>
        <p className="partner-kyc-subtitle">
          Verify your business partner account by providing identification numbers for any <strong>2 valid government/business documents</strong>. No image or file upload is required.
        </p>
      </div>

      {/* Status Banners */}
      {isUnsubmitted && (
        <div className="kyc-status-banner info">
          <ShieldCheck size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>Identity Verification Required</h3>
            <p>
              Select any 2 documents from the approved list and enter their numbers below. Once verified, your resorts, safari vehicles, and rentals will be approved for live bookings.
            </p>
          </div>
        </div>
      )}

      {isVerified && (
        <div className="kyc-status-banner verified">
          <CheckCircle2 size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>Partner Identity Verified & Active</h3>
            <p>Your identification documents have been verified by the WildConnect team. Your listings and booking calendar are active.</p>
          </div>
        </div>
      )}

      {isPending && (
        <div className="kyc-status-banner pending">
          <Clock size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>Verification In Review</h3>
            <p>Your document identification numbers are currently under review by our compliance desk. Approval usually takes 12–24 hours.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="kyc-status-banner rejected">
          <AlertCircle size={28} className="kyc-status-icon" />
          <div className="kyc-status-content">
            <h3>Verification Rejected</h3>
            <p>
              <strong>Admin Feedback:</strong> {kyc.rejectionReason || 'Please check the document identification numbers and resubmit.'}
            </p>
          </div>
        </div>
      )}

      {successMessage && <div className="kyc-status-banner verified"><p>{successMessage}</p></div>}
      {errorMessage && <div className="kyc-status-banner rejected"><p>{errorMessage}</p></div>}

      {/* Verified / Pending Summary View */}
      {isFormDisabled && kyc && (
        <div className="kyc-summary-card">
          <h2 className="kyc-section-title">
            <BadgeCheck size={20} />
            Submitted Identification Numbers
          </h2>

          <div className="kyc-doc-summary-grid">
            <div className="kyc-doc-badge-item">
              <div className="kyc-doc-badge-header">
                <FileCheck2 size={18} className="kyc-doc-badge-icon" />
                <span>Primary Document (Doc 1)</span>
              </div>
              <h4 className="kyc-doc-badge-type">{getDocMeta(kyc.doc1Type || 'AADHAAR_CARD').label}</h4>
              <p className="kyc-doc-badge-number">{kyc.doc1Number || kyc.aadhaarNumber || 'N/A'}</p>
            </div>

            <div className="kyc-doc-badge-item">
              <div className="kyc-doc-badge-header">
                <FileCheck2 size={18} className="kyc-doc-badge-icon" />
                <span>Secondary Document (Doc 2)</span>
              </div>
              <h4 className="kyc-doc-badge-type">{getDocMeta(kyc.doc2Type || 'PAN_CARD').label}</h4>
              <p className="kyc-doc-badge-number">{kyc.doc2Number || kyc.businessPan || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Form for New / Resubmission */}
      {!isFormDisabled && (
        <form onSubmit={handleSubmit}>
          <div className="kyc-form-card">
            <h2 className="kyc-section-title">
              <FileText size={20} />
              Select Any 2 Documents for Verification
            </h2>
            <p className="kyc-instruction-text">
              Choose two different documents from the list and enter the corresponding identification numbers:
            </p>

            {/* Document 1 Card */}
            <div className="kyc-doc-card">
              <div className="kyc-doc-card-header">
                <CreditCard size={18} />
                <span>Document 1 (Primary ID)</span>
              </div>

              <div className="kyc-doc-grid">
                <div className="kyc-form-group">
                  <label htmlFor="doc1Type">Select Document Type *</label>
                  <select
                    id="doc1Type"
                    name="doc1Type"
                    value={formData.doc1Type}
                    onChange={handleInputChange}
                    className="kyc-form-select"
                  >
                    {DOCUMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.value === formData.doc2Type}>
                        {opt.label} {opt.value === formData.doc2Type ? '(Selected as Doc 2)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kyc-form-group">
                  <label htmlFor="doc1Number">
                    {doc1Meta.label} Identification Number *
                  </label>
                  <div className="kyc-input-wrapper">
                    <Hash size={16} className="kyc-input-icon" />
                    <input
                      id="doc1Number"
                      type="text"
                      name="doc1Number"
                      value={formData.doc1Number}
                      onChange={handleInputChange}
                      placeholder={doc1Meta.placeholder}
                      className="kyc-form-input kyc-with-icon"
                      required
                    />
                  </div>
                  <span className="kyc-helper-text">{doc1Meta.hint}</span>
                </div>
              </div>
            </div>

            {/* Document 2 Card */}
            <div className="kyc-doc-card">
              <div className="kyc-doc-card-header">
                <CreditCard size={18} />
                <span>Document 2 (Secondary ID)</span>
              </div>

              <div className="kyc-doc-grid">
                <div className="kyc-form-group">
                  <label htmlFor="doc2Type">Select Document Type *</label>
                  <select
                    id="doc2Type"
                    name="doc2Type"
                    value={formData.doc2Type}
                    onChange={handleInputChange}
                    className="kyc-form-select"
                  >
                    {DOCUMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.value === formData.doc1Type}>
                        {opt.label} {opt.value === formData.doc1Type ? '(Selected as Doc 1)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kyc-form-group">
                  <label htmlFor="doc2Number">
                    {doc2Meta.label} Identification Number *
                  </label>
                  <div className="kyc-input-wrapper">
                    <Hash size={16} className="kyc-input-icon" />
                    <input
                      id="doc2Number"
                      type="text"
                      name="doc2Number"
                      value={formData.doc2Number}
                      onChange={handleInputChange}
                      placeholder={doc2Meta.placeholder}
                      className="kyc-form-input kyc-with-icon"
                      required
                    />
                  </div>
                  <span className="kyc-helper-text">{doc2Meta.hint}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="kyc-actions">
            <button
              type="submit"
              disabled={isSubmitting || !formData.doc1Number.trim() || !formData.doc2Number.trim()}
              className="kyc-btn-submit"
            >
              {isSubmitting
                ? 'Submitting...'
                : isRejected
                ? 'Resubmit Document Numbers'
                : 'Submit Document Numbers for Verification'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PartnerKyc;
