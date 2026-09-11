import { Router } from 'express';
import { getMyProposals } from '../controllers/proposal.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(restrictTo('TOURIST'));

router.get('/proposals', getMyProposals);

export default router;
