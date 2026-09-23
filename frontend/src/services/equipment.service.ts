import api from './api';

export interface BusinessEquipment {
  id: string;
  businessId: string;
  equipmentType: 'CAMERA_BODY' | 'TELEPHOTO_LENS' | 'ACCESSORY_KIT';
  brandAndModel: string;
  serialNumber?: string | null;
  dailyRate: number;
  securityDeposit: number;
  condition: string;
  kitIncludes: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

class EquipmentService {
  async getEquipmentByBusiness(businessId: string) {
    const response = await api.get(`/equipment/business/${businessId}`);
    return response.data;
  }

  async createEquipment(data: Partial<BusinessEquipment>) {
    const response = await api.post('/equipment', data);
    return response.data;
  }

  async updateEquipment(id: string, data: Partial<BusinessEquipment>) {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data;
  }

  async deleteEquipment(id: string) {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  }
}

export const equipmentService = new EquipmentService();
