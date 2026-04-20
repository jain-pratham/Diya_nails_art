const express = require("express");
const {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).delete(clearCart);
router.route("/items").post(addCartItem);
router.route("/items/:productId").put(updateCartItem).delete(removeCartItem);

module.exports = router;
