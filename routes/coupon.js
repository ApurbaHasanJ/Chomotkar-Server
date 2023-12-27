const express = require("express");
const {
  handleGetCouponCode,
  handlePostCouponCode,
} = require("../controllers/coupon");
const router = express.Router();

router.route("/").get(handleGetCouponCode).post(handlePostCouponCode);


module.exports = router