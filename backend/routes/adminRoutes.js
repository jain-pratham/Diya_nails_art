const express = require("express");
const {
  getDashboardStats,
  getAdminOrders,
  updateAdminOrder,
  uploadImages,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, admin);

router.get("/stats", getDashboardStats);
router.get("/orders", getAdminOrders);
router.put("/orders/:id", updateAdminOrder);
router.post("/uploads/images", uploadImages);

module.exports = router;
