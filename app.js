// app.js
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { errors } = require("celebrate"); // Celebrate error handler for validation errors
const mainRouter = require("./routes/index");
const { PORT = 3001 } = process.env;

const app = express();

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

// Centralized error handler for all uncaught errors
app.use((err, req, res, next) => {
  console.error("Internal server error:", err);

  // Default error response
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  // Send JSON response
  res.status(statusCode).json({ message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
