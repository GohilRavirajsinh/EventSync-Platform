import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import eventRoutes from './routes/eventRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Frontend ka exact pata (URL)
    credentials: true // Cookies ko aane-jaane ki permission do
}));
app.use(express.json());
app.use(cookieParser());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ticket', ticketRoutes);

app.get('/', (req, res) => {
    res.send('EventSync Mega API is Live! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});