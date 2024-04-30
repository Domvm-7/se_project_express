const express = require("express");
const router = express.Router();
const { getCurrentUser } = require("../middlewares/auth");
const authMiddleware = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  createUser,
  login,
  updateUserProfile,
} = require("../controllers/users");

// Define routes
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware, updateUserProfile);

module.exports = router;
