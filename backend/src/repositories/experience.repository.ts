import { prisma } from '../config/db.js';
import { Prisma, Experience, ExperienceStatus } from '../generated/prisma/index.js';

export class ExperienceRepository {
  async create(data: Prisma.ExperienceUncheckedCreateInput): Promise<Experience> {
    return prisma.experience.create({
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ExperienceUncheckedUpdateInput): Promise<Experience> {
    return prisma.experience.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findById(id: string): Promise<Experience | null> {
    return prisma.experience.findUnique({
      where: { id, deletedAt: null },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    status?: ExperienceStatus;
    search?: string;
    isFeatured?: boolean;
  }): Promise<{ data: Experience[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, status, search, isFeatured } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ExperienceWhereInput = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const [data, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // sort by newest first
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.experience.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(id: string): Promise<Experience> {
    return prisma.experience.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const experienceRepository = new ExperienceRepository();
