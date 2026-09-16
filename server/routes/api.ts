import { Router, Request, Response } from 'express';
import { isDbConnected } from '../db';
import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/Customer';
import { SectionModel } from '../models/Section';
import { CouponModel } from '../models/Coupon';
import { SettingsModel } from '../models/Settings';
import {
  INITIAL_PRODUCTS,
  INITIAL_SECTIONS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_SEO,
  INITIAL_THEME
} from '../../src/data/initialData';

const router = Router();

// Health & Status Check
router.get('/health', async (_req: Request, res: Response) => {
  const connected = isDbConnected();
  res.json({
    status: 'ok',
    database: connected ? 'connected' : 'disconnected',
    message: connected 
      ? 'MongoDB is connected and operational.' 
      : 'Running in offline/fallback mode. MongoDB connection not established.',
    timestamp: new Date().toISOString()
  });
});

// Seed endpoint to populate initial mock data into MongoDB
router.post('/seed', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected. Cannot seed.' });
  }

  try {
    const force = req.query.force === 'true';

    // Seed Products
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0 || force) {
      if (force) await ProductModel.deleteMany({});
      await ProductModel.insertMany(INITIAL_PRODUCTS);
    }

    // Seed Sections
    const sectionCount = await SectionModel.countDocuments();
    if (sectionCount === 0 || force) {
      if (force) await SectionModel.deleteMany({});
      await SectionModel.insertMany(INITIAL_SECTIONS);
    }

    // Seed Orders
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0 || force) {
      if (force) await OrderModel.deleteMany({});
      await OrderModel.insertMany(INITIAL_ORDERS);
    }

    // Seed Customers
    const customerCount = await CustomerModel.countDocuments();
    if (customerCount === 0 || force) {
      if (force) await CustomerModel.deleteMany({});
      await CustomerModel.insertMany(INITIAL_CUSTOMERS);
    }

    // Seed Coupons
    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0 || force) {
      if (force) await CouponModel.deleteMany({});
      await CouponModel.insertMany(INITIAL_COUPONS);
    }

    // Seed Settings
    const settings = await SettingsModel.findOne({ key: 'global' });
    if (!settings || force) {
      await SettingsModel.findOneAndUpdate(
        { key: 'global' },
        { key: 'global', seo: INITIAL_SEO, theme: INITIAL_THEME },
        { upsert: true }
      );
    }

    return res.json({
      success: true,
      message: 'Initial data seeded successfully into MongoDB!'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

/* ==================== PRODUCTS ==================== */

router.get('/products', async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_PRODUCTS);
  }
  try {
    const products = await ProductModel.find().lean();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const productData = req.body;
    if (!productData.id) {
      productData.id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }
    const created = await ProductModel.create(productData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const { id } = req.params;
    const updated = await ProductModel.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ success: true, id });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

/* ==================== ORDERS ==================== */

router.get('/orders', async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_ORDERS);
  }
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/orders', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const orderData = req.body;
    if (!orderData.id) {
      orderData.id = `ord-${Date.now()}`;
    }
    if (!orderData.orderNumber) {
      orderData.orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    const created = await OrderModel.create(orderData);

    // Also update or create customer record
    if (orderData.customerEmail) {
      await CustomerModel.findOneAndUpdate(
        { email: orderData.customerEmail },
        {
          $inc: { totalOrders: 1, totalSpent: orderData.totalAmount || 0 },
          $set: { 
            name: orderData.customerName,
            lastOrderDate: new Date().toLocaleDateString()
          },
          $setOnInsert: {
            id: `cust-${Date.now()}`,
            status: 'active'
          }
        },
        { upsert: true }
      );
    }

    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.patch('/orders/:id/status', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const { id } = req.params;
    const { fulfillmentStatus } = req.body;
    const updated = await OrderModel.findOneAndUpdate(
      { id },
      { $set: { fulfillmentStatus } },
      { new: true }
    ).lean();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

/* ==================== CMS SECTIONS ==================== */

router.get('/sections', async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_SECTIONS);
  }
  try {
    const sections = await SectionModel.find().sort({ order: 1 }).lean();
    if (sections.length === 0) {
      return res.json(INITIAL_SECTIONS);
    }
    return res.json(sections);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/sections', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const sections = req.body;
    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: 'Expected an array of sections' });
    }

    // Replace all sections with new list
    await SectionModel.deleteMany({});
    const saved = await SectionModel.insertMany(sections);
    return res.json(saved);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

/* ==================== CUSTOMERS ==================== */

router.get('/customers', async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_CUSTOMERS);
  }
  try {
    const customers = await CustomerModel.find().lean();
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/customers', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const created = await CustomerModel.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

/* ==================== COUPONS ==================== */

router.get('/coupons', async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_COUPONS);
  }
  try {
    const coupons = await CouponModel.find().lean();
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/coupons', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const created = await CouponModel.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

/* ==================== SETTINGS (SEO & Theme) ==================== */

router.get('/settings', async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json({ seo: INITIAL_SEO, theme: INITIAL_THEME });
  }
  try {
    const settings = await SettingsModel.findOne({ key: 'global' }).lean();
    return res.json({
      seo: settings?.seo || INITIAL_SEO,
      theme: settings?.theme || INITIAL_THEME
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/settings', async (req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const { seo, theme } = req.body;
    const updated = await SettingsModel.findOneAndUpdate(
      { key: 'global' },
      { $set: { ...(seo && { seo }), ...(theme && { theme }) } },
      { new: true, upsert: true }
    ).lean();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
