const express = require("express");
const { handleGetOrders } = require("../controllers/orders");
const { verifyAdmin, verifyJWT } = require("../services/auth");
const router = express.Router();

router.route("/admin").get(verifyJWT, verifyAdmin, handleGetOrders);
module.exports = router;
