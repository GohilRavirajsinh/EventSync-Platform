import express from 'express';
import { createPaymentOrder, getEventTickets, getUserTickets, verifyPayment } from '../controllers/ticketController.js';
import { protectRoute, restrictTo } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Razorpay ka bill (Order) banana
router.post('/create-order/:eventId', protectRoute, restrictTo('USER'), createPaymentOrder);
// Payment verify karke Asli ticket book karna (bookTicket ko hata kar verifyPayment kar diya)
router.post('/verify-payment/:eventId', protectRoute, restrictTo('USER'), verifyPayment);

router.get('/my-tickets', protectRoute, restrictTo('USER'), getUserTickets);
router.get('/event-tickets/:eventId', protectRoute, restrictTo('ORGANIZER', 'ADMIN'), getEventTickets);

export default router;