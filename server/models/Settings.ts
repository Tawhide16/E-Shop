import mongoose, { Schema, Document } from 'mongoose';
import { SEOSettings, GlobalThemeSettings } from '../../src/types/cms';

export interface SettingsDocument extends Document {
  key: string;
  seo?: SEOSettings;
  theme?: GlobalThemeSettings;
}

const SettingsSchema = new Schema({
  key: { type: String, required: true, unique: true, default: 'global' },
  seo: { type: Schema.Types.Mixed },
  theme: { type: Schema.Types.Mixed }
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

export const SettingsModel = mongoose.model<SettingsDocument>('Settings', SettingsSchema);
