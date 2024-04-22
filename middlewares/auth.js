// middlewares/auth.js

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    // Token is missing, return 401 Unauthorized
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET);
    // Add the token payload to the request object
    req.user = payload;
    // Call next middleware
    next();
  } catch (err) {
    // Token verification failed, return 401 Unauthorized
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
