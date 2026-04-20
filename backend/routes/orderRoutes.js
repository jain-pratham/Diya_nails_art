const express = require("express");
const {
  getOrderPreview,
  createOrder,
  getMyOrders,
  getMyOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/preview", getOrderPreview);
router.route("/").get(getMyOrders).post(createOrder);
router.get("/:id", getMyOrder);

module.exports = router;
