import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/EventSyncDB`);
        console.log(`Database Connected Successful! DB Host: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Database Connection Failed ${error}`);
        process.exit(1);
    }
};

export default connectDB;