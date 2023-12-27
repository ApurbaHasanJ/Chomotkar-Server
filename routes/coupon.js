const express = require("express");
const {
  handleGetCouponCode,
  handlePostCouponCode,
  handleDeleteCouponCode,
} = require("../controllers/coupon");
const router = express.Router();

router.route("/").get(handleGetCouponCode).post(handlePostCouponCode);

router.delete("/:id", handleDeleteCouponCode);

module.exports = router;
