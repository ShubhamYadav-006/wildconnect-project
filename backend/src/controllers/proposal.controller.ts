import { Request, Response } from 'express';
import { proposalService } from '../services/proposal.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createProposal = asyncHandler(async (req: Request, res: Response) => {
  const result = await proposalService.createProposal(req.body);
  res.status(201).json(ApiResponse.success('Proposal created successfully', result));
});

export const getAllProposals = asyncHandler(async (req: Request, res: Response) => {
  const result = await proposalService.getAllProposals();
  res.status(200).json(ApiResponse.success('Proposals retrieved successfully', result));
});

export const getProposalById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await proposalService.getProposalById(id, req.user!.id, req.user!.role);
  res.status(200).json(ApiResponse.success('Proposal retrieved successfully', result));
});

export const getMyProposals = asyncHandler(async (req: Request, res: Response) => {
  const result = await proposalService.getMyProposals(req.user!.id);
  res.status(200).json(ApiResponse.success('Proposals retrieved successfully', result));
});

export const updateProposal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await proposalService.updateProposal(id, req.body);
  res.status(200).json(ApiResponse.success('Proposal updated successfully', result));
});

export const deleteProposal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await proposalService.deleteProposal(id);
  res.status(200).json(ApiResponse.success(result.message));
});

export const acceptProposal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await proposalService.acceptProposal(id, req.user!.id);
  res.status(200).json(ApiResponse.success('Proposal accepted successfully', result));
});

export const rejectProposal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await proposalService.rejectProposal(id, req.user!.id);
  res.status(200).json(ApiResponse.success('Proposal rejected successfully', result));
});

export const sendProposal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await proposalService.sendProposal(id);
  res.status(200).json(ApiResponse.success('Proposal sent successfully', result));
});

export const requestChanges = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { changeRequest } = req.body;
  const result = await proposalService.requestChanges(id, req.user!.id, changeRequest);
  res.status(200).json(ApiResponse.success('Change request submitted successfully', result));
});

export const getProposalsByTripRequest = asyncHandler(async (req: Request, res: Response) => {
  const tripRequestId = req.params.tripRequestId as string;
  const result = await proposalService.getProposalsByTripRequest(tripRequestId, req.user!.id, req.user!.role);
  res.status(200).json(ApiResponse.success('Proposals retrieved successfully', result));
});
