import { resortRepository } from '../repositories/resort.repository.js';
import { destinationRepository } from '../repositories/destination.repository.js';
import { NotFoundError } from '../utils/AppError.js';
import { Prisma } from '../generated/prisma/index.js';

export class ResortService {
  async getAllResorts() {
    return resortRepository.findAll();
  }

  async getResortById(id: string) {
    const resort = await resortRepository.findById(id);
    if (!resort) {
      throw new NotFoundError('Resort not found');
    }
    return resort;
  }

  async getResortsByDestinationId(destinationId: string) {
    // Verify destination exists
    const destination = await destinationRepository.findById(destinationId);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }

    return resortRepository.findByDestinationId(destinationId);
  }

  async createResort(data: any) {
    // Verify destination exists
    const destination = await destinationRepository.findById(data.destinationId);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }

    const createData: Prisma.ResortUncheckedCreateInput = {
      name: data.name,
      description: data.description,
      address: data.address,
      destinationId: data.destinationId,
      starRating: data.starRating,
      amenities: data.amenities || [],
      coverImage: data.coverImage,
      images: data.images || [],
    };

    return resortRepository.create(createData);
  }

  async updateResort(id: string, data: any) {
    const resort = await resortRepository.findById(id);
    if (!resort) {
      throw new NotFoundError('Resort not found');
    }

    const updateData: Prisma.ResortUpdateInput = { ...data };

    return resortRepository.update(id, updateData);
  }

  async deleteResort(id: string) {
    const resort = await resortRepository.findById(id);
    if (!resort) {
      throw new NotFoundError('Resort not found');
    }

    await resortRepository.softDelete(id);
    return { message: 'Resort deleted successfully' };
  }
}

export const resortService = new ResortService();
