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
const { authorize } = require("../middlewares/auth"); // Make sure the path is correct

// Routes
router.get("/", getItems);
router.post("/", authorize, createItem);
router.delete("/:itemId", authorize, deleteItem);
router.put("/:itemId/likes", authorize, likeItem);
router.delete("/:itemId/likes", authorize, dislikeItem);

module.exports = router;
