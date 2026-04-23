const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");

const summarizeReviews = async (productId) => {
  const [summary] = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        reviewCount: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const reviewCount = summary?.reviewCount || 0;
  const averageRating = reviewCount > 0 ? Math.round(summary.averageRating * 10) / 10 : 0;

  await Product.findByIdAndUpdate(productId, {
    reviewCount,
    averageRating,
  });

  return { reviewCount, averageRating };
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load reviews", error: error.message });
  }
};

const createProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    const title = String(req.body.title || "").trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!comment) {
      return res.status(400).json({ message: "Review comment is required" });
    }

    const verified = Boolean(
      await Order.exists({
        user: req.user._id,
        "items.product": product._id,
        paymentStatus: { $in: ["pending", "paid"] },
        orderStatus: { $ne: "cancelled" },
      })
    );

    const review = await Review.findOneAndUpdate(
      {
        product: product._id,
        user: req.user._id,
      },
      {
        product: product._id,
        user: req.user._id,
        name: req.user.name,
        rating,
        title,
        comment,
        verified,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const summary = await summarizeReviews(product._id);
    return res.status(201).json({ review, summary });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save review", error: error.message });
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
  summarizeReviews,
};
