// controllers/clothingItems.js

const ClothingItem = require("../models/clothingItem");

const {
  DEFAULT,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../utils/errors"); // Importing error constants

exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res
      .status(DEFAULT) // Using imported constant for status code
      .json({ message: "An error occurred on the server." });
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
    return res.status(CREATED).json(savedItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST) // Using imported constant for status code
        .json({ message: "Invalid data passed to create item." });
    }
    console.error(err);
    return res
      .status(DEFAULT) // Using imported constant for status code
      .json({ message: "An error occurred on the server." });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await ClothingItem.findByIdAndRemove(req.params.itemId);
    if (!deletedItem) {
      return res.status(NOT_FOUND).json({ message: "Item not found." });
    }
    return res.json({ message: "Item deleted." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID." });
    }
    console.error(err);
    return res
      .status(DEFAULT) // Using imported constant for status code
      .json({ message: "An error occurred on the server." });
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
      return res.status(NOT_FOUND).json({ message: "Item not found." });
    }
    return res.json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID." });
    }
    console.error(err);
    return res
      .status(DEFAULT) // Using imported constant for status code
      .json({ message: "An error occurred on the server." });
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
      return res.status(NOT_FOUND).json({ message: "Item not found." });
    }
    return res.json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID." });
    }
    console.error(err);
    return res
      .status(DEFAULT) // Using imported constant for status code
      .json({ message: "An error occurred on the server." });
  }
};
