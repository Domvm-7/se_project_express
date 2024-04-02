// controllers/clothingItems.js

const ClothingItem = require("../models/clothingItem");

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
    return res.status(201).json(savedItem); // Added return statement
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid data passed to create item." }); // Added return statement
    } else {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred on the server." }); // Added return statement
    }
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await ClothingItem.findByIdAndRemove(req.params.itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    return res.json({ message: "Item deleted." }); // Added return statement
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid item ID." }); // Added return statement
    } else {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred on the server." }); // Added return statement
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
    return res.json(updatedItem); // Added return statement
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid item ID." }); // Added return statement
    } else {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred on the server." }); // Added return statement
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
    return res.json(updatedItem); // Added return statement
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid item ID." }); // Added return statement
    } else {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred on the server." }); // Added return statement
    }
  }
};
