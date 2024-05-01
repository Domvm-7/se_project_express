// routes/users.js
const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const { updateUserProfile, getCurrentUser } = require("../controllers/users");

// Define routes

router.get("/me", authMiddleware);
router.patch("/me", authMiddleware, updateUserProfile, getCurrentUser);

module.exports = router;
