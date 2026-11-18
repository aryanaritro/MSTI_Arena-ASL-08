import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
  brand: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: {
    type: String, required: true, trim: true,
    match: /^https?:\/\/.+/i, maxlength: 2048
  },
  category: { type: String, required: true, trim: true, maxlength: 100 },
  stockQuantity: { type: Number, required: true, default: 0, min: 0, validate: Number.isInteger },
  createdAt: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
