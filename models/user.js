// models/user.js //

const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    select: false,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "You must enter a valid URL for the avatar",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
