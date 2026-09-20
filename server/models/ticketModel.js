import mongoose, { mongo } from "mongoose";

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    paymentId: { type: String }, // Razorpay ka payment ID baad me yahan aayega
    paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' }
}, { timestamps: true })

export const Ticket = mongoose.model("Ticket", ticketSchema);