const Product = require("../models/Product");
const User = require("../models/User");

const populateCart = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "cart.product",
    select: "name slug price images description stock tags",
  });

  if (!user) {
    return null;
  }

  user.cart = user.cart.filter((item) => item.product);
  await user.save();

  const items = user.cart.map((item) => {
    const product = item.product;
    const quantity = item.quantity;
    const lineTotal = Number(product.price || 0) * quantity;

    return {
      product,
      quantity,
      lineTotal,
    };
  });

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return {
    items,
    subtotal,
    itemCount,
  };
};

const getCart = async (req, res) => {
  try {
    const cart = await populateCart(req.user._id);

    if (!cart) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load cart", error: error.message });
  }
};

const addCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = Math.max(1, Number(req.body.quantity) || 1);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity = Math.min(product.stock, existingItem.quantity + quantity);
    } else {
      user.cart.push({
        product: productId,
        quantity: Math.min(product.stock, quantity),
      });
    }

    await user.save();

    const cart = await populateCart(req.user._id);
    return res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Unable to add item to cart", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (!existingItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    existingItem.quantity = Math.min(product.stock, quantity);
    await user.save();

    const cart = await populateCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update cart item", error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    await user.save();

    const cart = await populateCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Unable to remove cart item", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    return res.json({ items: [], subtotal: 0, itemCount: 0 });
  } catch (error) {
    return res.status(500).json({ message: "Unable to clear cart", error: error.message });
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
};
