import api from './api';

export interface PartnerKyc {
  id: string;
  userId: string;
  businessPan: string;
  gstin?: string | null;
  idProofUrl: string;
  businessProofUrl: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  cancelledChequeUrl?: string | null;
  status: 'KYC_UNSUBMITTED' | 'KYC_PENDING' | 'KYC_VERIFIED' | 'KYC_REJECTED';
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

class KycService {
  async getMyKyc() {
    const response = await api.get('/kyc/my');
    return response.data;
  }

  async submitKyc(data: {
    businessPan: string;
    gstin?: string;
    idProofUrl: string;
    businessProofUrl: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankIfsc: string;
    bankName: string;
    cancelledChequeUrl?: string;
  }) {
    const response = await api.post('/kyc/submit', data);
    return response.data;
  }

  // Admin
  async getAllKyc(status?: string) {
    const params = status ? { status } : {};
    const response = await api.get('/kyc/admin/all', { params });
    return response.data;
  }

  async reviewKyc(id: string, status: 'KYC_VERIFIED' | 'KYC_REJECTED', rejectionReason?: string) {
    const response = await api.patch(`/kyc/admin/${id}/review`, { status, rejectionReason });
    return response.data;
  }
}

export const kycService = new KycService();
