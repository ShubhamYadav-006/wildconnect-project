import { Router } from 'express';
import { equipmentController } from '../controllers/equipment.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createEquipmentSchema, updateEquipmentSchema } from '../validators/equipment.validator.js';

const router = Router();

// Public
router.get('/business/:businessId', equipmentController.getEquipmentByBusiness);

// Partner
router.post('/', protect, restrictTo('BUSINESS_PARTNER'), validate(createEquipmentSchema), equipmentController.createEquipment);
router.put('/:id', protect, restrictTo('BUSINESS_PARTNER'), validate(updateEquipmentSchema), equipmentController.updateEquipment);
router.delete('/:id', protect, restrictTo('BUSINESS_PARTNER'), equipmentController.deleteEquipment);

export default router;
