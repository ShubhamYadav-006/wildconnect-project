import { destinationRepository } from '../repositories/destination.repository.js';
import { ConflictError, NotFoundError } from '../utils/AppError.js';
import { Prisma } from '../generated/prisma/index.js';

const generateSlug = (name: string): string => {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return clean || `destination-${Date.now()}`;
};

export class DestinationService {
  async getAllDestinations() {
    return destinationRepository.findAll();
  }

  async getDestinationBySlug(slug: string) {
    const destination = await destinationRepository.findBySlug(slug);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }
    return destination;
  }

  async getDestinationById(id: string) {
    const destination = await destinationRepository.findById(id);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }
    return destination;
  }

  async createDestination(data: any) {
    const trimmedName = data.name.trim();

    // Check if name already exists anywhere (including soft-deleted records)
    const existing = await destinationRepository.findByNameAny(trimmedName);
    if (existing) {
      if (existing.deletedAt) {
        throw new ConflictError('A destination with this name exists in deleted records.');
      }
      throw new ConflictError('A destination with this name already exists');
    }

    const slug = generateSlug(trimmedName);
    
    // Check if generated slug exists anywhere
    const existingSlug = await destinationRepository.findBySlugAny(slug);
    if (existingSlug) {
      if (existingSlug.deletedAt) {
        throw new ConflictError('A destination with a similar name exists in deleted records (slug conflict).');
      }
      throw new ConflictError('A destination with a similar name already exists (slug conflict)');
    }

    const createData: Prisma.DestinationCreateInput = {
      name: trimmedName,
      slug,
      description: data.description.trim(),
      state: data.state.trim(),
      country: data.country ? data.country.trim() : 'India',
      bestSeason: data.bestSeason ? data.bestSeason.trim() : undefined,
      coverImage: data.coverImage ? data.coverImage.trim() : undefined,
      establishedYear: data.establishedYear != null && data.establishedYear !== '' ? Number(data.establishedYear) : undefined,
      totalArea: data.totalArea != null && data.totalArea !== '' ? Number(data.totalArea) : undefined,
      coreArea: data.coreArea != null && data.coreArea !== '' ? Number(data.coreArea) : undefined,
      coreGates: data.coreGates != null && data.coreGates !== '' ? Number(data.coreGates) : undefined,
      bufferArea: data.bufferArea != null && data.bufferArea !== '' ? Number(data.bufferArea) : undefined,
      bufferGates: data.bufferGates != null && data.bufferGates !== '' ? Number(data.bufferGates) : undefined,
    };

    try {
      return await destinationRepository.create(createData);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('A destination with this name or slug already exists in database');
      }
      throw error;
    }
  }

  async updateDestination(id: string, data: any) {
    const destination = await destinationRepository.findById(id);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }

    const updateData: Prisma.DestinationUpdateInput = {};

    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.state !== undefined) updateData.state = data.state.trim();
    if (data.country !== undefined) updateData.country = data.country.trim();
    if (data.bestSeason !== undefined) updateData.bestSeason = data.bestSeason ? data.bestSeason.trim() : null;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage ? data.coverImage.trim() : null;
    if (data.establishedYear !== undefined) updateData.establishedYear = data.establishedYear != null && data.establishedYear !== '' ? Number(data.establishedYear) : null;
    if (data.totalArea !== undefined) updateData.totalArea = data.totalArea != null && data.totalArea !== '' ? Number(data.totalArea) : null;
    if (data.coreArea !== undefined) updateData.coreArea = data.coreArea != null && data.coreArea !== '' ? Number(data.coreArea) : null;
    if (data.coreGates !== undefined) updateData.coreGates = data.coreGates != null && data.coreGates !== '' ? Number(data.coreGates) : null;
    if (data.bufferArea !== undefined) updateData.bufferArea = data.bufferArea != null && data.bufferArea !== '' ? Number(data.bufferArea) : null;
    if (data.bufferGates !== undefined) updateData.bufferGates = data.bufferGates != null && data.bufferGates !== '' ? Number(data.bufferGates) : null;

    if (data.name && data.name.trim() !== destination.name) {
      const trimmedName = data.name.trim();
      const existing = await destinationRepository.findByNameAny(trimmedName);
      if (existing && existing.id !== id) {
        throw new ConflictError('A destination with this name already exists');
      }
      
      const newSlug = generateSlug(trimmedName);
      const existingSlug = await destinationRepository.findBySlugAny(newSlug);
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictError('A destination with a similar name already exists (slug conflict)');
      }
      
      updateData.name = trimmedName;
      updateData.slug = newSlug;
    }

    try {
      return await destinationRepository.update(id, updateData);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('A destination with this name or slug already exists in database');
      }
      throw error;
    }
  }

  async deleteDestination(id: string) {
    const destination = await destinationRepository.findById(id);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }

    await destinationRepository.softDelete(id);
    return { message: 'Destination deleted successfully' };
  }
}

export const destinationService = new DestinationService();

