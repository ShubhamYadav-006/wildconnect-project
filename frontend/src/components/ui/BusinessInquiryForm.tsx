import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Send, X, Mail } from 'lucide-react';
import '../../styles/public/BusinessInquiryForm.css';

interface BusinessInquiryFormProps {
  businessId: string;
  businessName: string;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

const BusinessInquiryForm: React.FC<BusinessInquiryFormProps> = ({
  businessId,
  businessName,
  onClose,
  defaultEmail,
  defaultName
}) => {
  const [formData, setFormData] = useState({
    customerName: defaultName || '',
    customerEmail: defaultEmail || '',
    customerPhone: '',
    message: '',
    dateRequested: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/inquiries', {
        businessId,
        ...formData
      });
      toast.success('Your inquiry has been sent successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inquiry-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="inquiry-modal">
        <div className="inquiry-modal-header">
          <div className="inquiry-title-wrap">
            <div className="inquiry-icon-badge">
              <Mail size={18} />
            </div>
            <h2>Enquire Now</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <p className="inquiry-subtitle">
          Send an inquiry directly to <strong>{businessName}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className="inquiry-form">
          <div className="form-group">
            <label htmlFor="customerName">
              Full Name <span className="required-star">*</span>
            </label>
            <input 
              id="customerName"
              type="text" 
              name="customerName" 
              value={formData.customerName} 
              onChange={handleChange} 
              required 
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerEmail">
                Email Address <span className="required-star">*</span>
              </label>
              <input 
                id="customerEmail"
                type="email" 
                name="customerEmail" 
                value={formData.customerEmail} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerPhone">
                Phone Number <span className="optional-tag">(Optional)</span>
              </label>
              <input 
                id="customerPhone"
                type="tel" 
                name="customerPhone" 
                value={formData.customerPhone} 
                onChange={handleChange} 
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="dateRequested">
              Preferred Date <span className="optional-tag">(Optional)</span>
            </label>
            <input 
              id="dateRequested"
              type="date" 
              name="dateRequested" 
              value={formData.dateRequested} 
              onChange={handleChange} 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message <span className="required-star">*</span>
            </label>
            <textarea 
              id="message"
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              rows={4}
              placeholder="What would you like to know? E.g., room availability, pricing, amenities, or special requests..."
            />
          </div>

          <button type="submit" className="submit-inquiry-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>Sending inquiry...</span>
            ) : (
              <>
                <Send size={18} /> Send Inquiry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessInquiryForm;
