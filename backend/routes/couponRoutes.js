const express = require("express");
const { getActiveCoupons } = require("../controllers/couponController");

const router = express.Router();

router.get("/", getActiveCoupons);

module.exports = router;
