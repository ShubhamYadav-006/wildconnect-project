import { Request, Response } from 'express';
import { businessService } from '../services/business.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class BusinessController {
  
  // Public Endpoints
  getPublicBusinesses = asyncHandler(async (req: Request, res: Response) => {
    // Grab query parameters
    const filters: any = {};
    
    if (req.query.type) {
      filters.type = req.query.type;
    } else if (req.query.category === 'accommodation') {
      filters.type = 'RESORT';
    }

    const destParam = (req.query.destination || req.query.destinationSlug || req.query.destinationId) as string;
    if (destParam) {
      filters.OR = [
        { destinationId: destParam },
        { destination: { slug: destParam } },
      ];
    }

    filters.deletedAt = null;

    const businesses = await businessService.getPublicBusinesses(filters);
    res.status(200).json(ApiResponse.success('Approved businesses fetched successfully', businesses));
  });

  getPublicBusinessBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const business = await businessService.getPublicBusinessBySlug(slug);
    res.status(200).json(ApiResponse.success('Business fetched successfully', business));
  });

  // Protected Endpoints (User/Partner)
  getMyBusinesses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const businesses = await businessService.getMyBusinesses(userId);
    res.status(200).json(ApiResponse.success('My businesses fetched successfully', businesses));
  });

  getMyBusinessById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const business = await businessService.getMyBusinessById(id, userId);
    res.status(200).json(ApiResponse.success('Business fetched successfully', business));
  });

  createBusiness = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role;
    const business = await businessService.createBusiness(userId, req.body, role);
    res.status(201).json(ApiResponse.success('Business created successfully', business));
  });

  updateBusiness = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role;
    const id = req.params.id as string;
    const business = await businessService.updateBusiness(id, userId, req.body, role);
    res.status(200).json(ApiResponse.success('Business updated successfully', business));
  });

  submitForReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const business = await businessService.submitForReview(id, userId);
    res.status(200).json(ApiResponse.success('Business submitted for review', business));
  });

  // Admin Endpoints
  getAdminBusinesses = asyncHandler(async (req: Request, res: Response) => {
    const businesses = await businessService.getAdminBusinesses();
    res.status(200).json(ApiResponse.success('Businesses fetched successfully', businesses));
  });

  getAdminBusinessById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const business = await businessService.getAdminBusinessById(id);
    res.status(200).json(ApiResponse.success('Business fetched successfully', business));
  });

  updateBusinessStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, rejectionReason } = req.body;
    const business = await businessService.updateBusinessStatus(id, status, rejectionReason);
    res.status(200).json(ApiResponse.success(`Business status updated to ${status}`, business));
  });

  approvePendingUpdates = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const business = await businessService.approvePendingUpdates(id);
    res.status(200).json(ApiResponse.success('Pending updates approved and merged successfully', business));
  });

  rejectPendingUpdates = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { rejectionReason } = req.body;
    const business = await businessService.rejectPendingUpdates(id, rejectionReason);
    res.status(200).json(ApiResponse.success('Pending updates rejected', business));
  });

  deleteBusiness = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await businessService.deleteBusiness(id);
    res.status(200).json(ApiResponse.success(result.message));
  });
}

export const businessController = new BusinessController();
