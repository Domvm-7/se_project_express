const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred on the server." });
  }
  // Add return statement
  return;
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ message: "Invalid user ID." });
    } else {
      console.error(err);
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
  // Add return statement
  return;
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      avatar: req.body.avatar,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ message: "Invalid data passed to create user." });
    } else {
      console.error(err);
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
  // Add return statement
  return;
};
