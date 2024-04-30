//routes/index.js//
const express = require("express");

const { authMiddleware, getCurrentUser } = require("../middlewares/auth"); // Importing from middlewares.js

const router = express.Router();

const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const errors = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", authMiddleware, getCurrentUser, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(errors.NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
