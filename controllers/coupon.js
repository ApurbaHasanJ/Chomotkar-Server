const { ObjectId } = require("mongodb");
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

const handleDeleteCouponCode = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const filter = { _id: new ObjectId(id) };
  // console.log(filter);
  const result = await couponsCollection.deleteOne(filter);
  res.send(result);
};

module.exports = {
  handlePostCouponCode,
  handleGetCouponCode,
  handleDeleteCouponCode,
};
