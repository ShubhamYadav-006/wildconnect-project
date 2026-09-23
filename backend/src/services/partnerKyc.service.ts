import path from 'path';
import fs from 'fs';
import { prisma } from '../config/db.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/AppError.js';
import { notificationService } from './notification.service.js';
import { NotificationType } from '../generated/prisma/index.js';

export class PartnerKycService {
  async getKycByUserId(userId: string) {
    return prisma.partnerKyc.findUnique({
      where: { userId },
    });
  }

  async submitKyc(userId: string, data: any) {
    const existing = await prisma.partnerKyc.findUnique({ where: { userId } });

    let kyc;
    if (existing) {
      kyc = await prisma.partnerKyc.update({
        where: { userId },
        data: {
          ...data,
          status: 'KYC_PENDING',
          rejectionReason: null,
        },
      });
    } else {
      kyc = await prisma.partnerKyc.create({
        data: {
          ...data,
          userId,
          status: 'KYC_PENDING',
        },
      });
    }

    // Notify User
    await notificationService.createNotification({
      userId,
      title: 'KYC Documents Submitted',
      message: 'Your partner KYC compliance documents have been submitted and are pending admin review.',
      type: NotificationType.KYC_SUBMITTED,
      referenceId: kyc.id,
    });

    return kyc;
  }

  // Admin Methods
  async getAllKycRecords(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return prisma.partnerKyc.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewKyc(id: string, status: 'KYC_VERIFIED' | 'KYC_REJECTED', rejectionReason?: string) {
    const kyc = await prisma.partnerKyc.findUnique({ where: { id } });
    if (!kyc) throw new NotFoundError('KYC record not found');

    const updateData: any = {
      status,
      rejectionReason: status === 'KYC_REJECTED' ? rejectionReason || 'Documents rejected.' : null,
      verifiedAt: status === 'KYC_VERIFIED' ? new Date() : null,
    };

    const updated = await prisma.partnerKyc.update({
      where: { id },
      data: updateData,
    });

    // Notify Partner
    const isVerified = status === 'KYC_VERIFIED';
    await notificationService.createNotification({
      userId: kyc.userId,
      title: isVerified ? 'KYC Verification Approved' : 'KYC Verification Rejected',
      message: isVerified
        ? 'Your KYC documents have been verified! You can now publish listings and accept bookings.'
        : `Your KYC verification was rejected. Reason: ${rejectionReason || 'Please review and resubmit documents.'}`,
      type: isVerified ? NotificationType.KYC_VERIFIED : NotificationType.KYC_REJECTED,
      referenceId: kyc.id,
    });

    return updated;
  }

  async verifyAndGetDocumentPath(filename: string, userId: string, role: string): Promise<string> {
    // 1. Path traversal sanitization: extract strict basename only
    const sanitizedFilename = path.basename(filename);
    if (!sanitizedFilename || sanitizedFilename !== filename) {
      throw new BadRequestError('Invalid document filename');
    }

    // 2. Locate the KYC document in DB
    const kycRecord = await prisma.partnerKyc.findFirst({
      where: {
        OR: [
          { idProofUrl: { contains: sanitizedFilename } },
          { businessProofUrl: { contains: sanitizedFilename } },
          { cancelledChequeUrl: { contains: sanitizedFilename } },
        ],
      },
    });

    if (!kycRecord) {
      throw new NotFoundError('KYC document not found');
    }

    // 3. Authorization check: must be owner or ADMIN
    if (role !== 'ADMIN' && kycRecord.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this document');
    }

    // 4. File existence verification
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const absoluteFilePath = path.resolve(uploadsDir, sanitizedFilename);

    // Prevent directory breakout
    if (!absoluteFilePath.startsWith(uploadsDir)) {
      throw new ForbiddenError('Access to the requested file path is restricted');
    }

    if (!fs.existsSync(absoluteFilePath)) {
      throw new NotFoundError('Document file does not exist on disk');
    }

    return absoluteFilePath;
  }
}

export const partnerKycService = new PartnerKycService();
