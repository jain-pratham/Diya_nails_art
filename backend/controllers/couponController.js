const Coupon = require("../models/Coupon");

const isCouponLive = (coupon) => {
  const now = new Date();
  return (
    coupon.active &&
    (!coupon.startsAt || coupon.startsAt <= now) &&
    (!coupon.expiresAt || coupon.expiresAt >= now)
  );
};

const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ active: true }).sort({ createdAt: -1 });
    return res.json(coupons.filter(isCouponLive));
  } catch (error) {
    return res.status(500).json({ message: "Unable to load coupons", error: error.message });
  }
};

module.exports = {
  getActiveCoupons,
  isCouponLive,
};
