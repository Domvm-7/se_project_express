// routes/index.js
const express = require("express");
const router = express.Router();

// Importing user routes
const userRouter = require("./users");
router.use("/users", userRouter);

// Importing item routes
const itemRouter = require("./clothingItems");
router.use("/items", itemRouter);

// Middleware for handling unknown routes (404)
router.use((req, res) => {
  res.status(404).send("Route not found");
});

module.exports = router;
