const Product = require('../models/Product');

const parseTags = (tagsValue) => {
  if (!tagsValue || typeof tagsValue !== 'string') {
    return [];
  }

  const tags = tagsValue
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(tags)];
};

const buildTagFilter = (tagsValue) => {
  const tags = parseTags(tagsValue);

  if (tags.length === 1) {
    return { tags: { $in: tags } };
  }

  if (tags.length > 1) {
    return { tags: { $all: tags } };
  }

  return {};
};

const normalizeTagsArray = (tagsValue) => {
  if (Array.isArray(tagsValue)) {
    return [...new Set(tagsValue.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
  }

  if (typeof tagsValue === 'string') {
    return parseTags(tagsValue);
  }

  return [];
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const filter = {
      ...buildTagFilter(req.query.tags),
    };

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'latest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public for demo/admin flow
exports.createProduct = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      images: Array.isArray(req.body.images) ? req.body.images : [],
      tags: normalizeTagsArray(req.body.tags),
      stock: Number(req.body.stock),
    };

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const update = {
      ...req.body,
    };

    if (update.price !== undefined) update.price = Number(update.price);
    if (update.stock !== undefined) update.stock = Number(update.stock);
    if (update.tags !== undefined) update.tags = normalizeTagsArray(update.tags);
    if (update.images !== undefined && !Array.isArray(update.images)) update.images = [];

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Unable to update product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
