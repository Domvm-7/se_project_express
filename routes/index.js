const express = require("express");
const { DEFAULT } = require("../utils/errors");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { createUser, login, getCurrentUser } = require("../controllers/users");

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
