import mongoose, { Schema, type Model } from "mongoose";

export interface IProductImage {
  _id: mongoose.Types.ObjectId;
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true, default: "image/jpeg" },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const ProductImage: Model<IProductImage> =
  mongoose.models.ProductImage ||
  mongoose.model<IProductImage>("ProductImage", ProductImageSchema);

export default ProductImage;
