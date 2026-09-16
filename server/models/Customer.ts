import mongoose, { Schema, Document } from 'mongoose';
import { Customer as ICustomer } from '../../src/types/cms';

export type CustomerDocument = ICustomer;

const CustomerSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderDate: { type: String, default: '' },
  status: { type: String, enum: ['active', 'vip', 'inactive'], default: 'active' },
  favoriteCategory: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret: any) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const CustomerModel = mongoose.model<CustomerDocument>('Customer', CustomerSchema);
