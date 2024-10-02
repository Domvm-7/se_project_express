// utils/config.js //
const { JWT_SECRET = "your_secret_key_here" } = process.env;

module.exports = {
  JWT_SECRET,
};
