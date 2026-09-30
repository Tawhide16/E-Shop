import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Only set custom DNS locally on Windows/local ISP where SRV lookups fail, never in Vercel lambda
if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore in environments where setServers is restricted
  }
}

export const DEFAULT_MONGODB_URI = 'mongodb+srv://loxbd01_db_user:oBXdwapwN4xNtqtX@cluster0.iv15qaw.mongodb.net/eshop?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;
let lastDbError: string | null = null;

export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  return uri || DEFAULT_MONGODB_URI;
}

export async function connectToDatabase(): Promise<boolean> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = getMongoUri();

  try {
    const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🔌 Attempting to connect to MongoDB at: ${masked}`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
    });
    
    isConnected = true;
    lastDbError = null;
    console.log('✅ Connected successfully to MongoDB!');
    return true;
  } catch (error) {
    isConnected = false;
    lastDbError = (error as Error).message;
    console.warn('⚠️  Could not connect to MongoDB:', lastDbError);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getLastError(): string | null {
  return lastDbError;
}

export { mongoose };
