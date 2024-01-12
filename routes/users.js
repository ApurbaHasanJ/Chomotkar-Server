const express = require("express");
const {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
  handleDeleteUser,
  handleGetAdmin,
  handleUpdateUserInfo,
} = require("../controllers/users");
const { verifyJWT, verifyAdmin } = require("../services/auth");
const router = express.Router();

router.post("/", handlePostUsers);

router.get("/", verifyJWT, handleGetUsers);
router.patch("/info/:id", verifyJWT, handleUpdateUserInfo);

// check admin
router.get("/admin/:email", verifyJWT, handleGetAdmin);

router
  .route("/:id")
  .patch(verifyJWT, verifyAdmin, handleUserRole)
  .delete(verifyJWT, verifyAdmin, handleDeleteUser);

module.exports = router;
