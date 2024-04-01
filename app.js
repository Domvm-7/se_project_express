// app.js
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.js");
const errors = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use("/", mainRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  let statusCode = errors.SERVER_ERROR;
  let message = "An error occurred on the server.";

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = errors.INVALID_DATA;
    message = "Invalid data passed.";
  } else if (err.name === "DocumentNotFoundError") {
    statusCode = errors.NOT_FOUND;
    message = "Resource not found.";
  }

  res.status(statusCode).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
