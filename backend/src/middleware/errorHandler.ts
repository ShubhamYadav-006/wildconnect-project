import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }
  
  if (!isOperational) {
    logger.error('💥 UNEXPECTED ERROR 💥', err);
  } else if (env.NODE_ENV === 'development') {
    logger.debug('App Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
