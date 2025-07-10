const express = require("express");

const profileController = require("../controllers/profile");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.use(verifyToken);

router
  .get("/", profileController.getProfile)
  .patch("/", profileController.updateProfile);

module.exports = {
  profileRouter: router,
};
