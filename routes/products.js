const express = require("express");
const {
  handleGetProducts,
  handlePostProducts,
  handleUpdateProduct,
  handleDeleteProduct,
} = require("../controllers/products");
const router = express.Router();

// ger all products short by position field in ascending order
router.route("/").get(handleGetProducts).post(handlePostProducts);

// update product
router.route("/:id").patch(handleUpdateProduct).delete(handleDeleteProduct);

module.exports = router;
