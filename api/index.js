// server/app.ts
import express from "express";
import cors from "cors";
import dotenv2 from "dotenv";

// server/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
dotenv.config();
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
  }
}
var isConnected = false;
var lastDbError = null;
function getMongoUri() {
  return process.env.MONGODB_URI?.trim() || "";
}
async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }
  const uri = getMongoUri();
  if (!uri) {
    lastDbError = "MONGODB_URI environment variable is not defined.";
    console.warn("\u26A0\uFE0F MONGODB_URI environment variable is not defined.");
    isConnected = false;
    return false;
  }
  try {
    const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
    console.log(`\u{1F50C} Attempting to connect to MongoDB at: ${masked}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1e4,
      connectTimeoutMS: 1e4,
      bufferCommands: false
    });
    isConnected = true;
    lastDbError = null;
    console.log("\u2705 Connected successfully to MongoDB!");
    return true;
  } catch (error) {
    isConnected = false;
    lastDbError = error.message;
    console.warn("\u26A0\uFE0F  Could not connect to MongoDB:", lastDbError);
    return false;
  }
}
function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
function getLastError() {
  return lastDbError;
}

// server/routes/api.ts
import { Router } from "express";

// server/models/Product.ts
import mongoose2, { Schema } from "mongoose";
var ProductColorSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  image: { type: String }
}, { _id: false });
var ProductSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, default: "" },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  gender: { type: String, enum: ["women", "men", "unisex"], default: "unisex" },
  collection: { type: String },
  fit: { type: String },
  badge: { type: String, enum: ["NEW", "BESTSELLER", "SALE", "LIMITED", "TRENDING", null] },
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  viewCount24h: { type: Number, default: 0 },
  description: { type: String, default: "" },
  features: { type: [String], default: [] },
  images: { type: [String], default: [] },
  colors: { type: [ProductColorSchema], default: [] },
  sizes: { type: [String], default: [] },
  status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
  tags: { type: [String], default: [] }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var ProductModel = mongoose2.model("Product", ProductSchema);

// server/models/Order.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var OrderItemSchema = new Schema2({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: "" },
  color: { type: String, default: "" },
  size: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });
var OrderSchema = new Schema2({
  id: { type: String, required: true, unique: true, index: true },
  orderNumber: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  date: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "refunded"],
    default: "paid"
  },
  fulfillmentStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  shippingAddress: { type: String, default: "" }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var OrderModel = mongoose3.model("Order", OrderSchema);

// server/models/Customer.ts
import mongoose4, { Schema as Schema3 } from "mongoose";
var CustomerSchema = new Schema3({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderDate: { type: String, default: "" },
  status: { type: String, enum: ["active", "vip", "inactive"], default: "active" },
  favoriteCategory: { type: String, default: "" }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var CustomerModel = mongoose4.model("Customer", CustomerSchema);

// server/models/Section.ts
import mongoose5, { Schema as Schema4 } from "mongoose";
var SectionSchema = new Schema4({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  settings: { type: Schema4.Types.Mixed, default: {} },
  styles: { type: Schema4.Types.Mixed, default: {} },
  metrics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var SectionModel = mongoose5.model("Section", SectionSchema);

// server/models/Coupon.ts
import mongoose6, { Schema as Schema5 } from "mongoose";
var CouponSchema = new Schema5({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, uppercase: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  usageLimit: { type: Number, default: 100 },
  timesUsed: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "expired", "disabled"], default: "active" }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var CouponModel = mongoose6.model("Coupon", CouponSchema);

// server/models/Settings.ts
import mongoose7, { Schema as Schema6 } from "mongoose";
var SettingsSchema = new Schema6({
  key: { type: String, required: true, unique: true, default: "global" },
  seo: { type: Schema6.Types.Mixed },
  theme: { type: Schema6.Types.Mixed }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var SettingsModel = mongoose7.model("Settings", SettingsSchema);

// src/data/initialData.ts
var INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Adapt Animal X Whitney Leggings",
    sku: "GS-W-LEG-001",
    price: 70,
    comparePrice: 85,
    stock: 28,
    category: "Leggings",
    gender: "women",
    collection: "Whitney x Adapt",
    fit: "Regular",
    badge: "BESTSELLER",
    rating: 4.8,
    reviewCount: 159,
    viewCount24h: 826,
    description: "Designed for lifting. These leggings are high-waisted and made from durable, supportive, stretchy seamless fabric.",
    features: [
      "New More Supportive Waistband - Extra ribbing on the lower stomach gives you even more support",
      "Breathable - Air and moisture flow through the fabric, allowing your body to breathe",
      "Sweat-wicking - Sweat-wicking tech moves sweat away from your body, keeping you cool, dry and focused."
    ],
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Electric Pink / Sorbet Yellow", hex: "#FF3399" },
      { name: "Sunset Orange", hex: "#FF6600" },
      { name: "Calm Pink", hex: "#FFB6C1" },
      { name: "Black", hex: "#111111" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    tags: ["whitney", "seamless", "high-waisted", "lifting"]
  },
  {
    id: "prod-2",
    name: "Gymshark x Bratz Leggings",
    sku: "GS-W-LEG-002",
    price: 72,
    comparePrice: 90,
    stock: 14,
    category: "Leggings",
    gender: "women",
    collection: "Bratz",
    fit: "Regular",
    badge: "LIMITED",
    rating: 4.8,
    reviewCount: 124,
    viewCount24h: 610,
    description: "Iconic Y2K Gymshark x Bratz collaboration activewear with premium soft sculpt contouring.",
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Super-Set Pink/Wash", hex: "#E0115F" },
      { name: "Black/Asphalt Grey", hex: "#222222" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    status: "active",
    tags: ["bratz", "pink", "collaboration"]
  },
  {
    id: "prod-3",
    name: "Lift Seamless High-Rise Leggings",
    sku: "GS-W-LEG-003",
    price: 74,
    stock: 45,
    category: "Leggings",
    gender: "women",
    collection: "Lift Seamless",
    fit: "High-Rise",
    badge: "TRENDING",
    rating: 4.6,
    reviewCount: 88,
    description: "Ultra contouring body-sculpting seamless leggings engineered for maximum squat-proof support.",
    images: [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Calm Pink", hex: "#D8A7B1" },
      { name: "Charcoal Grey", hex: "#333333" },
      { name: "Teal Blue", hex: "#008080" }
    ],
    sizes: ["XS", "S", "M", "L"],
    status: "active",
    tags: ["lift", "high-rise", "squatproof"]
  },
  {
    id: "prod-4",
    name: "Vital Sweetheart Neck Crop Top",
    sku: "GS-W-TOP-001",
    price: 35,
    comparePrice: 50,
    stock: 8,
    category: "Sports Bras",
    gender: "women",
    collection: "Vital Seamless",
    fit: "Focus Fit",
    badge: "SALE",
    rating: 4.5,
    reviewCount: 42,
    description: "Flattering sweetheart neckline long sleeve crop top crafted in sweat-wicking knit texture.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Focus Pink", hex: "#FF69B4" },
      { name: "Black Marl", hex: "#1C1C1C" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    sizes: ["XS", "S", "M", "L"],
    status: "active",
    tags: ["sweetheart", "crop top", "sale"]
  },
  {
    id: "prod-5",
    name: "Power Oversized Hoodie",
    sku: "GS-M-HOOD-001",
    price: 75,
    stock: 32,
    category: "Hoodies",
    gender: "men",
    collection: "Power",
    fit: "Oversized Fit",
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 96,
    description: "Heavyweight fleece hoodie designed for warmups, pump covers, and post-gym recovery comfort.",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Black/Asphalt Grey", hex: "#1A1A1A" },
      { name: "Grey Marl", hex: "#888888" },
      { name: "Army Green", hex: "#4B5320" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    status: "active",
    tags: ["power", "hoodie", "oversized"]
  },
  {
    id: "prod-6",
    name: "Pumper Heavyweight Pants",
    sku: "GS-M-PNT-001",
    price: 60,
    stock: 19,
    category: "Pants",
    gender: "men",
    collection: "Power",
    fit: "Oversized Fit",
    rating: 4.4,
    reviewCount: 22,
    description: "Relaxed fit training pants engineered with thick durable cotton blend and deep secure zip pockets.",
    images: [
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Charcoal Grey", hex: "#333333" }
    ],
    sizes: ["S", "M", "L", "XL"],
    status: "active",
    tags: ["pumper", "pants", "oversized"]
  },
  {
    id: "prod-7",
    name: "Crest Straight Leg Joggers",
    sku: "GS-M-PNT-002",
    price: 55,
    comparePrice: 65,
    stock: 25,
    category: "Pants",
    gender: "men",
    collection: "Crest",
    fit: "Regular Fit",
    badge: "TRENDING",
    rating: 4.7,
    reviewCount: 51,
    description: "Essential straight-leg fleece sweatpants with embroidered Gymshark crest logo.",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Light Grey Marl", hex: "#CCCCCC" },
      { name: "Black", hex: "#111111" },
      { name: "Navy Blue", hex: "#000080" }
    ],
    sizes: ["S", "M", "L", "XL"],
    status: "active",
    tags: ["crest", "joggers", "sweatpants"]
  },
  {
    id: "prod-8",
    name: "Campus Crest Oversized Pants",
    sku: "GS-M-PNT-003",
    price: 60,
    stock: 50,
    category: "Pants",
    gender: "men",
    collection: "Campus",
    fit: "Oversized Fit",
    badge: "NEW",
    rating: 4.6,
    reviewCount: 38,
    description: "Retro varsity-styled fleece pants with relaxed hem drape and cozy soft-brushed lining.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Varsity Green", hex: "#1B4D3E" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    status: "active",
    tags: ["campus", "new", "oversized"]
  },
  {
    id: "prod-9",
    name: "Whitney x Adapt Strappy Sports Bra",
    sku: "GS-W-BRA-002",
    price: 45,
    comparePrice: 55,
    stock: 36,
    category: "Sports Bras",
    gender: "women",
    collection: "Whitney x Adapt",
    fit: "Medium Support",
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 112,
    description: "Criss-cross back straps with buttery-soft ribbing and removable foam padding.",
    images: [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Electric Pink", hex: "#FF3399" },
      { name: "Sunset Orange", hex: "#FF6600" },
      { name: "Black", hex: "#111111" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    status: "active",
    tags: ["whitney", "sports-bra", "strappy"]
  },
  {
    id: "prod-10",
    name: "Vital Seamless 2.0 High-Waisted Shorts",
    sku: "GS-W-SHO-001",
    price: 40,
    stock: 42,
    category: "Shorts",
    gender: "women",
    collection: "Vital Seamless",
    fit: "High-Rise",
    badge: "NEW",
    rating: 4.7,
    reviewCount: 65,
    description: "Lightweight sweat-wicking knit shorts designed for high-intensity training and summer gym sessions.",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Calm Pink", hex: "#FFB6C1" },
      { name: "Black Marl", hex: "#1A1A1A" },
      { name: "Sage Green", hex: "#9CAF88" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L"],
    status: "active",
    tags: ["vital", "shorts", "seamless"]
  },
  {
    id: "prod-11",
    name: "Apex Performance Training T-Shirt",
    sku: "GS-M-TEE-001",
    price: 42,
    comparePrice: 50,
    stock: 30,
    category: "Tops",
    gender: "men",
    collection: "Apex Performance",
    fit: "Slim Fit",
    badge: "SALE",
    rating: 4.8,
    reviewCount: 77,
    description: "Heat-mapping ventilation zones and ergonomic flatlock seam construction for peak conditioning.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Stealth Black", hex: "#111111" },
      { name: "Electric Cobalt", hex: "#0047AB" },
      { name: "Optic White", hex: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    status: "active",
    tags: ["apex", "t-shirt", "performance"]
  },
  {
    id: "prod-12",
    name: 'Apex 5" Lightweight Running Shorts',
    sku: "GS-M-SHO-002",
    price: 48,
    stock: 22,
    category: "Shorts",
    gender: "men",
    collection: "Apex Performance",
    fit: "Regular Fit",
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 94,
    description: "Split hem side vents, built-in compression liner, and phone pocket engineered for sprint intervals.",
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Storm Grey", hex: "#708090" }
    ],
    sizes: ["S", "M", "L", "XL"],
    status: "active",
    tags: ["apex", "shorts", "running"]
  },
  {
    id: "prod-13",
    name: "Minimalist Rest Day Crop Hoodie",
    sku: "GS-W-HOOD-002",
    price: 68,
    stock: 18,
    category: "Hoodies",
    gender: "women",
    collection: "Minimalist",
    fit: "Relaxed Fit",
    badge: "NEW",
    rating: 4.7,
    reviewCount: 29,
    description: "Ultra-plush French terry cropped hoodie with raw cut hem and minimalist silicone logo.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Oatmeal Marl", hex: "#E3DAC9" },
      { name: "Calm Pink", hex: "#FFB6C1" },
      { name: "Black", hex: "#111111" }
    ],
    sizes: ["XS", "S", "M", "L"],
    status: "active",
    tags: ["minimalist", "crop-hoodie", "rest-day"]
  },
  {
    id: "prod-14",
    name: "Power Zip-Up Windbreaker Jacket",
    sku: "GS-U-JAC-001",
    price: 85,
    comparePrice: 105,
    stock: 12,
    category: "Jackets",
    gender: "unisex",
    collection: "Power",
    fit: "Oversized Fit",
    badge: "SALE",
    rating: 4.8,
    reviewCount: 45,
    description: "Water-repellent ripstop shell with toggle-cinch hem and packable hood for all-weather warmup sessions.",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Cement Grey", hex: "#9E9E9E" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    tags: ["jacket", "windbreaker", "water-repellent"]
  },
  {
    id: "prod-15",
    name: "Gymshark Everyday Heavyweight Duffle 45L",
    sku: "GS-ACC-BAG-001",
    price: 58,
    stock: 40,
    category: "Accessories",
    gender: "unisex",
    collection: "Power",
    fit: "45 Liters",
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 180,
    description: "Dedicated wet-shoe compartment, padded shoulder strap, and waterproof heavy-gauge canvas fabric.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Black / White Logo", hex: "#000000" },
      { name: "Olive Green", hex: "#556B2F" }
    ],
    sizes: ["One Size"],
    status: "active",
    tags: ["duffle-bag", "accessories", "gym-bag"]
  },
  {
    id: "prod-16",
    name: "Gymshark Padded Lifting Straps (Pair)",
    sku: "GS-ACC-STR-001",
    price: 18,
    comparePrice: 22,
    stock: 65,
    category: "Accessories",
    gender: "unisex",
    collection: "Power",
    fit: "Standard Length",
    badge: "SALE",
    rating: 4.9,
    reviewCount: 310,
    description: "Heavy duty reinforced cotton webbing with neoprene wrist padding for heavy deadlifts and barbell pulls.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Pink", hex: "#FF69B4" }
    ],
    sizes: ["One Size"],
    status: "active",
    tags: ["straps", "lifting", "deadlift"]
  }
];
var INITIAL_SECTIONS = [
  {
    id: "sec-announcement",
    type: "announcement",
    title: "Announcement Bar",
    enabled: true,
    order: 1,
    settings: {
      announcementMessages: [
        "Get $10 off when you refer a friend",
        "Students get an extra 15% off",
        "Free Shipping on orders over $100"
      ],
      autoRotateAnnouncements: true,
      showCloseAnnouncement: true
    },
    styles: {
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      fontSize: "12px",
      fontWeight: "600"
    },
    metrics: { views: 24800, clicks: 1240, ctr: 5 }
  },
  {
    id: "sec-hero",
    type: "hero",
    title: "Hero Banner",
    subtitle: "Primary Homepage Billboard",
    enabled: true,
    order: 2,
    settings: {
      heroSlides: [
        {
          id: "slide-1",
          title: "OUR BESTSELLERS",
          subtitle: "Everyone loves them, and so will you.",
          desktopImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600",
          button1Text: "Bestsellers",
          button1Url: "/collection/bestsellers",
          button2Text: "Shop Pink",
          button2Url: "/collection/pink"
        }
      ],
      heroHeight: "large"
    },
    styles: {
      overlayDarkness: 35,
      textAlign: "left"
    },
    metrics: { views: 124820, clicks: 8420, ctr: 6.74 }
  },
  {
    id: "sec-bestsellers-women",
    type: "product_grid",
    title: "BESTSELLERS",
    subtitle: "Women's Top Rated Essentials",
    enabled: true,
    order: 3,
    settings: {
      productSource: "bestselling",
      productCount: 4,
      columnsDesktop: 4,
      columnsTablet: 2,
      columnsMobile: 2,
      viewAllText: "View All",
      viewAllUrl: "/collections/women-bestsellers",
      productCardSettings: {
        showImage: true,
        showName: true,
        showPrice: true,
        showComparePrice: true,
        showDiscount: true,
        showRating: true,
        showWishlist: true,
        showQuickAdd: true,
        showColorVariants: true,
        showProductBadge: true
      }
    },
    styles: {
      paddingY: "medium"
    },
    metrics: { views: 98200, clicks: 14200, ctr: 14.46 }
  },
  {
    id: "sec-promo-men",
    type: "promo_banner",
    title: "BESTSELLING LOOKS",
    subtitle: "These are the popular styles everyone loves.",
    enabled: true,
    order: 4,
    settings: {
      bannerImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1600",
      primaryBtnText: "Bestsellers",
      primaryBtnUrl: "/collections/bestsellers",
      secondaryBtnText: "New In",
      secondaryBtnUrl: "/collections/new-in"
    },
    styles: {
      overlayDarkness: 40,
      textAlign: "left"
    },
    metrics: { views: 76500, clicks: 4320, ctr: 5.65 }
  },
  {
    id: "sec-bestsellers-men",
    type: "product_grid",
    title: "BESTSELLERS - MEN",
    subtitle: "Top Performers For Men",
    enabled: true,
    order: 5,
    settings: {
      productSource: "manual",
      productCount: 4,
      columnsDesktop: 4,
      columnsTablet: 2,
      columnsMobile: 2,
      viewAllText: "View All",
      viewAllUrl: "/collections/men-bestsellers"
    },
    styles: {
      paddingY: "medium"
    },
    metrics: { views: 64100, clicks: 8120, ctr: 12.66 }
  },
  {
    id: "sec-favorites-categories",
    type: "category_grid",
    title: "FAVORITES",
    subtitle: "Explore core activewear styles",
    enabled: true,
    order: 6,
    settings: {
      filterTabs: ["WOMEN", "MEN"]
    },
    styles: {
      paddingY: "medium"
    },
    metrics: { views: 52100, clicks: 5890, ctr: 11.3 }
  },
  {
    id: "sec-banner-favorites",
    type: "promo_banner",
    title: "FEATURED FAVORITES COLLECTION",
    subtitle: "Engineered for comfort and unmatched performance. Shop our top-rated styles.",
    enabled: true,
    order: 7,
    settings: {
      bannerImage: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1600",
      primaryBtnText: "Shop Favorites",
      primaryBtnUrl: "/collections/favorites",
      secondaryBtnText: "View All",
      secondaryBtnUrl: "/collections/all"
    },
    styles: {
      overlayDarkness: 35,
      textAlign: "left"
    },
    metrics: { views: 42100, clicks: 3890, ctr: 9.24 }
  },
  {
    id: "sec-popular-now",
    type: "category_grid",
    title: "POPULAR RIGHT NOW",
    subtitle: "Bestselling styles you'll reach for every single session.",
    enabled: true,
    order: 8,
    settings: {
      filterTabs: ["WOMEN", "MEN"]
    },
    styles: {
      paddingY: "medium"
    },
    metrics: { views: 48900, clicks: 4910, ctr: 10.04 }
  },
  {
    id: "sec-editorial",
    type: "editorial",
    title: "WORKOUT CLOTHES & GYM CLOTHES",
    subtitle: "Built In The Weight Room",
    enabled: false,
    order: 9,
    settings: {
      contentHtml: `
        <h3>GYM CLOTHES BUILT IN THE WEIGHT ROOM</h3>
        <p>Workout Clothes designed to help you become your personal best. Because when it comes to performing at your max, there should be no obstacles \u2013 least of all your workout clothes. Functional and comfortable, we create workout clothing you'll sweat in. Since 2012, we've designed and created the workout clothes we want to wear, because training and its people are what we know best.</p>
        
        <h3>ACTIVEWEAR & ATHLEISURE</h3>
        <p>Our <strong>Men's Workout Clothes</strong> feature sweat-wicking <strong>workout shirts</strong> and <strong>tank tops</strong>, <strong>gym shorts</strong>, <strong>sweatpants</strong> and more. Whilst our <strong>Women's Workout Clothes</strong> are designed for a range of movements and feature sophisticated seamless technology, clever contouring and durable, quick-dry sweat-wicking fabrics on <strong>leggings</strong>, <strong>sports bras</strong> and more.</p>
        
        <h3>MORE THAN YOUR BEST WORKOUT CLOTHING</h3>
        <p>An obsession with lifting is what started this brand, and we haven't forgotten our roots. Our <strong>Women's</strong> and <strong>Men's Bodybuilding clothes</strong> feature classic styles, with modern cuts and innovative fabrics to help you raise the bar.</p>
      `
    },
    styles: {
      paddingY: "medium"
    }
  },
  {
    id: "sec-newsletter",
    type: "newsletter",
    title: "GET 10% OFF YOUR FIRST ORDER",
    subtitle: "Sign up for exclusive drops, training tips and offers.",
    enabled: true,
    order: 10,
    settings: {
      primaryBtnText: "SIGN UP"
    },
    styles: {
      backgroundColor: "#F4F4F5",
      textColor: "#111111",
      paddingY: "medium"
    }
  },
  {
    id: "sec-footer",
    type: "footer",
    title: "Footer",
    enabled: true,
    order: 11,
    settings: {},
    styles: {
      backgroundColor: "#FFFFFF",
      textColor: "#111111"
    }
  }
];
var INITIAL_ORDERS = [];
var INITIAL_CUSTOMERS = [];
var INITIAL_COUPONS = [
  {
    id: "coup-1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 50,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 1e3,
    timesUsed: 248,
    status: "active"
  },
  {
    id: "coup-2",
    code: "STUDENT15",
    discountType: "percentage",
    discountValue: 15,
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    usageLimit: 500,
    timesUsed: 112,
    status: "active"
  }
];
var INITIAL_SEO = {
  metaTitle: "lox.bd | Official Store - Premium Activewear & Gym Clothing",
  metaDescription: "Shop official lox.bd workout clothing and activewear in Bangladesh. High performance gym apparel with fast local delivery and bKash/Nagad checkout.",
  keywords: "lox.bd, gym clothing, activewear, leggings, sports bras, workout shirts, gymwear",
  ogImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200",
  canonicalUrl: "https://lox.bd",
  allowIndexing: true
};
var INITIAL_THEME = {
  primaryColor: "#000000",
  secondaryColor: "#FF3399",
  backgroundColor: "#FFFFFF",
  textColor: "#111111",
  buttonColor: "#000000",
  buttonTextColor: "#FFFFFF",
  borderRadius: "none",
  fontHeading: "system-ui, sans-serif",
  fontBody: "system-ui, sans-serif"
};

// server/routes/api.ts
var router = Router();
router.get("/health", async (_req, res) => {
  if (!isDbConnected()) {
    await connectToDatabase().catch(() => false);
  }
  const connected = isDbConnected();
  res.json({
    status: "ok",
    database: connected ? "connected" : "disconnected",
    error: getLastError(),
    message: connected ? "MongoDB is connected and operational." : "Running in offline/fallback mode. MongoDB connection not established.",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
router.post("/seed", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected. Cannot seed." });
  }
  try {
    const force = req.query.force === "true";
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0 || force) {
      if (force) await ProductModel.deleteMany({});
      await ProductModel.insertMany(INITIAL_PRODUCTS);
    }
    const sectionCount = await SectionModel.countDocuments();
    if (sectionCount === 0 || force) {
      if (force) await SectionModel.deleteMany({});
      await SectionModel.insertMany(INITIAL_SECTIONS);
    }
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0 || force) {
      if (force) await OrderModel.deleteMany({});
      await OrderModel.insertMany(INITIAL_ORDERS);
    }
    const customerCount = await CustomerModel.countDocuments();
    if (customerCount === 0 || force) {
      if (force) await CustomerModel.deleteMany({});
      await CustomerModel.insertMany(INITIAL_CUSTOMERS);
    }
    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0 || force) {
      if (force) await CouponModel.deleteMany({});
      await CouponModel.insertMany(INITIAL_COUPONS);
    }
    const settings = await SettingsModel.findOne({ key: "global" });
    if (!settings || force) {
      await SettingsModel.findOneAndUpdate(
        { key: "global" },
        { key: "global", seo: INITIAL_SEO, theme: INITIAL_THEME },
        { upsert: true }
      );
    }
    return res.json({
      success: true,
      message: "Initial data seeded successfully into MongoDB!"
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return res.status(500).json({ error: error.message });
  }
});
router.get("/products", async (_req, res) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_PRODUCTS);
  }
  try {
    const products = await ProductModel.find().lean();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/products", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const productData = req.body;
    if (!productData.id) {
      productData.id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }
    const created = await ProductModel.create(productData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
router.put("/products/:id", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const { id } = req.params;
    const updated = await ProductModel.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
router.delete("/products/:id", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ success: true, id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/orders", async (_req, res) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_ORDERS);
  }
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/orders", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const orderData = req.body;
    if (!orderData.id) {
      orderData.id = `ord-${Date.now()}`;
    }
    if (!orderData.orderNumber) {
      orderData.orderNumber = `ORD-${Math.floor(1e5 + Math.random() * 9e5)}`;
    }
    const created = await OrderModel.create(orderData);
    if (orderData.customerEmail) {
      await CustomerModel.findOneAndUpdate(
        { email: orderData.customerEmail },
        {
          $inc: { totalOrders: 1, totalSpent: orderData.totalAmount || 0 },
          $set: {
            name: orderData.customerName,
            lastOrderDate: (/* @__PURE__ */ new Date()).toLocaleDateString()
          },
          $setOnInsert: {
            id: `cust-${Date.now()}`,
            status: "active"
          }
        },
        { upsert: true }
      );
    }
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
router.patch("/orders/:id/status", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
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
    return res.status(400).json({ error: error.message });
  }
});
router.get("/sections", async (_req, res) => {
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
    return res.status(500).json({ error: error.message });
  }
});
router.put("/sections", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const sections = req.body;
    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Expected an array of sections" });
    }
    await SectionModel.deleteMany({});
    const saved = await SectionModel.insertMany(sections);
    return res.json(saved);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/customers", async (_req, res) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_CUSTOMERS);
  }
  try {
    const customers = await CustomerModel.find().lean();
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/customers", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const created = await CustomerModel.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
router.get("/coupons", async (_req, res) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_COUPONS);
  }
  try {
    const coupons = await CouponModel.find().lean();
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/coupons", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const created = await CouponModel.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
router.get("/settings", async (_req, res) => {
  if (!isDbConnected()) {
    return res.json({ seo: INITIAL_SEO, theme: INITIAL_THEME });
  }
  try {
    const settings = await SettingsModel.findOne({ key: "global" }).lean();
    return res.json({
      seo: settings?.seo || INITIAL_SEO,
      theme: settings?.theme || INITIAL_THEME
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.put("/settings", async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const { seo, theme } = req.body;
    const updated = await SettingsModel.findOneAndUpdate(
      { key: "global" },
      { $set: { ...seo && { seo }, ...theme && { theme } } },
      { new: true, upsert: true }
    ).lean();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
var api_default = router;

// server/app.ts
dotenv2.config();
var app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
var dbInitPromise = null;
async function ensureDatabaseConnected() {
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
    console.warn("DB connect warning:", err);
  }
  next();
});
app.use("/api", api_default);
app.use("/", api_default);
async function autoSeedDatabase() {
  if (!isDbConnected()) return;
  try {
    const pCount = await ProductModel.countDocuments();
    if (pCount === 0) {
      console.log("\u{1F331} Seeding initial products to MongoDB...");
      await ProductModel.insertMany(INITIAL_PRODUCTS);
    }
    const sCount = await SectionModel.countDocuments();
    if (sCount === 0) {
      console.log("\u{1F331} Seeding initial CMS sections to MongoDB...");
      await SectionModel.insertMany(INITIAL_SECTIONS);
    }
    const oCount = await OrderModel.countDocuments();
    if (oCount === 0) {
      console.log("\u{1F331} Seeding initial orders to MongoDB...");
      await OrderModel.insertMany(INITIAL_ORDERS);
    }
    const cCount = await CustomerModel.countDocuments();
    if (cCount === 0) {
      console.log("\u{1F331} Seeding initial customers to MongoDB...");
      await CustomerModel.insertMany(INITIAL_CUSTOMERS);
    }
    const cpCount = await CouponModel.countDocuments();
    if (cpCount === 0) {
      console.log("\u{1F331} Seeding initial coupons to MongoDB...");
      await CouponModel.insertMany(INITIAL_COUPONS);
    }
    const setDoc = await SettingsModel.findOne({ key: "global" });
    if (!setDoc) {
      console.log("\u{1F331} Seeding initial theme & SEO settings to MongoDB...");
      await SettingsModel.create({ key: "global", seo: INITIAL_SEO, theme: INITIAL_THEME });
    }
    console.log("\u2705 Database check and seeding completed.");
  } catch (err) {
    console.warn("\u26A0\uFE0F Auto-seeding warning:", err.message);
  }
}

// server/api-handler.ts
async function handler(req, res) {
  try {
    await ensureDatabaseConnected();
  } catch (err) {
    console.warn("Vercel serverless DB connect note:", err);
  }
  return app(req, res);
}
export {
  handler as default
};
