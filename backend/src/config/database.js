import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let client = null;

export const connectDB = async () => {
  try {
    if (db) {
      return db;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    console.log('MongoDB connected successfully');
    
    db = client.db('Salesmanagement');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('MongoDB connection closed');
  }
};
