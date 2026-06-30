import mongoose from 'mongoose';

export let dbErrorMsg = '';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    dbErrorMsg = '';
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    dbErrorMsg = error.message;
  }
};

export default connectDB;
