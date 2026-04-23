const express = require("express");
const {
  createProductReview,
  getProductReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", protect, createProductReview);

module.exports = router;
