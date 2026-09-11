import { prisma } from '../config/db.js';
import { Prisma, Destination } from '../generated/prisma/index.js';

export class DestinationRepository {
  async findAll() {
    return prisma.destination.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.destination.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findBySlug(slug: string): Promise<Destination | null> {
    return prisma.destination.findFirst({
      where: { slug, deletedAt: null },
    });
  }

  async findByName(name: string): Promise<Destination | null> {
    return prisma.destination.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async findByNameAny(name: string): Promise<Destination | null> {
    return prisma.destination.findFirst({
      where: { name },
    });
  }

  async findBySlugAny(slug: string): Promise<Destination | null> {
    return prisma.destination.findFirst({
      where: { slug },
    });
  }

  async create(data: Prisma.DestinationCreateInput): Promise<Destination> {
    return prisma.destination.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DestinationUpdateInput): Promise<Destination> {
    return prisma.destination.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Destination> {
    return prisma.destination.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const destinationRepository = new DestinationRepository();

