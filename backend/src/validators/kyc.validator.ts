import { z } from 'zod';

export const submitKycSchema = z.object({
  body: z.object({
    businessPan: z.string().min(5, 'Business PAN / Tax ID is required').max(20),
    gstin: z.string().max(20).optional().nullable(),
    idProofUrl: z.string().url('Valid ID proof document URL is required'),
    businessProofUrl: z.string().url('Valid Business proof document URL is required'),
    bankAccountName: z.string().min(2, 'Bank account holder name is required'),
    bankAccountNumber: z.string().min(6, 'Valid bank account number is required'),
    bankIfsc: z.string().min(4, 'Valid IFSC / Routing code is required'),
    bankName: z.string().min(2, 'Bank name is required'),
    cancelledChequeUrl: z.string().url().optional().nullable(),
  }),
});

export const reviewKycSchema = z.object({
  body: z.object({
    status: z.enum(['KYC_VERIFIED', 'KYC_REJECTED']),
    rejectionReason: z.string().optional().nullable(),
  }),
});
