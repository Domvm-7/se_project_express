// app.js //
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { errors } = require("celebrate"); // Celebrate error handler for validation errors
const mainRouter = require("./routes/index");
const { UNAUTHORIZED } = require("./utils/errors"); // For consistent error responses
const { authMiddleware } = require("./middlewares/auth"); // Ensure correct path to auth middleware

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

// Global middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Main routes
app.use("/", mainRouter);

// Handle validation errors from celebrate
app.use(errors());

// Generic error handler for uncaught errors (optional)
app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
