import { z } from 'zod';

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.coerce.number().optional()
);

const optionalPositiveNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.coerce.number().positive().optional()
);

const optionalNonNegativeInt = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.coerce.number().int().nonnegative().optional()
);

const optionalString = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.string().optional()
);

export const createDestinationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  coverImage: optionalString,
  establishedYear: optionalNumber,
  totalArea: optionalPositiveNumber,
  coreArea: optionalPositiveNumber,
  coreGates: optionalNonNegativeInt,
  bufferArea: optionalPositiveNumber,
  bufferGates: optionalNonNegativeInt,
});

export const updateDestinationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  state: z.string().min(2, 'State is required').optional(),
  country: z.string().min(2, 'Country is required').optional(),
  coverImage: optionalString,
  establishedYear: optionalNumber,
  totalArea: optionalPositiveNumber,
  coreArea: optionalPositiveNumber,
  coreGates: optionalNonNegativeInt,
  bufferArea: optionalPositiveNumber,
  bufferGates: optionalNonNegativeInt,
});

