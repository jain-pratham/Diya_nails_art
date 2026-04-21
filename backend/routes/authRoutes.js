const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.post("/resend-verification", protect, resendVerificationEmail);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;
