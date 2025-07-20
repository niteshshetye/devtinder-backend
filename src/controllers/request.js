const ConnectionRequest = require("../models/connectionRequest");

const sendConnectionRequest = async (req, res) => {
  const senderUserId = req.senderUserId;
  const receiverUserId = req.receiverUserId;
  const status = req.status;

  try {
    const connectionRequest = new ConnectionRequest({
      senderUserId,
      receiverUserId,
      status,
    });

    await connectionRequest.save();

    return res.status(201).json({
      success: true,
      message: "Interested request sent successfully",
      data: connectionRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the request",
      error: error.message,
    });
  }
};

const reviewAcceptedRequest = async (req, res) => {};

const reviewRejectedRequest = async (req, res) => {};

module.exports = {
  sendConnectionRequest,
  reviewAcceptedRequest,
  reviewRejectedRequest,
};
