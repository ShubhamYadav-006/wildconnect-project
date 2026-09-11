import { tripRequestRepository } from '../repositories/triprequest.repository.js';
import { destinationRepository } from '../repositories/destination.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/AppError.js';
import { Prisma, TripStatus } from '../generated/prisma/index.js';

export class TripRequestService {
  async createRequest(userId: string, data: any) {
    const destination = await destinationRepository.findById(data.destinationId);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }

    const createData: Prisma.TripRequestUncheckedCreateInput = {
      userId,
      destinationId: data.destinationId,
      travelerCount: data.travelerCount,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      budget: data.budget,
      preferences: data.preferences,
      notes: data.notes,
      status: 'PENDING',
    };

    return tripRequestRepository.create(createData);
  }

  async getMyRequests(userId: string) {
    return tripRequestRepository.findByUserId(userId);
  }

  async getRequestById(id: string, userId: string, role: string) {
    const request = await tripRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError('Trip request not found');
    }

    if (role !== 'ADMIN' && request.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this request');
    }

    return request;
  }

  async getAllRequests(status?: string) {
    let validStatus: TripStatus | undefined = undefined;
    if (status) {
      if (Object.values(TripStatus).includes(status as TripStatus)) {
        validStatus = status as TripStatus;
      } else {
        throw new ConflictError('Invalid status filter');
      }
    }
    return tripRequestRepository.findAll(validStatus);
  }

  async cancelRequest(id: string, userId: string) {
    const request = await tripRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError('Trip request not found');
    }

    if (request.userId !== userId) {
      throw new ForbiddenError('You can only cancel your own requests');
    }

    if (request.status !== 'PENDING') {
      throw new ConflictError('Only pending requests can be cancelled');
    }

    return tripRequestRepository.updateStatus(id, 'CANCELLED');
  }

  async updateStatus(id: string, status: TripStatus) {
    const request = await tripRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError('Trip request not found');
    }

    if (request.status === 'CANCELLED') {
      throw new ConflictError('Cannot update a cancelled request');
    }

    return tripRequestRepository.updateStatus(id, status);
  }
}

export const tripRequestService = new TripRequestService();
