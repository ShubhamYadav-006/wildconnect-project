import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
  getPublicRoomsByBusiness,
  getMyBusinessRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.controller.js';

const router = Router();

// Public: Get rooms of an approved business
router.get('/public/:businessId', getPublicRoomsByBusiness);

// Partner Routes
router.use(protect, restrictTo('BUSINESS_PARTNER'));
router.get('/business/:businessId', getMyBusinessRooms);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
