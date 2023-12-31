const express = require("express");
const {
  handlePostOrder,
  handlePostSuccessOrder,
  handlePostFailedOrder,
} = require("../controllers/payment");
const router = express.Router();

router.post("/", handlePostOrder);

router.post("/payment/success/:tranId", handlePostSuccessOrder);

router.post("/payment/failed/:tranId", handlePostFailedOrder);

module.exports = router;
