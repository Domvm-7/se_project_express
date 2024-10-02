// routes/users.js
const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const { updateUserProfile, getCurrentUser } = require("../controllers/users");

// Validation schemas
const updateUserProfileSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
});

// Define routes
router.get("/me", authMiddleware, getCurrentUser);

router.patch("/me", authMiddleware, updateUserProfileSchema, updateUserProfile);

module.exports = router;
