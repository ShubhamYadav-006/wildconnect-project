import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, User, Eye, CheckCircle, Clock } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import '../../../styles/partner/PartnerInquiries.css';

interface Inquiry {
  id: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  dateRequested: string | null;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  business: {
    id: string;
    name: string;
    type: string;
  };
}

const PartnerInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/partner/inquiries');
      setInquiries(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-badge warning"><Clock size={14} /> Pending</span>;
      case 'RESPONDED':
        return <span className="status-badge success"><CheckCircle size={14} /> Responded</span>;
      case 'CLOSED':
        return <span className="status-badge neutral">Closed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const filteredInquiries = statusFilter === 'ALL' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === statusFilter);

  if (loading) return <LoadingSpinner message="Loading inquiries..." />;

  return (
    <div className="partner-page fade-in">
      <div className="partner-page-header">
        <div>
          <h1 className="partner-page-title">Business Inquiries</h1>
          <p className="partner-page-subtitle">Manage messages and booking requests from customers.</p>
        </div>
      </div>

      <div className="partner-inquiries-container">
        <div className="inquiry-filters">
          <button 
            className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Inquiries
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'RESPONDED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('RESPONDED')}
          >
            Responded
          </button>
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={48} className="empty-icon" />
            <h3>No inquiries found</h3>
            <p>You have no {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} inquiries at the moment.</p>
          </div>
        ) : (
          <div className="inquiries-list">
            {filteredInquiries.map(inquiry => (
              <div key={inquiry.id} className="inquiry-card">
                <div className="inquiry-header">
                  <div className="inquiry-business-info">
                    <span className="business-name">{inquiry.business.name}</span>
                    <span className="business-type">{inquiry.business.type}</span>
                  </div>
                  {getStatusBadge(inquiry.status)}
                </div>
                
                <div className="inquiry-body">
                  <div className="inquiry-customer">
                    <User size={16} /> <strong>{inquiry.customerName}</strong>
                    <span className="inquiry-date">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="inquiry-message-preview">
                    {inquiry.message.length > 100 
                      ? `${inquiry.message.substring(0, 100)}...` 
                      : inquiry.message}
                  </p>
                  
                  {inquiry.dateRequested && (
                    <div className="inquiry-meta">
                      <Calendar size={14} /> 
                      Requested Date: {new Date(inquiry.dateRequested).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="inquiry-footer">
                  <Link to={`/partner/inquiries/${inquiry.id}`} className="btn-secondary btn-sm">
                    <Eye size={16} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerInquiries;
