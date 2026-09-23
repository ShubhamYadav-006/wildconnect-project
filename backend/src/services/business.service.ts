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

  async createBusiness(userId: string, data: any, role?: string) {
    const slug = await this.generateUniqueSlug(data.name);
    const destinationId = data.destinationId ? data.destinationId : null;
    const targetUserId = (role === 'ADMIN' && data.userId) ? data.userId : userId;
    const status = (role === 'ADMIN' && data.status) ? data.status : (role === 'ADMIN' ? 'APPROVED' : 'DRAFT');
    const verifiedAt = status === 'APPROVED' ? new Date() : null;

    const payload = { ...data };
    delete payload.userId;
    delete payload.status;

    return businessRepository.create({
      ...payload,
      destinationId,
      slug,
      userId: targetUserId,
      status,
      verifiedAt,
    });
  }

  async updateBusiness(id: string, userId: string, data: any, role?: string) {
    const business = await businessRepository.findById(id);
    if (!business || business.deletedAt !== null) throw new NotFoundError('Business not found');
    if (role !== 'ADMIN' && business.userId !== userId) throw new UnauthorizedError('Not authorized to update this business');

    if (data.destinationId !== undefined) {
      data.destinationId = data.destinationId ? data.destinationId : null;
    }

    delete data.rejectionReason;

    // Admin direct update bypasses staging and updates live directly
    if (role === 'ADMIN') {
      if (data.name && data.name !== business.name) {
        data.slug = await this.generateUniqueSlug(data.name);
      }
      if (data.userId !== undefined) {
        if (!data.userId) {
          delete data.userId;
        }
      }
      return businessRepository.update(id, data);
    }

    // TIERED UPDATES: If listing is already APPROVED
    if (business.status === 'APPROVED') {
      const isCriticalChange = (data.name && data.name !== business.name) ||
        (data.type && data.type !== business.type) ||
        (data.destinationId !== undefined && data.destinationId !== business.destinationId);

      if (isCriticalChange) {
        // Stage critical edits in pendingUpdates without taking listing offline
        const stagedUpdates = {
          ...(business.pendingUpdates as object || {}),
          ...data,
          requestedAt: new Date().toISOString(),
        };

        const updated = await businessRepository.update(id, {
          pendingUpdates: stagedUpdates,
        });

        await notificationService.createNotification({
          userId,
          title: 'Critical Edits Staged for Review',
          message: `Your changes to core details of "${business.name}" have been staged for admin review. Your live listing remains active.`,
          type: 'BUSINESS_PENDING' as any,
          referenceId: business.id,
        });

        return updated;
      }

      // Minor edits (photos, description, amenities, contact) auto-apply immediately with zero downtime!
      delete data.status;
      return businessRepository.update(id, data);
    }

    // If listing is DRAFT or REJECTED
    if (data.name && data.name !== business.name) {
      data.slug = await this.generateUniqueSlug(data.name);
    }

    delete data.status;
    return businessRepository.update(id, data);
  }

  async submitForReview(id: string, userId: string) {
    const business = await businessRepository.findById(id);
    if (!business || business.deletedAt !== null) throw new NotFoundError('Business not found');
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

  async approvePendingUpdates(id: string) {
    const business = await businessRepository.findById(id);
    if (!business || !business.pendingUpdates) throw new NotFoundError('No pending updates found');

    const pending = business.pendingUpdates as any;
    delete pending.requestedAt;

    if (pending.name && pending.name !== business.name) {
      pending.slug = await this.generateUniqueSlug(pending.name);
    }

    const updated = await businessRepository.update(id, {
      ...pending,
      pendingUpdates: Prisma.DbNull,
      verifiedAt: new Date(),
    });

    await notificationService.createNotification({
      userId: business.userId,
      title: 'Critical Edits Approved',
      message: `Your staged changes for "${business.name}" have been approved and merged into your live listing.`,
      type: 'BUSINESS_APPROVED' as any,
      referenceId: business.id,
    });

    return updated;
  }

  async rejectPendingUpdates(id: string, rejectionReason?: string) {
    const business = await businessRepository.findById(id);
    if (!business || !business.pendingUpdates) throw new NotFoundError('No pending updates found');

    const updated = await businessRepository.update(id, {
      pendingUpdates: Prisma.DbNull,
    });

    await notificationService.createNotification({
      userId: business.userId,
      title: 'Staged Edits Rejected',
      message: `Your staged changes for "${business.name}" were rejected. Reason: ${rejectionReason || 'Does not meet listing standards.'}. Your live listing continues unchanged.`,
      type: 'BUSINESS_REJECTED' as any,
      referenceId: business.id,
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

  async deleteBusiness(id: string) {
    const business = await businessRepository.findById(id);
    if (!business) throw new NotFoundError('Business not found');

    await businessRepository.softDelete(id);
    return { message: 'Business deleted successfully' };
  }

  async getMyBusinesses(userId: string) {
    return businessRepository.findByUserId(userId);
  }

  async getMyBusinessById(id: string, userId: string) {
    const business = await businessRepository.findById(id);
    if (!business || business.deletedAt !== null) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new UnauthorizedError('Not authorized');
    return business;
  }

  async getPublicBusinesses(filters: any = {}) {
    return businessRepository.findAll({ ...filters, status: 'APPROVED', deletedAt: null });
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
    let business = await businessRepository.findBySlug(slug);
    if (!business) {
      const allApproved = await businessRepository.findAll({ status: 'APPROVED', deletedAt: null });
      business = allApproved.find((b: any) => 
        b.slug === slug || 
        b.id === slug ||
        b.slug.startsWith(slug) ||
        slug.startsWith(b.slug) ||
        b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
      ) || null;
    }
    if (!business || business.status !== 'APPROVED' || business.deletedAt !== null) {
      throw new NotFoundError('Business not found');
    }
    return business;
  }
}

export const businessService = new BusinessService();
