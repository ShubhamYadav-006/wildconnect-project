import api from './api';
import { User } from './auth.service';
import { Destination } from './destination.service';
import { Resort } from './resort.service';

export interface TripRequest {
  id: string;
  userId: string;
  user?: User;
  destinationId: string;
  destination?: Destination;
  resortId?: string;
  resort?: Resort;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  travelerCount: number;
  budget?: string;
  specialRequirements?: string;
  status: 'PENDING' | 'REVIEWING' | 'PROPOSAL_READY' | 'ACCEPTED' | 'REJECTED' | 'BOOKED' | 'CANCELLED';
  createdAt: string;
}

export const tripRequestService = {
  create: async (data: any) => {
    const response = await api.post('/trip-requests', data);
    return response.data;
  },
  
  getMyRequests: async () => {
    const response = await api.get('/trip-requests/my');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/admin/trip-requests');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/trip-requests/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/trip-requests/${id}/status`, { status });
    return response.data;
  }
};
