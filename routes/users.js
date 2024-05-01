// routes/users.js
const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const { createUser, updateUserProfile } = require("../controllers/users");

// Define routes
router.post("/", createUser);
router.get("/me", authMiddleware);
router.patch("/me", authMiddleware, updateUserProfile);

module.exports = router;
