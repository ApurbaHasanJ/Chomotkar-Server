const express = require("express");
const {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
  handleDeleteUser,
} = require("../controllers/users");
const router = express.Router();

router.route("/").post(handlePostUsers).get(handleGetUsers);

router.route("/:id").patch(handleUserRole).delete(handleDeleteUser);

module.exports = router;
