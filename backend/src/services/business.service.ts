import { businessRepository } from '../repositories/business.repository.js';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/AppError.js';
import { Prisma, ApprovalStatus } from '../generated/prisma/index.js';
import { notificationService } from './notification.service.js';
export class BusinessService {
  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug || 'business';
    let counter = 1;
    
    while (await businessRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async createBusiness(userId: string, data: any) {
    const slug = await this.generateUniqueSlug(data.name);
    const destinationId = data.destinationId ? data.destinationId : null;
    return businessRepository.create({
      ...data,
      destinationId,
      slug,
      userId,
      status: 'DRAFT', // Default to draft
    });
  }

  async updateBusiness(id: string, userId: string, data: any) {
    const business = await businessRepository.findById(id);
    if (!business) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new UnauthorizedError('Not authorized to update this business');

    if (data.name && data.name !== business.name) {
      data.slug = await this.generateUniqueSlug(data.name);
    }

    if (data.destinationId !== undefined) {
      data.destinationId = data.destinationId ? data.destinationId : null;
    }

    // Trigger re-verification if editing an approved business
    if (business.status === 'APPROVED') {
      data.status = 'PENDING_REVIEW';
      await notificationService.createNotification({
        userId,
        title: 'Business Sent for Re-verification',
        message: `Your recent edits to "${business.name}" require re-verification by an admin. It has been sent for review.`,
        type: 'BUSINESS_PENDING' as any,
        referenceId: business.id
      });
    } else {
      // Cannot update status directly via this method unless it's dropping to pending
      delete data.status;
    }
    
    delete data.rejectionReason;

    return businessRepository.update(id, data);
  }

  async submitForReview(id: string, userId: string) {
    const business = await businessRepository.findById(id);
    if (!business) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new UnauthorizedError('Not authorized');

    const updated = await businessRepository.update(id, { status: 'PENDING_REVIEW' });
    
    await notificationService.createNotification({
      userId,
      title: 'Business Submitted for Review',
      message: `Your business "${business.name}" has been successfully submitted and is pending admin review.`,
      type: 'BUSINESS_PENDING' as any,
      referenceId: business.id
    });

    return updated;
  }

  async updateBusinessStatus(id: string, status: ApprovalStatus, rejectionReason?: string) {
    const business = await businessRepository.findById(id);
    if (!business) throw new NotFoundError('Business not found');

    const updateData: any = { status, rejectionReason: rejectionReason || null };
    if (status === 'APPROVED') {
      updateData.verifiedAt = new Date();
    }

    const updated = await businessRepository.update(id, updateData);

    // Notify Partner
    let title = '';
    let message = '';
    let type: any = 'SYSTEM_ANNOUNCEMENT';

    switch (status) {
      case 'APPROVED':
        title = business.status === 'SUSPENDED' ? 'Business Unsuspended' : 'Business Approved';
        message = business.status === 'SUSPENDED' 
          ? `Your business "${business.name}" has been unsuspended and is live again.` 
          : `Congratulations! Your business "${business.name}" has been approved and is now live.`;
        type = 'BUSINESS_APPROVED';
        break;
      case 'REJECTED':
        title = 'Business Rejected';
        message = `Your business "${business.name}" was rejected. Reason: ${rejectionReason || 'No reason provided.'}`;
        type = 'BUSINESS_REJECTED';
        break;
      case 'SUSPENDED':
        title = 'Business Suspended';
        message = `Your business "${business.name}" has been suspended by an admin and is no longer public.`;
        type = 'BUSINESS_SUSPENDED';
        break;
    }

    if (title && type) {
      await notificationService.createNotification({
        userId: business.userId,
        title,
        message,
        type,
        referenceId: business.id
      });
    }

    return updated;
  }

  async getMyBusinesses(userId: string) {
    return businessRepository.findByUserId(userId);
  }

  async getMyBusinessById(id: string, userId: string) {
    const business = await businessRepository.findById(id);
    if (!business) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new UnauthorizedError('Not authorized');
    return business;
  }

  async getPublicBusinesses(filters: any = {}) {
    return businessRepository.findAll({ ...filters, status: 'APPROVED' });
  }

  async getAdminBusinesses(filters: any = {}) {
    return businessRepository.findAll(filters);
  }

  async getAdminBusinessById(id: string) {
    const business = await businessRepository.findById(id);
    if (!business) throw new NotFoundError('Business not found');
    return business;
  }

  async getPublicBusinessBySlug(slug: string) {
    const business = await businessRepository.findBySlug(slug);
    if (!business || business.status !== 'APPROVED') {
      throw new NotFoundError('Business not found');
    }
    return business;
  }
}

export const businessService = new BusinessService();
