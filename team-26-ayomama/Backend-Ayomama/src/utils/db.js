import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

//mongoDb database connection setup
const connectDB =() =>{
    mongoose.connect(process.env.MONGO_URI) //mongo url
    try {
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.log('MongoDB connection failed', {error: error.message})
    }
}

export default connectDB;