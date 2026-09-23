import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator.js';

const router = Router();

// Public
router.get('/business/:businessId', vehicleController.getVehiclesByBusiness);

// Partner
router.post('/', protect, restrictTo('BUSINESS_PARTNER'), validate(createVehicleSchema), vehicleController.createVehicle);
router.put('/:id', protect, restrictTo('BUSINESS_PARTNER'), validate(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', protect, restrictTo('BUSINESS_PARTNER'), vehicleController.deleteVehicle);

export default router;
