const jwt = require("jsonwebtoken");

const signJwt = (payload, secret, options = {}) => {
  return jwt.sign(payload, secret, {
    expiresIn: "1h",
    ...options,
  });
};

const verifyJwt = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  signJwt,
  verifyJwt,
};
