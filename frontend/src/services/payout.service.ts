import api from './api';

export interface PayoutOverview {
  grossEarnings: number;
  totalPlatformFees: number;
  netPayoutBalance: number;
  inEscrowBalance: number;
  payouts: Array<{
    id: string;
    businessId: string;
    bookingId: string;
    grossAmount: number;
    platformFee: number;
    netPayout: number;
    status: 'HELD_IN_ESCROW' | 'PENDING_CLEARANCE' | 'PROCESSING' | 'PAID' | 'ON_HOLD';
    settlementDate?: string | null;
    utrNumber?: string | null;
    createdAt: string;
    booking: {
      id: string;
      guestName: string;
      startDate: string;
      endDate: string;
      status: string;
    };
    business: {
      id: string;
      name: string;
    };
  }>;
}

class PayoutService {
  async getMyFinances() {
    const response = await api.get('/payouts/my');
    return response.data;
  }

  async processPayout(id: string, utrNumber: string) {
    const response = await api.patch(`/payouts/admin/${id}/process`, { utrNumber });
    return response.data;
  }
}

export const payoutService = new PayoutService();
