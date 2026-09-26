import { z } from 'zod';

export const VALID_DOC_TYPES = [
  'AADHAAR_CARD',
  'PAN_CARD',
  'DRIVING_LICENSE',
  'VOTER_ID',
  'PASSPORT',
  'GSTIN_REGISTRATION',
] as const;

export const submitKycSchema = z
  .object({
    doc1Type: z.enum(VALID_DOC_TYPES, {
      message: 'Please select a valid First Document Type from the approved list',
    }),
    doc1Number: z
      .string()
      .trim()
      .min(3, 'First document identification number must be at least 3 characters')
      .max(30, 'Document number too long'),
    doc2Type: z.enum(VALID_DOC_TYPES, {
      message: 'Please select a valid Second Document Type from the approved list',
    }),
    doc2Number: z
      .string()
      .trim()
      .min(3, 'Second document identification number must be at least 3 characters')
      .max(30, 'Document number too long'),
    aadhaarNumber: z.string().optional().nullable().or(z.literal('')),
    idProofUrl: z.string().optional().nullable().or(z.literal('')),
    businessPan: z.string().optional().nullable().or(z.literal('')),
    gstin: z.string().optional().nullable().or(z.literal('')),
    businessProofUrl: z.string().optional().nullable().or(z.literal('')),
    bankAccountName: z.string().optional().nullable().or(z.literal('')),
    bankAccountNumber: z.string().optional().nullable().or(z.literal('')),
    bankIfsc: z.string().optional().nullable().or(z.literal('')),
    bankName: z.string().optional().nullable().or(z.literal('')),
    cancelledChequeUrl: z.string().optional().nullable().or(z.literal('')),
  })
  .refine((data) => data.doc1Type !== data.doc2Type, {
    message: 'Please select two different document types for verification',
    path: ['doc2Type'],
  });

export const reviewKycSchema = z.object({
  status: z.enum(['KYC_VERIFIED', 'KYC_REJECTED']),
  rejectionReason: z.string().optional().nullable().or(z.literal('')),
});
