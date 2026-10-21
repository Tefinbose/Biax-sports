
import mongoose, { Schema, type Model } from "mongoose";

export interface IStoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: {
      type: String,
      required: true,
      default: "BIAX SPORTS",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Empowering Athletes. Elevating Performance.",
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      default: "info@biaxsports.com",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },
    codEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  (mongoose.models.StoreSettings as Model<IStoreSettings>) ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

export default StoreSettings;
