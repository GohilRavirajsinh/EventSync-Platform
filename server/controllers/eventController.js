import { Event } from '../models/eventModel.js';

// 1. Create Event (Sirf ORGANIZER ke liye)
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, entryFee, totalSeats } = req.body;
        // Validation
        if (!title || !description || !date || !location || entryFee === undefined || !totalSeats) {
            return res.status(400).json({
                error: "Saari details zaroori hain!"
            });
        }

        // Naya event database me save karo
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            entryFee,
            totalSeats,
            availableSeats: totalSeats,
            organizer: req.user._id
        });

        await newEvent.save();

        res.status(201).json({
            message: "Event Successfully Created!",
            event: newEvent
        });
    } catch (error) {
        console.log("Error in createEvent controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// 2. Get All Events (Sabke dekhne ke liye - Public)
export const getAllEvents = async (req, res) => {
    try {
        // Find se saare events aayenge. populate() se organizer ka naam aur email bhi aa jayega!
        const events = await Event.find().populate("organizer", "name email");
        res.status(200).json(events);
    } catch (error) {
        console.log("Error in getAllEvents controller:", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};