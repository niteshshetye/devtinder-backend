const express = require("express");

// Controllers
const authController = require("../controllers/auth");

const router = express.Router();

router
  .post("/signup", authController.signup)
  .post("/login", authController.login)
  .post("/logout", authController.logout);

module.exports = {
  authRouter: router,
};
