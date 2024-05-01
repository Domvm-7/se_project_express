// middlewares/auth.js //
const jwt = require("jsonwebtoken");
const { JWT_SECRET, UNAUTHORIZED } = require("../utils/config");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
  return next();
};

module.exports = { authMiddleware };
