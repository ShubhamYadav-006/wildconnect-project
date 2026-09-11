import { prisma } from '../config/db.js';
import { Prisma, Booking, BookingStatus } from '../generated/prisma/index.js';

export class BookingRepository {
  async findAll() {
    return prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        destination: { select: { name: true } },
        tripRequest: true,
        proposal: true,
      }
    });
  }

  async findByUserId(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        destination: { select: { name: true } },
        proposal: true,
      }
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        destination: true,
        tripRequest: true,
        proposal: true,
      }
    });
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    return prisma.booking.update({
      where: { id },
      data: { status }
    });
  }
}

export const bookingRepository = new BookingRepository();
