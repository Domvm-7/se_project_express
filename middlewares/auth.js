const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const UNAUTHORIZED = 401;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching user" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.currentUser = user;
    next();
  });

  return next();
};

module.exports = { authMiddleware, getCurrentUser };
