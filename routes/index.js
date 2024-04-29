// routes/index.js //
const express = require("express");

const { DEFAULT } = require("../utils/errors"); // Utilize DEFAULT if needed
const { authMiddleware, getCurrentUser } = require("../middlewares/auth"); // Utilize authMiddleware and getCurrentUser if needed

const router = express.Router();

// Importing user controllers
const { createUser, login } = require("../controllers/users");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Importing user routes
const userRouter = require("./users");
router.use("/users", userRouter);

// Importing item routes
const itemRouter = require("./clothingItems");
router.use("/items", itemRouter);

// Middleware for handling unknown routes (404)
router.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
