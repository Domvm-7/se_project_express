// routes/users.js //

const express = require("express");
const router = express.Router();
const { getCurrentUser } = require("../controllers/users");
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
router.get("/me", getCurrentUser); // Only one declaration needed
router.put("/me", updateUserProfile);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
