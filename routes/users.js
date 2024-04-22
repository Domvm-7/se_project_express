// routes/users.js
const express = require("express");

const router = express.Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

module.exports = router;
