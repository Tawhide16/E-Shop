import mongoose, { Schema, Document } from 'mongoose';
import { Order as IOrder } from '../../src/types/cms';

export type OrderDocument = IOrder;

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: '' },
  color: { type: String, default: '' },
  size: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  orderNumber: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  date: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'pending', 'refunded'], 
    default: 'paid' 
  },
  fulfillmentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  shippingAddress: { type: String, default: '' }
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

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
