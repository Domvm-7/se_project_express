// controllers/users.js //
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  DEFAULT,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CONFLICT)
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
    // Return user without password
    return res.status(CREATED).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data passed to create user." });
    }
    console.error(err);
    return res
      .status(DEFAULT)
      .json({ message: "An error occurred on the server." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid email or password." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token }); // Added return statement
  } catch (err) {
    console.error(err);
    return res
      .status(DEFAULT)
      .json({ message: "An error occurred on the server." });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    return res.json(user); // Added return statement
  } catch (err) {
    return res.status(DEFAULT).json({ message: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    // Update user properties
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;

    // Save the updated user
    user = await user.save();
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data passed to update user." });
    }
    return res
      .status(DEFAULT)
      .json({ message: "An error occurred on the server." });
  }
};
