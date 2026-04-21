const express = require("express");
const {
  getOrderPreview,
  createOrder,
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed,
  getMyOrders,
  getMyOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/preview", getOrderPreview);
router.post("/payment-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
router.post("/payment-failure", markPaymentFailed);
router.route("/").get(getMyOrders).post(createOrder);
router.get("/:id", getMyOrder);

module.exports = router;
