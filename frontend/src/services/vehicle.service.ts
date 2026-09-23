import api from './api';

export interface BusinessVehicle {
  id: string;
  businessId: string;
  vehicleType: 'SAFARI_GYPSY_4X4' | 'INNOVA_TRANSFER' | 'CANTER_SAFARI';
  modelName: string;
  registrationNumber: string;
  driverName?: string | null;
  driverPhone?: string | null;
  maxPassengers: number;
  supportedSlots: Array<'MORNING_SAFARI' | 'AFTERNOON_SAFARI' | 'FULL_DAY_TRANSFER'>;
  basePricePerSlot: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

class VehicleService {
  async getVehiclesByBusiness(businessId: string) {
    const response = await api.get(`/vehicles/business/${businessId}`);
    return response.data;
  }

  async createVehicle(data: Partial<BusinessVehicle>) {
    const response = await api.post('/vehicles', data);
    return response.data;
  }

  async updateVehicle(id: string, data: Partial<BusinessVehicle>) {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  }

  async deleteVehicle(id: string) {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  }
}

export const vehicleService = new VehicleService();
