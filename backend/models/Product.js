const mongoose = require('mongoose');

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
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
    salesCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ tags: 1 });
productSchema.index({ salesCount: -1, createdAt: -1 });

productSchema.pre('validate', async function ensureUniqueSlug() {
  if (this.slug && !this.isModified('slug') && !this.isModified('name')) {
    return;
  }

  const baseSlug = slugify(this.slug || this.name) || `product-${Date.now()}`;
  let nextSlug = baseSlug;
  let counter = 1;

  while (
    await this.constructor.exists({
      slug: nextSlug,
      _id: { $ne: this._id },
    })
  ) {
    counter += 1;
    nextSlug = `${baseSlug}-${counter}`;
  }

  this.slug = nextSlug;
});

module.exports = mongoose.model('Product', productSchema);
