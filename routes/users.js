const express = require("express");
const { handlePostUsers, handleGetUsers } = require("../controllers/users");
const router = express.Router();

router.route("/").post(handlePostUsers).get(handleGetUsers);

module.exports = router;
