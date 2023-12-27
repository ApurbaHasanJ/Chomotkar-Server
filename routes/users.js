const express = require("express");
const {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
} = require("../controllers/users");
const router = express.Router();

router.route("/").post(handlePostUsers).get(handleGetUsers);

router.patch("/:id", handleUserRole);

module.exports = router;
