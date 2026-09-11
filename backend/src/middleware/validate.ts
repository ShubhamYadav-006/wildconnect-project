import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { BadRequestError } from '../utils/AppError.js';

export const validate = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body against the schema
      // This will also strip out any unknown fields not defined in the schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        // Extract the first error message from Zod validation errors
        const errorMessage = error.issues ? error.issues.map((e: any) => e.message).join(', ') : 'Validation Error';
        next(new BadRequestError(errorMessage));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the query parameters against the schema
      const parsed = await schema.parseAsync(req.query);
      for (const key of Object.keys(req.query)) {
        delete (req.query as any)[key];
      }
      Object.assign(req.query as any, parsed);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        const errorMessage = error.issues ? error.issues.map((e: any) => e.message).join(', ') : 'Validation Error';
        next(new BadRequestError(errorMessage));
      } else {
        next(error);
      }
    }
  };
};
