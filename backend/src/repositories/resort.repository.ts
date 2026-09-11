import { prisma } from '../config/db.js';
import { Prisma, Resort, Business } from '../generated/prisma/index.js';

// We map Business to Resort for legacy compatibility
function mapBusinessToResort(b: any): Resort & { destination?: any; slug?: string; pricePerNight?: number; rooms?: any[] } {
  const minRoomPrice = b.rooms && b.rooms.length > 0 
    ? Math.min(...b.rooms.map((r: any) => r.basePrice || 0)) 
    : undefined;

  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    pricePerNight: minRoomPrice ?? b.metadata?.pricePerNight ?? 0,
    description: b.description,
    address: b.address || '',
    starRating: b.starRating,
    amenities: b.amenities,
    coverImage: b.coverImage,
    images: b.images,
    destinationId: b.destinationId || '', // cast to string
    deletedAt: b.deletedAt,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    destination: b.destination,
    rooms: b.rooms,
  };
}

export class ResortRepository {
  async findAll() {
    const businesses = await prisma.business.findMany({
      where: {
        type: 'RESORT',
        status: 'APPROVED',
        deletedAt: null,
        destination: { deletedAt: null },
      },
      orderBy: { name: 'asc' },
      include: { destination: true, rooms: true },
    });
    return businesses.map(mapBusinessToResort);
  }

  async findById(idOrSlug: string) {
    const b = await prisma.business.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ],
        type: 'RESORT',
        deletedAt: null,
        destination: { deletedAt: null },
      },
      include: { destination: true, rooms: true },
    });
    return b ? mapBusinessToResort(b) : null;
  }

  async findByDestinationId(destinationId: string) {
    const businesses = await prisma.business.findMany({
      where: {
        destinationId,
        type: 'RESORT',
        status: 'APPROVED',
        deletedAt: null,
        destination: { deletedAt: null },
      },
      orderBy: { name: 'asc' },
      include: { destination: true, rooms: true },
    });
    return businesses.map(mapBusinessToResort);
  }

  async create(data: Prisma.ResortUncheckedCreateInput) {
    // Admins usually create legacy resorts. Assign to a generic admin user for now, or just any admin.
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) throw new Error('No admin user found to associate legacy resort creation.');
    
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    const b = await prisma.business.create({
      data: {
        name: data.name,
        slug,
        type: 'RESORT',
        description: data.description,
        address: data.address,
        starRating: data.starRating,
        amenities: data.amenities || [],
        coverImage: data.coverImage,
        images: data.images || [],
        destinationId: data.destinationId,
        userId: admin.id,
        status: 'APPROVED',
      },
    });
    return mapBusinessToResort(b) as Resort;
  }

  async update(id: string, data: any) {
    // Only update fields that exist on Business that came from legacy Resort
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.address) updateData.address = data.address;
    if (data.starRating !== undefined) updateData.starRating = data.starRating;
    if (data.amenities) updateData.amenities = data.amenities;
    if (data.coverImage) updateData.coverImage = data.coverImage;
    if (data.images) updateData.images = data.images;
    if (data.destinationId) updateData.destinationId = data.destinationId;

    const b = await prisma.business.update({
      where: { id },
      data: updateData,
    });
    return mapBusinessToResort(b) as Resort;
  }

  async softDelete(id: string) {
    const b = await prisma.business.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return mapBusinessToResort(b) as Resort;
  }
}

export const resortRepository = new ResortRepository();
