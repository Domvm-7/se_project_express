// middlewares/auth.js//

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const UNAUTHORIZED = 401;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

const getCurrentUser = (req, res, next) => {
  // Implement your logic to get the current user
  // For example, you might fetch the user from the database using req.user.id
  // Once you have the user, you can attach it to req.currentUser
  // For now, let's just call next() to proceed
  next();
};

module.exports = { authMiddleware, getCurrentUser };
