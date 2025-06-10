// backend/middleware/index.js
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignup");
const verifyRoles = require("./verifyRoles"); // Убедитесь, что verifyRoles.js существует

module.exports = {
  authJwt,
  verifySignUp,
  verifyRoles // Экспортируем verifyRoles
};
