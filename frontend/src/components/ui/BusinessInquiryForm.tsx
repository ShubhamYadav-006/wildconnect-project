import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Send, X } from 'lucide-react';
import '../../styles/public/BusinessInquiryForm.css';

interface BusinessInquiryFormProps {
  businessId: string;
  businessName: string;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

const BusinessInquiryForm: React.FC<BusinessInquiryFormProps> = ({ businessId, businessName, onClose, defaultEmail, defaultName }) => {
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
    <div className="inquiry-modal-overlay">
      <div className="inquiry-modal">
        <div className="inquiry-modal-header">
          <h2>Enquire Now</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        
        <p className="inquiry-subtitle">Send a message directly to <strong>{businessName}</strong></p>
        
        <form onSubmit={handleSubmit} className="inquiry-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              name="customerName" 
              value={formData.customerName} 
              onChange={handleChange} 
              required 
              placeholder="John Doe"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="customerEmail" 
                value={formData.customerEmail} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input 
                type="tel" 
                name="customerPhone" 
                value={formData.customerPhone} 
                onChange={handleChange} 
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Preferred Date (Optional)</label>
            <input 
              type="date" 
              name="dateRequested" 
              value={formData.dateRequested} 
              onChange={handleChange} 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              rows={4}
              placeholder="What would you like to know? E.g., availability, pricing, specific requirements..."
            />
          </div>

          <button type="submit" className="submit-inquiry-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : (
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
