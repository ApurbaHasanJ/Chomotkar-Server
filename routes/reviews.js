const express = require("express");
const {
  handleGetReviews,
  handlePostReview,
  handleDeleteReview,
  handleUpdateReview,
} = require("../controllers/reviews");
const { verifyJWT, verifyAdmin } = require("../services/auth");
const router = express.Router();

router.route("/").get(handleGetReviews).post(handlePostReview);

router
  .route("/:id")
  .delete(verifyJWT, verifyAdmin, handleDeleteReview)
  .patch(verifyJWT, verifyAdmin, handleUpdateReview);

module.exports = router;
