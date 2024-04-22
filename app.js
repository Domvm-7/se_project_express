// app.js//

const express = require("express");

const mongoose = require("mongoose");

const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// Middleware to set user ID
app.use((req, res, next) => {
  // Set the user ID as required
  req.user = {
    _id: "660b2c81a1ff1ff2e2eabfb2",
  };
  next();
});

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});

const cors = require("cors");

app.use(cors());
