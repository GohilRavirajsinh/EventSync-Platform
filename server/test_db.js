import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './models/userModel.js';

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const newUser = new User({
            name: 'Test2',
            email: 'test2@test.com',
            password: 'password123',
            role: 'USER'
        });
        await newUser.save();
        console.log('SUCCESS');
    } catch (e) {
        console.log('ERROR:', e.message);
    }
    process.exit(0);
});
