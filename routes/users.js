// routes/users.js
const express = require("express");

const router = express.Router();
const { getCurrentUser } = require("../middlewares/auth");
const { authMiddleware } = require("../middlewares/auth");
const {
  createUser,
  login,
  updateUserProfile,
} = require("../controllers/users");

// Define routes
router.post("/", createUser);
router.post("/login", login);
router.get("/me", authMiddleware);
router.put("/me", authMiddleware, updateUserProfile);

module.exports = router;
