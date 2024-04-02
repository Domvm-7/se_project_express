// controllers/clothingItems.js

const ClothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../utils/errors");

exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred on the server." });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = new ClothingItem({
      name: req.body.name,
      weather: req.body.weather,
      imageUrl: req.body.imageUrl,
      owner: req.user._id, // assuming temporary workaround is in place
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ message: "Invalid data passed to create item." });
    } else {
      console.error(err);
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await ClothingItem.findByIdAndRemove(req.params.itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json({ message: "Item deleted." });
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ message: "Invalid item ID." });
    } else {
      console.error(err);
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
};

exports.likeItem = async (req, res) => {
  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ message: "Invalid item ID." });
    } else {
      console.error(err);
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
};

exports.dislikeItem = async (req, res) => {
  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ message: "Invalid item ID." });
    } else {
      console.error(err);
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
};
