import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { BadRequestError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    throw new BadRequestError('No files uploaded');
  }

  const files = req.files as Express.Multer.File[];
  
  // Construct absolute URLs using the server URL or relative paths
  // Using relative path /uploads/... because in production they would be served from the same domain
  const fileUrls = files.map(file => `/uploads/${file.filename}`);

  res.status(200).json(ApiResponse.success('Files uploaded successfully', fileUrls));
});
