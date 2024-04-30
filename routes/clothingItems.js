// routes/clothingItems.js //

const express = require("express");

const router = express.Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Middleware for authorization
const { authMiddleware } = require("../middlewares/auth"); // Make sure the path is correct

// Routes
router.get("/", getItems);
router.post("/", authMiddleware, createItem);
router.delete("/:itemId", authMiddleware, deleteItem);
router.put("/:itemId/likes", authMiddleware, likeItem);
router.delete("/:itemId/likes", authMiddleware, dislikeItem);

module.exports = router;
