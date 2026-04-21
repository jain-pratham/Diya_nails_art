const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumSubtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    startsAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
