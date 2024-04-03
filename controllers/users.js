const User = require("../models/user");

const { DEFAULT, NOT_FOUND, BAD_REQUEST, CREATED } = require("../utils/errors");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(DEFAULT).json({ message: "An error occurred on the server." });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD_REQUEST).json({ message: "Invalid user ID." });
    } else {
      console.error(err);
      res.status(DEFAULT).json({ message: "An error occurred on the server." });
    }
  }
  return null;
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      avatar: req.body.avatar,
    });
    const savedUser = await newUser.save();
    res.status(CREATED).json(savedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data passed to create user." });
    } else {
      console.error(err);
      res.status(DEFAULT).json({ message: "An error occurred on the server." });
    }
  }
  return null;
};
