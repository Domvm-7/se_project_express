const User = require("../models/user");

const STATUS_DEFAULT = 500;

const STATUS_NOT_FOUND = 404;

const STATUS_BAD_REQUEST = 400;

const STATUS_CREATED = 201;

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.json(users);
  } catch (err) {
    console.error(err);

    res

      .status(STATUS_DEFAULT)

      .json({ message: "An error occurred on the server." });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(STATUS_NOT_FOUND).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(STATUS_BAD_REQUEST).json({ message: "Invalid user ID." });
    } else {
      console.error(err);

      res

        .status(STATUS_DEFAULT)

        .json({ message: "An error occurred on the server." });
    }
  }

  return null;
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,

      avatar: req.body.avatar,
    });

    const savedUser = await newUser.save();

    res.status(STATUS_CREATED).json(savedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res

        .status(STATUS_BAD_REQUEST)

        .json({ message: "Invalid data passed to create user." });
    } else {
      console.error(err);

      res

        .status(STATUS_DEFAULT)

        .json({ message: "An error occurred on the server." });
    }
  }

  return null;
};
