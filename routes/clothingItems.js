const express = require("express");
const router = express.Router();
const ClothingItem = require("../models/clothingItems");

router.get("/", async (res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const item = new ClothingItem({
    name: req.body.name,
    weather: req.body.weather,
    imageUrl: req.body.imageUrl,
    owner: req.body.owner,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:itemId", async (req, res) => {
  try {
    const deletedItem = await ClothingItem.findByIdAndRemove(req.params.itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
