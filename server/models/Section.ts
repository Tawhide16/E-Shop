import mongoose, { Schema, Document } from 'mongoose';
import { SectionConfig as ISectionConfig } from '../../src/types/cms';

export type SectionDocument = ISectionConfig;

const SectionSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  settings: { type: Schema.Types.Mixed, default: {} },
  styles: { type: Schema.Types.Mixed, default: {} },
  metrics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }
  }
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

export const SectionModel = mongoose.model<SectionDocument>('Section', SectionSchema);
