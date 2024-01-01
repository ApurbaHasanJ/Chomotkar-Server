const express = require("express");
const {
  handlePostOrder,
  handlePostSuccessOrder,
  handleDeleteFailedOrder,
} = require("../controllers/payment");
const { verifyJWT, verifyAdmin } = require("../services/auth");
const router = express.Router();

router.post("/", handlePostOrder);

router.post("/payment/success/:tranId", handlePostSuccessOrder);

router.post("/payment/failed/:tranId", handleDeleteFailedOrder);

module.exports = router;
