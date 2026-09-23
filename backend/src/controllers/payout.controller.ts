import { Request, Response } from 'express';
import { payoutService } from '../services/payout.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class PayoutController {
  getMyFinances = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const finances = await payoutService.getPartnerFinances(userId);
    res.status(200).json(ApiResponse.success('Partner finances fetched', finances));
  });

  processPayout = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { utrNumber } = req.body;
    const payout = await payoutService.processPayout(id, utrNumber);
    res.status(200).json(ApiResponse.success('Payout processed successfully', payout));
  });
}

export const payoutController = new PayoutController();
