const express = require("express");

const requestController = require("../controllers/request");

const verifyToken = require("../middlewares/verifyToken");
const sendRequestValidate = require("../middlewares/sendRequestValidate");

const router = express.Router();

router.use(verifyToken);

router.post(
  "/send/:status/:userId",
  sendRequestValidate,
  requestController.sendConnectionRequest
);

router.post(
  "/review/:status/:requestId",
  requestController.reviewConnectionRequest
);

module.exports = {
  requestRouter: router,
};
