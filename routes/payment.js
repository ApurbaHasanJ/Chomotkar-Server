const express = require("express");
const {
  handlePostOrder,
  handlePaymentCallback,
  handleRefundOrder,
} = require("../controllers/payment");
const { bkashAuth } = require("../middleware/middleware");
const { verifyJWT, verifyAdmin } = require("../services/auth");
const router = express.Router();

router.post("/payment", bkashAuth, handlePostOrder);
router.all("/bkash/payment/callback", bkashAuth, handlePaymentCallback);
router.get(
  "/bkash/payment/refund/:id",
  bkashAuth,
  handleRefundOrder
);

module.exports = router;
