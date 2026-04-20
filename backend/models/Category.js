const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Basic slug generation before save (if not provided)
categorySchema.pre('save', function() {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.split(' ').join('-').toLowerCase();
  }
});

module.exports = mongoose.model('Category', categorySchema);
