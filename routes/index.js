// index.js
const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const router = express.Router();
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

// Validation schemas
const signUpSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
});

const signInSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// Routes
router.post("/signUp", signUpSchema, createUser);
router.post("/signIn", signInSchema, login);

// Apply auth middleware before routing to user and item routes
router.use("/users", userRouter);
router.use("/items", itemRouter);

// Handle 404 errors
router.use((req, res, next) => {
  next({ status: NOT_FOUND, message: "Not Found" });
});

module.exports = router;
