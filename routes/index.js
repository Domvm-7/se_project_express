// routes/index.js //

const express = require("express");

const { DEFAULT } = require("../utils/errors");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");

// Importing user routes
const userRouter = require("./users");

router.use("/users", userRouter);

// Importing item routes
const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);

// Middleware for handling unknown routes (404)
router.use((req, res) => {
  res.status(DEFAULT).json({ message: "Route not found" });
});

const { createUser, login, getCurrentUser } = require("../controllers/users");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Protected routes
router.get("/users/me", authMiddleware, getCurrentUser);
router.patch("/users/me", authMiddleware, updateUserProfile);

module.exports = router;
