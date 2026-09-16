import mongoose, { Schema, Document } from 'mongoose';
import { Product as IProduct } from '../../src/types/cms';

export type ProductDocument = IProduct;

const ProductColorSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  image: { type: String }
}, { _id: false });

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  gender: { type: String, enum: ['women', 'men', 'unisex'], default: 'unisex' },
  collection: { type: String },
  fit: { type: String },
  badge: { type: String, enum: ['NEW', 'BESTSELLER', 'SALE', 'LIMITED', 'TRENDING', null] },
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  viewCount24h: { type: Number, default: 0 },
  description: { type: String, default: '' },
  features: { type: [String], default: [] },
  images: { type: [String], default: [] },
  colors: { type: [ProductColorSchema], default: [] },
  sizes: { type: [String], default: [] },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  tags: { type: [String], default: [] }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
  toJSON: {
    transform: (_, ret: any) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);
