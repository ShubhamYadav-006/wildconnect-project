import api from './api';

export interface BusinessInventoryBlock {
  id: string;
  businessId: string;
  roomId?: string | null;
  vehicleId?: string | null;
  equipmentId?: string | null;
  startDate: string;
  endDate: string;
  slot?: 'MORNING_SAFARI' | 'AFTERNOON_SAFARI' | 'FULL_DAY_TRANSFER' | null;
  unitsBlocked: number;
  reason: 'PROPERTY_MAINTENANCE' | 'WALK_IN_OFFLINE_BOOKING' | 'MONSOON_CLOSURE' | 'PERSONAL_USE';
  notes?: string | null;
  createdAt: string;
  room?: { id: string; name: string };
  vehicle?: { id: string; modelName: string; registrationNumber: string };
  equipment?: { id: string; brandAndModel: string };
}

class CalendarBlockService {
  async getBlocksByBusiness(businessId: string, startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get(`/calendar-blocks/business/${businessId}`, { params });
    return response.data;
  }

  async createBlock(data: Partial<BusinessInventoryBlock>) {
    const response = await api.post('/calendar-blocks', data);
    return response.data;
  }

  async deleteBlock(id: string) {
    const response = await api.delete(`/calendar-blocks/${id}`);
    return response.data;
  }
}

export const calendarBlockService = new CalendarBlockService();
