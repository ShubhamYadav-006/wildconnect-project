import { prisma } from '../config/db.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';
import { notificationService } from './notification.service.js';
import { NotificationType } from '../generated/prisma/index.js';

export class PayoutService {
  // Get financial overview for a partner
  async getPartnerFinances(userId: string) {
    const businesses = await prisma.business.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, name: true },
    });

    const businessIds = businesses.map(b => b.id);

    const payouts = await prisma.payoutTransaction.findMany({
      where: { businessId: { in: businessIds } },
      include: {
        booking: {
          select: {
            id: true,
            guestName: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
        business: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute metrics
    let grossEarnings = 0;
    let totalPlatformFees = 0;
    let netPayoutBalance = 0;
    let inEscrowBalance = 0;

    for (const p of payouts) {
      grossEarnings += p.grossAmount;
      totalPlatformFees += p.platformFee;
      if (p.status === 'PAID') {
        netPayoutBalance += p.netPayout;
      } else if (p.status === 'HELD_IN_ESCROW' || p.status === 'PENDING_CLEARANCE') {
        inEscrowBalance += p.netPayout;
      }
    }

    return {
      grossEarnings,
      totalPlatformFees,
      netPayoutBalance,
      inEscrowBalance,
      payouts,
    };
  }

  // Admin: Disburse / Clear Payout
  async processPayout(payoutId: string, utrNumber: string) {
    const payout = await prisma.payoutTransaction.findUnique({
      where: { id: payoutId },
      include: { business: true },
    });

    if (!payout) throw new NotFoundError('Payout transaction not found');

    const updated = await prisma.payoutTransaction.update({
      where: { id: payoutId },
      data: {
        status: 'PAID',
        settlementDate: new Date(),
        utrNumber,
      },
    });

    await prisma.businessBooking.update({
      where: { id: payout.bookingId },
      data: { payoutStatus: 'PAID' },
    });

    // Notify Partner
    await notificationService.createNotification({
      userId: payout.business.userId,
      title: 'Payout Cleared & Transferred',
      message: `Your payout of ₹${payout.netPayout.toLocaleString('en-IN')} for booking #${payout.bookingId.slice(0, 8)} has been disbursed. UTR: ${utrNumber}`,
      type: NotificationType.PAYOUT_CLEARED,
      referenceId: payout.id,
    });

    return updated;
  }
}

export const payoutService = new PayoutService();
