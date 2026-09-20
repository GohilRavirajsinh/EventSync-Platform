import { Ticket } from '../models/ticketModel.js';
import { Event } from '../models/eventModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Razorpay ko apni chaabi (keys) dena
const razorPayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Get User Tickets (Sirf normal USER apni tickets dekhega)
export const getUserTickets = async (req, res) => {
    try {
        // req.user._id ki madad se us user ki saari tickets dhoondho
        // populate("event") se event ki details (title, date) bhi sath me aa jayegi
        const tickets = await Ticket.find({ user: req.user._id }).populate("event");

        res.status(200).json({ tickets });
    } catch (error) {
        console.log("Error in getUserTicket controller:", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

// 2. Get Event Tickets (Sirf ORGANIZER dekhega ki uske event pe kaun kaun aa raha hai)
export const getEventTickets = async (req, res) => {
    try {
        const { eventId } = req.params;
        // Pehle check karenge ki kya ye Event isi Organizer ka hai ya kisi aur ka?
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        // Agar dusre organizer ne is event ko dekhne ka try kiya toh usko mana kar do
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "You are not organizer of this event!"
            });
        }

        // Event ki saari tickets nikalo aur user ka naam aur email le aao
        const tickets = await Ticket.find({
            event: eventId
        }).populate("user", "name email");

        res.status(200).json(tickets);

    } catch (error) {
        console.log("Error in getEventTickets controller:", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

export const createPaymentOrder = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({ error: "Housfulll! All seats are booked!" });
        }

        // Razorpay me amount Paise me hota hai (Rupees me nahi). Isliye 500 Rs = 50000 Paise (* 100)
        const amountInPaise = event.entryFee * 100;

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_event_${event._id}`
        };

        // Razorpay ke server se Order ID mangwana
        const order = await razorPayInstance.orders.create(options);

        // Frontend ko order ID Bhej do
        res.status(200).json({
            message: "Razorpay Order Created!",
            order: order // Isme 'id' hogi jo payment ke kaam aayegi
        });
    } catch (error) {
        console.log("Error in createPaymentOrder:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// RAZORPAY STEP 2: Verify Payment & Book Ticket
export const verifyPayment = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        //1. Signature Verify Karna (Crypto module ka use karke)
        const secret = process.env.RAZORPAY_KEY_SECRET;

        // Combine both string to make one string
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // A Secret key for me 
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        // Check Razorpay's signature or my signature is same or not
        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ error: "Fake Payment Detected! " });
        }

        // Agar Payment Real hai, toh Atomic Ticket Booking karo!
        // Ye query seat tabhi minus karegi jab seat 0 se badi ($gt: 0) hogi.
        const event = await Event.findOneAndUpdate(
            { _id: eventId, availableSeats: { $gt: 0 } },
            { $inc: { availableSeats: -1 } },
            { new: true }
        );
        // Agar event nahi mila iska matlab ya toh ID galat thi, ya seats 0 ho chuki thi (Housefull)
        if (!event) {
            return res.status(400).json({ error: "Housefull! Aapki payment refund kar di jayegi." });
        }

        const newTicket = new Ticket({
            user: req.user._id,
            event: event._id,
            paymentId: razorpay_payment_id,
            paymentStatus: 'SUCCESS'
        });

        await newTicket.save();
        res.status(201).json({
            message: "Payment Verified! Ticket Booked!",
            ticket: newTicket
        });
    } catch (error) {
        console.log("Error in verifyPayment:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}