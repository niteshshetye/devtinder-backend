const express = require("express");

const feedController = require("../controllers/feed");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.use(verifyToken);

router
  .get("/", feedController.getUserFeed)
  .get("/request/received", feedController.getReceivedRequests)
  .get("/request/connection", feedController.getConnectionRequests);

module.exports = {
  userFeedRoutes: router,
};
