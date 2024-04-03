const express = require("express");

const { DEFAULT } = require("../utils/errors");

const router = express.Router();

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

module.exports = router;
