import express from 'express';
import { createEvent, getAllEvents, getSingleEvent } from '../controllers/eventController.js';
import { protectRoute, restrictTo } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';
const router = express.Router();

router.get('/', getAllEvents);
router.get('/:eventId', getSingleEvent);
router.post('/', protectRoute, restrictTo('ORGANIZER', 'ADMIN'), upload.single('image'), createEvent);

export default router;