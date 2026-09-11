import { prisma } from '../config/db.js';
import { Prisma } from '../generated/prisma/index.js';

export class BusinessRepository {
  async create(data: Prisma.BusinessUncheckedCreateInput) {
    return prisma.business.create({ data });
  }

  async findById(id: string) {
    return prisma.business.findUnique({ 
      where: { id }, 
      include: { 
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        destination: true,
        rooms: true,
      } 
    });
  }

  async findBySlug(slug: string) {
    return prisma.business.findUnique({ 
      where: { slug }, 
      include: { 
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        destination: true,
        rooms: true,
      } 
    });
  }

  async findByUserId(userId: string) {
    return prisma.business.findMany({ 
      where: { userId }, 
      orderBy: { createdAt: 'desc' } 
    });
  }

  async findAll(filters?: any) {
    return prisma.business.findMany({ 
      where: filters, 
      include: { 
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        destination: true,
        rooms: true,
      }, 
      orderBy: { createdAt: 'desc' } 
    });
  }

  async update(id: string, data: Prisma.BusinessUpdateInput) {
    return prisma.business.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.business.delete({ where: { id } });
  }
}

export const businessRepository = new BusinessRepository();
