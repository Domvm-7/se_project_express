// controllers/users.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  DEFAULT,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({
        status: CONFLICT,
        message: "User with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    const savedUser = await newUser.save();
    return res.status(CREATED).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next({
        status: BAD_REQUEST,
        message: "Invalid data passed to create user.",
      });
    }
    console.error(err);
    return next({
      status: DEFAULT,
      message: "An error occurred on the server.",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next({
        status: UNAUTHORIZED,
        message: "Invalid email or password.",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next({
        status: UNAUTHORIZED,
        message: "Invalid email or password.",
      });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return next({
      status: DEFAULT,
      message: "An error occurred on the server.",
    });
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next({ status: NOT_FOUND, message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return next({ status: DEFAULT, message: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return next({ status: NOT_FOUND, message: "User not found" });
    }
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    user = await user.save();
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next({
        status: BAD_REQUEST,
        message: "Invalid data passed to update user.",
      });
    }
    return next({
      status: DEFAULT,
      message: "An error occurred on the server.",
    });
  }
};
