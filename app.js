// app.js //

const cors = require("cors");
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
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // Replace this with your desired user ID
  };
  next();
});

app.use(express.json());
app.use(cors());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
