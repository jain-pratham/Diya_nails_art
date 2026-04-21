const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");

const VALID_ORDER_STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const getDashboardStats = async (req, res) => {
  try {
    const [orders, productCount, customerCount, categoryCount] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(6),
      Product.countDocuments(),
      User.countDocuments({ isAdmin: { $ne: true } }),
      Category.countDocuments(),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$total" }, paidOrders: { $sum: 1 } } },
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const paymentCounts = await Order.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
    ]);

    return res.json({
      revenue: revenueResult[0]?.revenue || 0,
      paidOrders: revenueResult[0]?.paidOrders || 0,
      totalOrders: await Order.countDocuments(),
      productCount,
      customerCount,
      categoryCount,
      statusCounts: statusCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      paymentCounts: paymentCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      recentOrders: orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load admin stats", error: error.message });
  }
};

const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load orders", error: error.message });
  }
};

const updateAdminOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.orderStatus !== undefined) {
      if (!VALID_ORDER_STATUSES.includes(req.body.orderStatus)) {
        return res.status(400).json({ message: "Invalid order status" });
      }
      order.orderStatus = req.body.orderStatus;
    }

    if (req.body.paymentStatus !== undefined) {
      if (!VALID_PAYMENT_STATUSES.includes(req.body.paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }
      order.paymentStatus = req.body.paymentStatus;
    }

    order.paymentDetails = {
      ...order.paymentDetails,
      adminUpdatedAt: new Date().toISOString(),
      adminUpdatedBy: String(req.user._id),
    };

    await order.save();
    await order.populate("user", "name email phone");

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update order", error: error.message });
  }
};

const createCloudinarySignature = (params, apiSecret) => {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${signatureBase}${apiSecret}`).digest("hex");
};

const uploadImages = async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        message: "Cloudinary is not configured",
        error: "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env",
      });
    }

    const images = Array.isArray(req.body.images) ? req.body.images : [];
    if (images.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadedImages = [];

    for (const image of images) {
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = "diya-nail-art/products";
      const signature = createCloudinarySignature({ folder, timestamp }, apiSecret);
      const formData = new URLSearchParams();
      formData.set("file", image);
      formData.set("api_key", apiKey);
      formData.set("timestamp", String(timestamp));
      formData.set("folder", folder);
      formData.set("signature", signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      uploadedImages.push({
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      });
    }

    return res.status(201).json({ images: uploadedImages });
  } catch (error) {
    return res.status(500).json({ message: "Unable to upload images", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAdminOrders,
  updateAdminOrder,
  uploadImages,
};
