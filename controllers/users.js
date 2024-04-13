const User = require("../models/user");

const {
  DEFAULT,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
} = require("../utils/errors");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(DEFAULT).json({ message: "An error occurred on the server." });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD_REQUEST).json({ message: "Invalid user ID." });
    } else {
      console.error(err);
      res.status(DEFAULT).json({ message: "An error occurred on the server." });
    }
  }
  return null;
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const savedUser = await newUser.save();
    res.status(CREATED).json(savedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data passed to create user." });
    } else {
      console.error(err);
      res.status(DEFAULT).json({ message: "An error occurred on the server." });
    }
  }
  return null;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password." });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password." });
    }

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token to client
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(DEFAULT).json({ message: "An error occurred on the server." });
  }
  return null;
};
