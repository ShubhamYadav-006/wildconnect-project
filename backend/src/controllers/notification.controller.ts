import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { notificationService } from '../services/notification.service.js';

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.createNotification(req.body);
  res.status(201).json(ApiResponse.success('Notification created successfully', notification));
});

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    unreadOnly: req.query.unreadOnly === 'true',
  };

  const result = await notificationService.getUserNotifications(req.user.id, options);
  res.status(200).json(ApiResponse.success('Notifications retrieved successfully', result));
});

export const getUnreadNotifications = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    unreadOnly: true,
  };

  const result = await notificationService.getUserNotifications(req.user.id, options);
  res.status(200).json(ApiResponse.success('Unread notifications retrieved successfully', result));
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.getUnreadCount(req.user.id);
  res.status(200).json(ApiResponse.success('Unread count retrieved successfully', result));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const notification = await notificationService.markAsRead(id, req.user.id);
  res.status(200).json(ApiResponse.success('Notification marked as read', notification));
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  res.status(200).json(ApiResponse.success(result.message));
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await notificationService.deleteNotification(id, req.user.id);
  res.status(200).json(ApiResponse.success(result.message));
});
