import { bookingRepository } from '../repositories/booking.repository.js';
import { tripRequestRepository } from '../repositories/triprequest.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/AppError.js';
import { BookingStatus, NotificationType } from '../generated/prisma/index.js';
import { notificationService } from './notification.service.js';

export class BookingService {
  async getAllBookings() {
    return bookingRepository.findAll();
  }

  async getMyBookings(userId: string) {
    return bookingRepository.findByUserId(userId);
  }

  async getBookingById(id: string, userId: string, role: string) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (role !== 'ADMIN' && booking.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this booking');
    }

    return booking;
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError('You can only cancel your own bookings');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new ConflictError(`Cannot cancel a booking with status: ${booking.status}`);
    }

    const cancelledBooking = await bookingRepository.updateStatus(id, 'CANCELLED');
    await tripRequestRepository.updateStatus(booking.tripRequestId, 'CANCELLED');
    return cancelledBooking;
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const updatedBooking = await bookingRepository.updateStatus(id, status);

    if (status === 'CANCELLED') {
      await tripRequestRepository.updateStatus(booking.tripRequestId, 'CANCELLED');
    }

    if (status === 'COMPLETED') {
      await notificationService.createNotification({
        userId: booking.userId,
        title: 'Booking Completed',
        message: 'Your booking has been marked as completed. We hope you had a great trip!',
        type: NotificationType.BOOKING_COMPLETED,
        referenceId: booking.id,
      });
    }

    return updatedBooking;
  }
}

export const bookingService = new BookingService();
