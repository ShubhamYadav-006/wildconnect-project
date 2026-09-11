import api from './api';
import { User } from './auth.service';
import { TripRequest } from './triprequest.service';
import { Proposal } from './proposal.service';
import { Destination } from './destination.service';

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  tripRequestId: string;
  tripRequest?: TripRequest;
  proposalId: string;
  proposal?: Proposal;
  destinationId: string;
  destination?: Destination;
  travelerCount: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  safariNotes?: string;
  resortIds: string[];
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export const bookingService = {
  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Admin Methods
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  updateStatus: async (id: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  }
};

export default bookingService;
