const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const createRawToken = () => crypto.randomBytes(32).toString("hex");
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const buildAuthResponse = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  isEmailVerified: user.isEmailVerified,
  phone: user.phone,
  wishlist: user.wishlist,
  addresses: user.addresses,
  token: generateToken(user._id),
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    return res.json({ message: "Please add all fields" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return res.json({ message: "User already exists" });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  const verificationToken = createRawToken();
  user.emailVerificationToken = hashToken(verificationToken);
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  if (user) {
    const payload = buildAuthResponse(user);
    if (process.env.NODE_ENV !== "production") {
      payload.verificationToken = verificationToken;
    }
    res.status(201).json(payload);
  } else {
    res.status(400);
    return res.json({ message: "Invalid user data" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json(buildAuthResponse(user));
  } else {
    res.status(401);
    return res.json({ message: "Invalid credentials" });
  }
};

// @desc    Get user data
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      wishlist: user.wishlist,
      addresses: user.addresses,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isEmailVerified: updatedUser.isEmailVerified,
      phone: updatedUser.phone,
      wishlist: updatedUser.wishlist,
      addresses: updatedUser.addresses,
      token: generateToken(updatedUser._id),
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    return res.json(user?.wishlist || []);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load wishlist", error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    if (!user.wishlist.some((id) => String(id) === productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate("wishlist");
    return res.json(user.wishlist);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update wishlist", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => String(id) !== productId);
    await user.save();
    await user.populate("wishlist");
    return res.json(user.wishlist);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update wishlist", error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If the email exists, a reset link has been generated." });
    }

    const resetToken = createRawToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const payload = { message: "Password reset link generated." };
    if (process.env.NODE_ENV !== "production") {
      payload.resetToken = resetToken;
    }

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: "Unable to request password reset", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = String(req.body.token || "");
    const password = String(req.body.password || "");

    if (!token || password.length < 6) {
      return res.status(400).json({ message: "A valid token and 6+ character password are required" });
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or expired" });
    }

    user.password = password;
    user.passwordResetToken = "";
    user.passwordResetExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to reset password", error: error.message });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isEmailVerified) {
      return res.json({ message: "Email is already verified" });
    }

    const verificationToken = createRawToken();
    user.emailVerificationToken = hashToken(verificationToken);
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const payload = { message: "Verification link generated." };
    if (process.env.NODE_ENV !== "production") {
      payload.verificationToken = verificationToken;
    }

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: "Unable to generate verification link", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = String(req.body.token || "");
    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Verification token is invalid or expired" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = "";
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to verify email", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  requestPasswordReset,
  resetPassword,
  resendVerificationEmail,
  verifyEmail,
};
