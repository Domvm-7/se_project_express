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
    return next(); // Add return statement here
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

const getCurrentUser = (req, res, next) => {
  // Assuming you have a user ID stored in req.user.id after authentication
  const userId = req.user.id;

  // Fetch the user from the database using the user ID
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching user" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store the retrieved user object in req.currentUser for future use
    req.currentUser = user;

    // Call next() to proceed to the next middleware
    next();
  });
};

module.exports = { authMiddleware, getCurrentUser };
