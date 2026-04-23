const Product = require('../models/Product');

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const generateUniqueSlug = async (name, excludeId) => {
  const baseSlug = slugify(name) || `product-${Date.now()}`;
  let nextSlug = baseSlug;
  let counter = 1;

  while (await Product.findOne({
    slug: nextSlug,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  })) {
    counter += 1;
    nextSlug = `${baseSlug}-${counter}`;
  }

  return nextSlug;
};

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

const normalizeImageUrls = (imagesValue) => {
  if (!Array.isArray(imagesValue)) {
    return [];
  }

  return imagesValue
    .map((image) => String(image || '').trim())
    .filter(Boolean)
    .filter((image) => !image.startsWith('data:'));
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
      const search = String(req.query.search).trim();
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
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
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'best_selling':
          sortOption = { salesCount: -1, createdAt: -1 };
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

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 4, 1), 12);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const tagFilter = product.tags?.length
      ? {
          _id: { $ne: product._id },
          tags: { $in: product.tags },
        }
      : { _id: { $ne: product._id } };

    let relatedProducts = await Product.find(tagFilter)
      .sort({ salesCount: -1, createdAt: -1 })
      .limit(limit);

    if (relatedProducts.length < limit) {
      const existingIds = relatedProducts.map((item) => item._id);
      const fallbackProducts = await Product.find({
        _id: { $nin: [product._id, ...existingIds] },
      })
        .sort({ salesCount: -1, createdAt: -1 })
        .limit(limit - relatedProducts.length);

      relatedProducts = [...relatedProducts, ...fallbackProducts];
    }

    res.status(200).json(relatedProducts);
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
    const name = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim();

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (!description) {
      return res.status(400).json({ message: 'Product description is required' });
    }

    const payload = {
      name,
      slug: await generateUniqueSlug(name),
      price: Number(req.body.price),
      description,
      images: normalizeImageUrls(req.body.images),
      tags: normalizeTagsArray(req.body.tags),
      stock: Number(req.body.stock),
    };

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(409).json({
        message: 'Unable to create product',
        error: 'A product with this slug already exists. Please change the product name and try again.',
      });
    }

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
    if (update.images !== undefined) update.images = normalizeImageUrls(update.images);
    if (update.name !== undefined) update.slug = await generateUniqueSlug(update.name, req.params.id);

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
