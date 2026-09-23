import { Request, Response } from 'express';
import { partnerKycService } from '../services/partnerKyc.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class PartnerKycController {
  getMyKyc = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const kyc = await partnerKycService.getKycByUserId(userId);
    res.status(200).json(ApiResponse.success('KYC fetched successfully', kyc));
  });

  submitMyKyc = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const kyc = await partnerKycService.submitKyc(userId, req.body);
    res.status(200).json(ApiResponse.success('KYC documents submitted successfully', kyc));
  });

  // Admin Endpoints
  getAllKyc = asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const records = await partnerKycService.getAllKycRecords(status);
    res.status(200).json(ApiResponse.success('KYC records fetched successfully', records));
  });

  reviewKyc = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, rejectionReason } = req.body;
    const reviewed = await partnerKycService.reviewKyc(id, status, rejectionReason);
    res.status(200).json(ApiResponse.success(`KYC status updated to ${status}`, reviewed));
  });

  // Secure KYC Document Streaming
  getDocument = asyncHandler(async (req: Request, res: Response) => {
    const filename = req.params.filename as string;
    const user = req.user!;
    
    // Delegate to service to verify ownership/admin privileges
    const filePath = await partnerKycService.verifyAndGetDocumentPath(filename, user.id, user.role);
    res.sendFile(filePath);
  });
}

export const partnerKycController = new PartnerKycController();
