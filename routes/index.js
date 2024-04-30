// routes/index.js
const express = require("express");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const errors = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

// Apply auth middleware before routing to userRouter
router.use("/users", authMiddleware);
router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(errors.NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
