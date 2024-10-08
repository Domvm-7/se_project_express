// routes/clothingItems.js
const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");

const router = express.Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authMiddleware } = require("../middlewares/auth");

// Validation schemas
const itemIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const createItemSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().uri().required(),
  }),
});

// Routes
router.get("/", getItems);

router.post("/", authMiddleware, createItemSchema, createItem);

router.delete("/:itemId", authMiddleware, itemIdSchema, deleteItem);

router.put("/:itemId/likes", authMiddleware, itemIdSchema, likeItem);

router.delete("/:itemId/likes", authMiddleware, itemIdSchema, dislikeItem);

module.exports = router;
