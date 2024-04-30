// utils/errors.js

// Define constants for HTTP status codes
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const CREATED = 201;
const DEFAULT = 500;
const UNAUTHORIZED = 401;

// Secret key for JWT token
const JWT_SECRET = "your_secret_key_here";

module.exports = {
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  DEFAULT,
  UNAUTHORIZED,
  JWT_SECRET,
};
