import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js'

// Guard 1: Check karega ki Token (Login) hai ya nahi
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized = No Token Provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                error: "Unauthorized = Invalid Token"
            });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Guard 2: Check karega ki user Admin ya Organizer hai ya nahi (Roles)
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user.role check karenge jo humne Guard 1 se nikala
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Your role (${req.user.role}) is not allowed for this action!`
            });
        }
        next();
    };
};