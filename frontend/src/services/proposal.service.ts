import api from './api';
import { TripRequest } from './triprequest.service';
import { Destination } from './destination.service';

export interface Proposal {
  id: string;
  tripRequestId: string;
  tripRequest?: TripRequest;
  userId?: string;
  destinationId: string;
  destination?: Destination;
  safariNotes?: string;
  resortIds: string[];
  numberOfNights: number;
  dayWiseItinerary: any;
  activities: string[];
  totalPrice: number;
  notes?: string;
  expiryDate: string;
  content?: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'CHANGE_REQUESTED' | 'PENDING' | 'REJECTED' | 'WITHDRAWN';
  changeRequest?: string;
  sentAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const proposalService = {
  getById: async (id: string) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  getMyProposals: async () => {
    const response = await api.get('/my/proposals');
    return response.data;
  },

  accept: async (id: string) => {
    const response = await api.patch(`/proposals/${id}/accept`);
    return response.data;
  },

  reject: async (id: string) => {
    const response = await api.patch(`/proposals/${id}/reject`);
    return response.data;
  },

  // Admin Methods
  create: async (data: any) => {
    const response = await api.post('/proposals', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/proposals');
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/proposals/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/proposals/${id}`);
    return response.data;
  },

  send: async (id: string) => {
    const response = await api.patch(`/proposals/${id}/send`);
    return response.data;
  },

  getByTripRequest: async (tripRequestId: string) => {
    const response = await api.get(`/proposals/trip-request/${tripRequestId}`);
    return response.data;
  },

  requestChanges: async (id: string, changeRequest: string) => {
    const response = await api.patch(`/proposals/${id}/change-request`, { changeRequest });
    return response.data;
  }
};

export default proposalService;
