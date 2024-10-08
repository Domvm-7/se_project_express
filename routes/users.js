// routes/users.js
const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");

const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const { updateUserProfile, getCurrentUser } = require("../controllers/users");

// Validation schemas
const updateUserProfileSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
});

// Define routes
router.get("/me", authMiddleware, getCurrentUser);

router.patch("/me", authMiddleware, updateUserProfileSchema, updateUserProfile);

module.exports = router;
