import { Router } from 'express';
import { calendarBlockController } from '../controllers/calendarBlock.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createCalendarBlockSchema } from '../validators/calendarBlock.validator.js';

const router = Router();

// Public / Authenticated fetch
router.get('/business/:businessId', calendarBlockController.getBlocksByBusiness);

// Partner
router.post('/', protect, restrictTo('BUSINESS_PARTNER'), validate(createCalendarBlockSchema), calendarBlockController.createBlock);
router.delete('/:id', protect, restrictTo('BUSINESS_PARTNER'), calendarBlockController.deleteBlock);

export default router;
