import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = (statusStr: string) => {
    const s = statusStr.toUpperCase();
    switch (s) {
      case 'PENDING':
        return {
          className: 'badge-pending',
          label: 'Pending',
          icon: <Clock size={12} />
        };
      case 'REVIEWING':
        return {
          className: 'badge-reviewing',
          label: 'Reviewing',
          icon: <Clock size={12} />
        };
      case 'PROPOSAL_READY':
        return {
          className: 'badge-proposal-ready',
          label: 'Proposal Available',
          icon: <CheckCircle size={12} />
        };
      case 'ACCEPTED':
      case 'CONFIRMED':
      case 'BOOKED':
      case 'PUBLISHED':
        return {
          className: 'badge-success',
          label: s === 'BOOKED' || s === 'CONFIRMED' ? 'Confirmed' : s === 'PUBLISHED' ? 'Published' : 'Accepted',
          icon: <CheckCircle size={12} />
        };
      case 'REJECTED':
      case 'CANCELLED':
      case 'WITHDRAWN':
      case 'ARCHIVED':
        return {
          className: 'badge-danger',
          label: s.charAt(0) + s.slice(1).toLowerCase(),
          icon: <XCircle size={12} />
        };
      case 'DRAFT':
        return {
          className: 'badge-info',
          label: 'Draft',
          icon: <AlertCircle size={12} />
        };
      default:
        return {
          className: 'badge-info',
          label: statusStr,
          icon: null
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
