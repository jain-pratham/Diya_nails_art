const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await Coupon.updateOne(
      { code: "WELCOME15" },
      {
        $setOnInsert: {
          code: "WELCOME15",
          percent: 15,
          minimumSubtotal: 999,
          active: true,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
