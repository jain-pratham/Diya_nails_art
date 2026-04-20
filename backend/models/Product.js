const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (value) =>
        Array.isArray(value)
          ? value
              .map((tag) => String(tag).trim().toLowerCase())
              .filter(Boolean)
          : [],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock'],
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);
