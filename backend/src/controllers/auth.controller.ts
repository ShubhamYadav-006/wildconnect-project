import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { userService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json(ApiResponse.success('User registered successfully', result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.status(200).json(ApiResponse.success('Logged in successfully', result));
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential, role } = req.body;
  if (!credential) {
    res.status(400).json({ success: false, message: 'Credential is required' });
    return;
  }
  const result = await authService.googleLogin(credential, role);
  res.status(200).json(ApiResponse.success('Logged in successfully with Google', result));
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id; // Guaranteed to be set by auth middleware
  const profile = await userService.getProfile(userId);
  res.status(200).json(ApiResponse.success('Profile retrieved', profile));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const updatedProfile = await userService.updateProfile(userId, req.body);
  res.status(200).json(ApiResponse.success('Profile updated', updatedProfile));
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await userService.changePassword(userId, req.body);
  res.status(200).json(ApiResponse.success(result.message));
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers();
  res.status(200).json(ApiResponse.success('Users retrieved successfully', result));
});
