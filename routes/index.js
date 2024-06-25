// routes/index.js
const express = require("express");

const router = express.Router();
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const errors = require("../utils/errors");

router.post("/signUp", createUser);
router.post("/signIn", login);

// Apply auth middleware before routing to userRouter
router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(errors.NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
