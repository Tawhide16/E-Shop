import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || (process.env.VERCEL ? '' : 'mongodb://127.0.0.1:27017/eshop');

let isConnected = false;

export async function connectToDatabase(): Promise<boolean> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI environment variable is not defined on Vercel. Running in fallback mode.');
    isConnected = false;
    return false;
  }

  try {
    console.log(`🔌 Attempting to connect to MongoDB at: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log('✅ Connected successfully to MongoDB!');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn('⚠️  Could not connect to MongoDB. The server will run with offline/cached data mode.');
    console.warn(`   Error details: ${(error as Error).message}`);
    console.warn('   To connect to MongoDB, ensure MongoDB is running locally or set MONGODB_URI in .env with your MongoDB Atlas connection string.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export { mongoose };
