const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const {
  DEFAULT,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
} = require("../utils/errors");

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
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "User with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
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
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(DEFAULT).json({ message: "An error occurred on the server." });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(DEFAULT).json({ message: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    const allowedUpdates = ["name", "avatar"];
    const isValidOperation = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isValidOperation) {
      return res.status(BAD_REQUEST).json({ message: "Invalid updates" });
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(DEFAULT).json({ message: "Internal server error" });
  }
};
