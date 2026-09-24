import { User } from '../models/userModel.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation Check
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All Fields are Required!" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "This email is already registred!"
            });
        }

        // Ab Hashing ki chinta nahi, Model khud sambhal lega! password hashing
        const newUser = new User({
            name,
            email,
            password, // Direct normal password pass karo
            role: role || 'USER'
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                message: "Registration Successsful!"
            });
        } else {
            res.status(400).json({
                error: "Invalid user data"
            });
        }
    } catch (error) {
        console.log("Error in register controller", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }

        // IF all ok
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "Login Successful!"
        });
    } catch (error) {
        console.log("Error is login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout Succesfully!" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}