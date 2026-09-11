import { prisma } from '../config/db.js';
import { Prisma, TripRequest, TripStatus } from '../generated/prisma/index.js';

export class TripRequestRepository {
  async findAll(status?: any) {
    return prisma.tripRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        destination: { select: { name: true, slug: true } },
        user: { select: { firstName: true, lastName: true, email: true } }
      }
    });
  }

  async findByUserId(userId: string) {
    return prisma.tripRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        destination: { select: { name: true, slug: true } },
        proposals: { select: { id: true, status: true } }
      }
    });
  }

  async findById(id: string) {
    return prisma.tripRequest.findUnique({
      where: { id },
      include: {
        destination: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        proposals: { select: { id: true, status: true } }
      }
    });
  }

  async create(data: Prisma.TripRequestUncheckedCreateInput): Promise<TripRequest> {
    return prisma.tripRequest.create({
      data,
    });
  }

  async updateStatus(id: string, status: TripStatus): Promise<TripRequest> {
    return prisma.tripRequest.update({
      where: { id },
      data: { status },
    });
  }
}

export const tripRequestRepository = new TripRequestRepository();
