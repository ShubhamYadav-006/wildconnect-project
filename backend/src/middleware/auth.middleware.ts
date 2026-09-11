import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { userRepository } from '../repositories/user.repository.js';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Role } from '../generated/prisma/index.js';

// Extend Express Request object to include the user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1) Getting token and check if it's there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('You are not logged in! Please log in to get access.'));
  }

  // 2) Verification of token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return next(new UnauthorizedError('Invalid token. Please log in again.'));
  }

  // 3) Check if user still exists
  const currentUser = await userRepository.findById(decoded.id);
  if (!currentUser) {
    return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
  }

  // 4) Check if user was deleted (soft delete)
  if (currentUser.deletedAt) {
    return next(new UnauthorizedError('This account has been deleted.'));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
};

export const optionalProtect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token) as any;
    const currentUser = await userRepository.findById(decoded.id);
    
    if (currentUser && !currentUser.deletedAt) {
      req.user = currentUser;
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }

  next();
});
