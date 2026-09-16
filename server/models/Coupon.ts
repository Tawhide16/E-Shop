import mongoose, { Schema, Document } from 'mongoose';
import { Coupon as ICoupon } from '../../src/types/cms';

export type CouponDocument = ICoupon;

const CouponSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  usageLimit: { type: Number, default: 100 },
  timesUsed: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' }
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

export const CouponModel = mongoose.model<CouponDocument>('Coupon', CouponSchema);
