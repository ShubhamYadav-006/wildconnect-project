import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, CheckCircle } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const PartnerInquiryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/partner/inquiries/${id}`);
        setInquiry(res.data.data);
      } catch {
        toast.error('Failed to load inquiry details');
        navigate('/partner/inquiries');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id, navigate]);

  const updateStatus = async (status: 'RESPONDED' | 'CLOSED') => {
    try {
      setUpdating(true);
      await api.patch(`/partner/inquiries/${id}/status`, { status });
      setInquiry({ ...inquiry, status });
      toast.success(`Inquiry marked as ${status.toLowerCase()}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading inquiry details..." />;
  if (!inquiry) return null;

  return (
    <div className="partner-page fade-in">
      <div className="partner-page-header">
        <div>
          <Link to="/partner/inquiries" className="back-link">
            <ArrowLeft size={16} /> Back to Inquiries
          </Link>
          <h1 className="partner-page-title" style={{ marginTop: '0.5rem' }}>Inquiry Details</h1>
          <p className="partner-page-subtitle">For {inquiry.business.name}</p>
        </div>
      </div>

      <div className="inquiry-details-container">
        <div className="inquiry-main-card">
          <div className="detail-section">
            <h3>Customer Message</h3>
            <div className="message-box">
              {inquiry.message}
            </div>
            <p className="inquiry-date" style={{ marginTop: '1rem', display: 'block' }}>
              Received on: {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
          
          {inquiry.dateRequested && (
            <div className="detail-section">
              <h3>Requested Date</h3>
              <div className="inquiry-meta" style={{ display: 'inline-flex' }}>
                <Calendar size={16} /> 
                {new Date(inquiry.dateRequested).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        <div className="inquiry-side-card">
          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <User className="contact-info-icon" size={18} />
                <div className="contact-info-content">
                  <span className="contact-info-label">Name</span>
                  <span className="contact-info-value">{inquiry.customerName}</span>
                </div>
              </div>
              
              <div className="contact-info-item">
                <Mail className="contact-info-icon" size={18} />
                <div className="contact-info-content">
                  <span className="contact-info-label">Email</span>
                  <a href={`mailto:${inquiry.customerEmail}`} className="contact-info-value" style={{ color: 'var(--color-primary)' }}>
                    {inquiry.customerEmail}
                  </a>
                </div>
              </div>
              
              {inquiry.customerPhone && (
                <div className="contact-info-item">
                  <Phone className="contact-info-icon" size={18} />
                  <div className="contact-info-content">
                    <span className="contact-info-label">Phone</span>
                    <a href={`tel:${inquiry.customerPhone}`} className="contact-info-value" style={{ color: 'var(--color-primary)' }}>
                      {inquiry.customerPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Status Actions</h3>
            <div style={{ marginBottom: '1rem' }}>
              Current Status: 
              <span className={`status-badge ${inquiry.status.toLowerCase()}`} style={{ display: 'inline-flex', marginLeft: '0.5rem' }}>
                {inquiry.status === 'PENDING' ? <Clock size={14} /> : <CheckCircle size={14} />} 
                {inquiry.status}
              </span>
            </div>
            
            <div className="action-buttons">
              {inquiry.status === 'PENDING' && (
                <button 
                  className="btn-primary w-full"
                  onClick={() => updateStatus('RESPONDED')}
                  disabled={updating}
                >
                  Mark as Responded
                </button>
              )}
              {inquiry.status !== 'CLOSED' && (
                <button 
                  className="btn-secondary w-full"
                  onClick={() => updateStatus('CLOSED')}
                  disabled={updating}
                >
                  Close Inquiry
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
              * Make sure to contact the customer via email or phone before marking as responded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerInquiryDetails;
