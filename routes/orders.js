const express = require("express");
const {
  handleGetOrders,
  handleRejectOrder,
  handleOrderStatus,
  handleGetUserOrders,
} = require("../controllers/orders");
const { verifyAdmin, verifyJWT } = require("../services/auth");
const router = express.Router();

router.route("/admin").get(verifyJWT, verifyAdmin, handleGetOrders);

router.route("/admin/:id").patch(verifyJWT, verifyAdmin, handleOrderStatus);

router.route("/user").get(handleGetUserOrders);
module.exports = router;
