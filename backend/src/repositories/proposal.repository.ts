import { prisma } from '../config/db.js';
import { Prisma, Proposal, ProposalStatus } from '../generated/prisma/index.js';

export class ProposalRepository {
  async findAll() {
    return prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tripRequest: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        destination: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.proposal.findUnique({
      where: { id },
      include: {
        tripRequest: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        destination: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        destination: true,
        tripRequest: true,
      },
    });
  }

  async findByTripRequestId(tripRequestId: string) {
    return prisma.proposal.findMany({
      where: { tripRequestId },
      orderBy: { createdAt: 'desc' },
      include: {
        tripRequest: true,
        destination: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async create(data: Prisma.ProposalUncheckedCreateInput): Promise<Proposal> {
    return prisma.proposal.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProposalUpdateInput): Promise<Proposal> {
    return prisma.proposal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Proposal> {
    return prisma.proposal.delete({
      where: { id },
    });
  }

  async acceptProposalTransaction(proposalId: string, tripRequestId: string): Promise<Proposal> {
    return prisma.$transaction(async (tx: any) => {
      // 1. Fetch TripRequest
      const tripReq = await tx.tripRequest.findUnique({ where: { id: tripRequestId } });
      if (!tripReq) throw new Error('Trip request not found in transaction');

      // 2. Accept the specified proposal
      const accepted = await tx.proposal.update({
        where: { id: proposalId },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });

      // 3. Reject all other pending/sent/change requested proposals for the same Trip Request
      await tx.proposal.updateMany({
        where: {
          tripRequestId: tripRequestId,
          id: { not: proposalId },
          status: { in: ['PENDING', 'DRAFT', 'SENT', 'CHANGE_REQUESTED'] as ProposalStatus[] },
        },
        data: { status: 'REJECTED' },
      });

      // 4. Update the Trip Request status to BOOKED
      await tx.tripRequest.update({
        where: { id: tripRequestId },
        data: { status: 'BOOKED' },
      });

      // 5. Create Booking
      await tx.booking.create({
        data: {
          userId: tripReq.userId,
          tripRequestId: tripReq.id,
          proposalId: accepted.id,
          destinationId: accepted.destinationId ?? tripReq.destinationId,
          travelerCount: tripReq.travelerCount,
          startDate: tripReq.startDate,
          endDate: tripReq.endDate,
          totalAmount: accepted.totalPrice ?? 0.0,
          safariNotes: accepted.safariNotes,
          resortIds: accepted.resortIds,
          status: 'CONFIRMED',
        }
      });

      return accepted;
    });
  }
}

export const proposalRepository = new ProposalRepository();

