const express = require("express");
const {
  handleGetProducts,
  handlePostProducts,
} = require("../controllers/products");
const router = express.Router();

// ger all products short by position field in ascending order
router.route("/").get(handleGetProducts).post(handlePostProducts);

module.exports = router;
