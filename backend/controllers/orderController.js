const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const FREE_SHIPPING_MINIMUM = 499;
const STANDARD_SHIPPING_FEE = 79;
const VALID_COUPONS = {
  WELCOME15: {
    minimumSubtotal: 999,
    percent: 15,
  },
};

const calculateDiscount = (subtotal, couponCode) => {
  const normalizedCode = String(couponCode || "").trim().toUpperCase();
  const coupon = VALID_COUPONS[normalizedCode];

  if (!coupon || subtotal < coupon.minimumSubtotal) {
    return { couponCode: "", discount: 0 };
  }

  return {
    couponCode: normalizedCode,
    discount: Math.round((subtotal * coupon.percent) / 100),
  };
};

const calculateTotals = (subtotal, couponCode) => {
  const { couponCode: appliedCouponCode, discount } = calculateDiscount(subtotal, couponCode);
  const shippingFee = subtotal >= FREE_SHIPPING_MINIMUM ? 0 : STANDARD_SHIPPING_FEE;
  const tax = 0;
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  return {
    couponCode: appliedCouponCode,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
  };
};

const createOrderNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DNA-${datePart}-${randomPart}`;
};

const normalizeAddress = (address) => ({
  label: String(address?.label || "Home").trim(),
  fullName: String(address?.fullName || "").trim(),
  phone: String(address?.phone || "").trim(),
  addressLine1: String(address?.addressLine1 || "").trim(),
  addressLine2: String(address?.addressLine2 || "").trim(),
  city: String(address?.city || "").trim(),
  state: String(address?.state || "").trim(),
  zipCode: String(address?.zipCode || "").trim(),
  country: String(address?.country || "India").trim(),
});

const validateAddress = (address) => {
  const requiredFields = ["fullName", "addressLine1", "city", "state", "zipCode"];
  return requiredFields.every((field) => address[field]);
};

const buildOrderFromCart = async (userId, couponCode) => {
  const user = await User.findById(userId).populate({
    path: "cart.product",
    select: "name price images stock",
  });

  if (!user) {
    return { error: { status: 404, message: "User not found" } };
  }

  const validCartItems = user.cart.filter((item) => item.product);
  if (validCartItems.length === 0) {
    return { error: { status: 400, message: "Your cart is empty" } };
  }

  const stockIssue = validCartItems.find((item) => item.quantity > item.product.stock);
  if (stockIssue) {
    return {
      error: {
        status: 400,
        message: `${stockIssue.product.name} has only ${stockIssue.product.stock} left in stock`,
      },
    };
  }

  const items = validCartItems.map((item) => {
    const price = Number(item.product.price || 0);
    const quantity = Number(item.quantity || 1);

    return {
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price,
      quantity,
      lineTotal: price * quantity,
    };
  });

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const totals = calculateTotals(subtotal, couponCode);

  return { user, items, totals };
};

const getOrderPreview = async (req, res) => {
  try {
    const result = await buildOrderFromCart(req.user._id, req.query.couponCode);

    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    return res.json({
      items: result.items,
      ...result.totals,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to preview order", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const shippingAddress = normalizeAddress(req.body.shippingAddress);

    if (!validateAddress(shippingAddress)) {
      return res.status(400).json({ message: "Please provide a complete shipping address" });
    }

    const result = await buildOrderFromCart(req.user._id, req.body.couponCode);

    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    for (const item of result.items) {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} is no longer available in the requested quantity`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      orderNumber: createOrderNumber(),
      user: req.user._id,
      items: result.items,
      shippingAddress,
      paymentMethod: req.body.paymentMethod || "cod",
      ...result.totals,
    });

    result.user.cart = [];
    await result.user.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Unable to place order", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load orders", error: error.message });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load order", error: error.message });
  }
};

module.exports = {
  getOrderPreview,
  createOrder,
  getMyOrders,
  getMyOrder,
};
