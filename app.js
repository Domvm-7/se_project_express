// app.js
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { errors } = require("celebrate");
const morgan = require("morgan");
const winston = require("winston");
const mainRouter = require("./routes/index");
const { PORT = 3001 } = process.env;
const app = express();

// Set up Winston logger for application logs and errors
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// If in development, log to the console as well
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    logger.info("Connected to DB");
  })
  .catch((err) => {
    logger.error("Error connecting to DB:", err);
  });

// Global middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Log all HTTP requests using morgan
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Main routes
app.use("/", mainRouter);

// Handle validation errors from celebrate
app.use(errors());

// Centralized error handler for uncaught errors
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`, { stack: err.stack });

  // Default error response
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  // Send JSON response
  res.status(statusCode).json({ message });

  // Call next to avoid eslint errors or to allow further handling
  next();
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
