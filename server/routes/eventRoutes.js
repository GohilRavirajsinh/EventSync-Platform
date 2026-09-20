import express from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController.js'
import { protectRoute, restrictTo } from '../middlewares/authMiddleware.js'
const router = express.Router();

router.get('/', getAllEvents);
router.post('/', protectRoute, restrictTo('ORGANIZER', 'ADMIN'), createEvent);

export default router;  