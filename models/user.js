// models/user.js //

const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Please enter a valid email address",
    },
  },
  password: { type: String, required: true, select: false },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
