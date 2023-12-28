const express = require("express");
const {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
  handleDeleteUser,
} = require("../controllers/users");
const { verifyJWT } = require("../services/auth");
const router = express.Router();

// Apply the verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/").post(handlePostUsers).get(handleGetUsers);

router.route("/:id").patch(handleUserRole).delete(handleDeleteUser);

module.exports = router;
