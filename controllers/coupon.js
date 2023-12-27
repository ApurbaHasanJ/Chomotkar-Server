const couponsCollection = require("../models/coupon");

const handlePostCouponCode = async (req, res) => {
  const couponDiscount = req.body;
  const result = await couponsCollection.insertOne(couponDiscount);
  res.send(result);
};

const handleGetCouponCode = async (req, res) => {
  const result = await couponsCollection.find().toArray();
  res.send(result);
};

module.exports = {
  handlePostCouponCode,
  handleGetCouponCode,
};
