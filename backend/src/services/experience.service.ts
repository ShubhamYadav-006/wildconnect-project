import { ExperienceStatus } from '../generated/prisma/index.js';
import { experienceRepository } from '../repositories/experience.repository.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';

export class ExperienceService {
  async createExperience(data: any, authorId: string) {
    return experienceRepository.create({
      ...data,
      authorId,
      status: ExperienceStatus.DRAFT,
    });
  }

  async updateExperience(id: string, data: any) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Experience not found');
    }

    return experienceRepository.update(id, data);
  }

  async publishExperience(id: string) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Experience not found');
    }

    if (existing.status === ExperienceStatus.PUBLISHED) {
      throw new BadRequestError('Experience is already published');
    }

    return experienceRepository.update(id, { status: ExperienceStatus.PUBLISHED });
  }

  async archiveExperience(id: string) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Experience not found');
    }

    if (existing.status === ExperienceStatus.ARCHIVED) {
      throw new BadRequestError('Experience is already archived');
    }

    return experienceRepository.update(id, { status: ExperienceStatus.ARCHIVED });
  }

  async featureExperience(id: string, isFeatured: boolean) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Experience not found');
    }

    return experienceRepository.update(id, { isFeatured });
  }

  async deleteExperience(id: string) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Experience not found');
    }

    await experienceRepository.softDelete(id);
  }

  async getExperiences(options: {
    page?: number;
    limit?: number;
    status?: ExperienceStatus;
    search?: string;
    isAdmin?: boolean;
  }) {
    let queryOptions = { ...options };

    // If not admin, force status to PUBLISHED
    if (!options.isAdmin) {
      queryOptions.status = ExperienceStatus.PUBLISHED;
    }

    return experienceRepository.findAll(queryOptions);
  }

  async getFeaturedExperiences() {
    return experienceRepository.findAll({
      status: ExperienceStatus.PUBLISHED,
      isFeatured: true,
      limit: 5, // Return top 5 featured experiences
    });
  }

  async getExperienceById(id: string, isAdmin: boolean = false) {
    const experience = await experienceRepository.findById(id);

    if (!experience) {
      throw new NotFoundError('Experience not found');
    }

    if (!isAdmin && experience.status !== ExperienceStatus.PUBLISHED) {
      throw new NotFoundError('Experience not found'); // Do not expose draft/archived
    }

    return experience;
  }
}

export const experienceService = new ExperienceService();
