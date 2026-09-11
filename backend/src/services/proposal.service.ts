import { proposalRepository } from '../repositories/proposal.repository.js';
import { tripRequestRepository } from '../repositories/triprequest.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError, ConflictError, ForbiddenError, BadRequestError } from '../utils/AppError.js';
import { Prisma, NotificationType } from '../generated/prisma/index.js';
import { notificationService } from './notification.service.js';

export class ProposalService {
  async getAllProposals() {
    return proposalRepository.findAll();
  }

  async getProposalById(id: string, userId: string, role: string) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }

    if (role !== 'ADMIN' && proposal.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this proposal');
    }

    return proposal;
  }

  async getMyProposals(userId: string) {
    return proposalRepository.findByUserId(userId);
  }

  async getProposalsByTripRequest(tripRequestId: string, userId: string, role: string) {
    const tripRequest = await tripRequestRepository.findById(tripRequestId);
    if (!tripRequest) {
      throw new NotFoundError('Trip request not found');
    }

    if (role !== 'ADMIN' && tripRequest.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view proposals for this trip request');
    }

    return proposalRepository.findByTripRequestId(tripRequestId);
  }

  async createProposal(data: { tripRequestId: string; content: string }) {
    // Ensure Trip Request exists and is not CANCELLED or BOOKED
    const tripRequest = await tripRequestRepository.findById(data.tripRequestId);
    if (!tripRequest) {
      throw new NotFoundError('Trip request not found');
    }
    if (tripRequest.status === 'CANCELLED' || tripRequest.status === 'BOOKED') {
      throw new ConflictError(`Cannot create a proposal for a trip request with status: ${tripRequest.status}`);
    }

    const createData: Prisma.ProposalUncheckedCreateInput = {
      tripRequestId: data.tripRequestId,
      userId: tripRequest.userId,
      content: data.content,
      status: 'DRAFT',
    };

    return proposalRepository.create(createData);
  }

  async updateProposal(id: string, data: { content?: string }) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    if (proposal.status !== 'DRAFT' && proposal.status !== 'CHANGE_REQUESTED') {
      throw new ConflictError('Only proposals in DRAFT or CHANGE_REQUESTED status can be updated');
    }

    const updateData: Prisma.ProposalUpdateInput = {
      content: data.content,
    };

    return proposalRepository.update(id, updateData);
  }

  async deleteProposal(id: string) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    if (proposal.status === 'ACCEPTED') {
      throw new ConflictError('Cannot delete an accepted proposal');
    }

    await proposalRepository.delete(id);
    return { message: 'Proposal deleted successfully' };
  }

  async sendProposal(id: string) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    if (proposal.status !== 'DRAFT' && proposal.status !== 'CHANGE_REQUESTED') {
      throw new ConflictError('Only proposals in DRAFT or CHANGE_REQUESTED status can be sent');
    }

    const updatedProposal = await proposalRepository.update(id, {
      status: 'SENT',
      sentAt: new Date(),
    });

    // Update Trip Request status to PROPOSAL_READY
    await tripRequestRepository.updateStatus(proposal.tripRequestId, 'PROPOSAL_READY');

    // Notify user
    await notificationService.createNotification({
      userId: proposal.userId,
      title: 'New Proposal Ready',
      message: 'A new travel proposal has been created for your trip request.',
      type: NotificationType.PROPOSAL_CREATED,
      referenceId: proposal.id,
    });

    return updatedProposal;
  }

  async acceptProposal(id: string, userId: string) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    
    if (proposal.userId !== userId) {
      throw new ForbiddenError('You can only accept proposals for your own trip requests');
    }

    if (proposal.status !== 'SENT') {
      throw new ConflictError('Only sent proposals can be accepted');
    }

    const acceptedProposal = await proposalRepository.acceptProposalTransaction(proposal.id, proposal.tripRequestId);

    // Notify user about proposal acceptance and booking confirmation
    await notificationService.createNotification({
      userId: proposal.userId,
      title: 'Proposal Accepted',
      message: 'You have successfully accepted the proposal.',
      type: NotificationType.PROPOSAL_ACCEPTED,
      referenceId: acceptedProposal.id,
    });

    await notificationService.createNotification({
      userId: proposal.userId,
      title: 'Booking Confirmed',
      message: 'Your booking has been confirmed based on the accepted proposal.',
      type: NotificationType.BOOKING_CONFIRMED,
      referenceId: acceptedProposal.id,
    });

    return acceptedProposal;
  }

  async rejectProposal(id: string, userId: string) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    
    if (proposal.userId !== userId) {
      throw new ForbiddenError('You can only reject proposals for your own trip requests');
    }

    if (proposal.status !== 'SENT') {
      throw new ConflictError('Only sent proposals can be rejected');
    }

    const rejectedProposal = await proposalRepository.update(id, { status: 'REJECTED' });

    // Notify user
    await notificationService.createNotification({
      userId: proposal.userId,
      title: 'Proposal Rejected',
      message: 'You have rejected the proposal.',
      type: NotificationType.PROPOSAL_REJECTED,
      referenceId: rejectedProposal.id,
    });

    return rejectedProposal;
  }

  async requestChanges(id: string, userId: string, changeRequestText: string) {
    const proposal = await proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    
    if (proposal.userId !== userId) {
      throw new ForbiddenError('You can only request changes for your own proposals');
    }

    if (proposal.status !== 'SENT') {
      throw new ConflictError('Only sent proposals can have change requests');
    }

    const updatedProposal = await proposalRepository.update(id, {
      status: 'CHANGE_REQUESTED',
      changeRequest: changeRequestText,
    });

    // Notify user
    await notificationService.createNotification({
      userId: proposal.userId,
      title: 'Change Request Submitted',
      message: 'Your request for changes has been submitted successfully.',
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      referenceId: proposal.id,
    });

    // Notify Admins
    const admins = await userRepository.findAdmins();
    for (const admin of admins) {
      await notificationService.createNotification({
        userId: admin.id,
        title: 'Proposal Change Requested',
        message: `A change request has been submitted for a proposal.`,
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        referenceId: proposal.id,
      });
    }

    return updatedProposal;
  }
}

export const proposalService = new ProposalService();

