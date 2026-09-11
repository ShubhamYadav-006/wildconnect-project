import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { experienceService } from '../services/experience.service.js';
import { ExperienceStatus, Role } from '../generated/prisma/index.js';

export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await experienceService.createExperience(req.body, req.user.id);
  res.status(201).json(ApiResponse.success('Experience created successfully', experience));
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const experience = await experienceService.updateExperience(id, req.body);
  res.status(200).json(ApiResponse.success('Experience updated successfully', experience));
});

export const publishExperience = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const experience = await experienceService.publishExperience(id);
  res.status(200).json(ApiResponse.success('Experience published successfully', experience));
});

export const archiveExperience = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const experience = await experienceService.archiveExperience(id);
  res.status(200).json(ApiResponse.success('Experience archived successfully', experience));
});

export const featureExperience = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  // expects { isFeatured: true / false } in body
  const isFeatured = req.body.isFeatured === true;
  const experience = await experienceService.featureExperience(id, isFeatured);
  res.status(200).json(ApiResponse.success(`Experience feature status updated to ${isFeatured}`, experience));
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await experienceService.deleteExperience(id);
  res.status(200).json(ApiResponse.success('Experience deleted successfully'));
});

export const getExperiences = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === Role.ADMIN;
  
  const options = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    status: req.query.status as ExperienceStatus | undefined,
    search: req.query.search as string | undefined,
    isAdmin,
  };

  const result = await experienceService.getExperiences(options);
  res.status(200).json(ApiResponse.success('Experiences retrieved successfully', result));
});

export const getFeaturedExperiences = asyncHandler(async (req: Request, res: Response) => {
  const result = await experienceService.getFeaturedExperiences();
  res.status(200).json(ApiResponse.success('Featured experiences retrieved successfully', result));
});

export const getExperienceById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isAdmin = req.user?.role === Role.ADMIN;
  
  const experience = await experienceService.getExperienceById(id, isAdmin);
  res.status(200).json(ApiResponse.success('Experience retrieved successfully', experience));
});
