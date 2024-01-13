const express = require("express");
const {
  handlePostOrder,
  handlePaymentCallback,
  handleRefundOrder,
} = require("../controllers/payment");
const { bkashAuth } = require("../middleware/middleware");
const router = express.Router();

router.post("/payment", bkashAuth, handlePostOrder);
router.all("/bkash/payment/callback", bkashAuth, handlePaymentCallback);
router.get("/bkash/payment/refund/:trxID", bkashAuth, handleRefundOrder);

module.exports = router;
