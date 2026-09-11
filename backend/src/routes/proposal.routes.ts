import { Router } from 'express';
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  acceptProposal,
  rejectProposal,
  sendProposal,
  requestChanges,
  getProposalsByTripRequest,
} from '../controllers/proposal.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createProposalSchema, updateProposalSchema, changeRequestSchema } from '../validators/proposal.validator.js';

const router = Router();

// Routes accessible by both Tourist and Admin
router.get('/trip-request/:tripRequestId', protect, getProposalsByTripRequest);
router.get('/:id', protect, getProposalById);

// Tourist routes
router.patch('/:id/accept', protect, restrictTo('TOURIST'), acceptProposal);
router.patch('/:id/reject', protect, restrictTo('TOURIST'), rejectProposal);
router.patch('/:id/change-request', protect, restrictTo('TOURIST'), validate(changeRequestSchema), requestChanges);

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', validate(createProposalSchema), createProposal);
router.get('/', getAllProposals);
router.patch('/:id', validate(updateProposalSchema), updateProposal);
router.patch('/:id/send', sendProposal);
router.delete('/:id', deleteProposal);

export default router;
