import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, isDbConnected } from './db';
import apiRouter from './routes/api';
import { ProductModel } from './models/Product';
import { SectionModel } from './models/Section';
import { OrderModel } from './models/Order';
import { CustomerModel } from './models/Customer';
import { CouponModel } from './models/Coupon';
import { SettingsModel } from './models/Settings';
import {
  INITIAL_PRODUCTS,
  INITIAL_SECTIONS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_SEO,
  INITIAL_THEME
} from '../src/data/initialData';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Middleware to ensure DB connection on serverless / local requests
let dbInitPromise: Promise<void> | null = null;

export async function ensureDatabaseConnected() {
  if (isDbConnected()) return;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      await connectToDatabase();
      await autoSeedDatabase();
    })();
  }
  return dbInitPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await ensureDatabaseConnected();
  } catch (err) {
    console.warn('DB connect warning:', err);
  }
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Auto-seed database if empty
export async function autoSeedDatabase() {
  if (!isDbConnected()) return;

  try {
    const pCount = await ProductModel.countDocuments();
    if (pCount === 0) {
      console.log('🌱 Seeding initial products to MongoDB...');
      await ProductModel.insertMany(INITIAL_PRODUCTS);
    }

    const sCount = await SectionModel.countDocuments();
    if (sCount === 0) {
      console.log('🌱 Seeding initial CMS sections to MongoDB...');
      await SectionModel.insertMany(INITIAL_SECTIONS);
    }

    const oCount = await OrderModel.countDocuments();
    if (oCount === 0) {
      console.log('🌱 Seeding initial orders to MongoDB...');
      await OrderModel.insertMany(INITIAL_ORDERS);
    }

    const cCount = await CustomerModel.countDocuments();
    if (cCount === 0) {
      console.log('🌱 Seeding initial customers to MongoDB...');
      await CustomerModel.insertMany(INITIAL_CUSTOMERS);
    }

    const cpCount = await CouponModel.countDocuments();
    if (cpCount === 0) {
      console.log('🌱 Seeding initial coupons to MongoDB...');
      await CouponModel.insertMany(INITIAL_COUPONS);
    }

    const setDoc = await SettingsModel.findOne({ key: 'global' });
    if (!setDoc) {
      console.log('🌱 Seeding initial theme & SEO settings to MongoDB...');
      await SettingsModel.create({ key: 'global', seo: INITIAL_SEO, theme: INITIAL_THEME });
    }

    console.log('✅ Database check and seeding completed.');
  } catch (err) {
    console.warn('⚠️ Auto-seeding warning:', (err as Error).message);
  }
}
