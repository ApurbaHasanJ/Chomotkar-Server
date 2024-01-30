const express = require("express");
const {
  handleGetProducts,
  handlePostProducts,
  handleUpdateProduct,
  handleDeleteProduct,
} = require("../controllers/products");
const { verifyJWT, verifyAdmin } = require("../services/auth");
const router = express.Router();

// ger all products short by position field in ascending order
router
  .route("/")
  .get(handleGetProducts)
  .post(verifyJWT, verifyAdmin, handlePostProducts);

// update product
router.route("/:id").patch(verifyJWT, verifyAdmin, handleUpdateProduct);
// .delete(verifyJWT, verifyAdmin, handleDeleteProduct);

router.delete("/", verifyJWT, verifyAdmin, handleDeleteProduct);

module.exports = router;
