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
      message: status === 'interested' ? "Request Send Successfully" : "Ignored successfully",
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

const reviewConnectionRequest = async (req, res) => {
  const { requestId = "", status = "" } = req.params;
  const receiverUserId = req.user._id;

  if (!requestId || !status) {
    return res.status(400).json({
      success: false,
      message: "Request ID and status are required",
    });
  }

  const allowedStatuses = ["accepted", "rejected"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of ${allowedStatuses.join(", ")}`,
    });
  }

  try {
    const existingRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: { $eq: "interested" },
      receiverUserId,
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    existingRequest.status = status;
    await existingRequest.save();

    return res.status(200).json({
      success: true,
      message: `Request has been ${status}`,
      data: existingRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while reviewing the request",
    });
  }
};

module.exports = {
  sendConnectionRequest,
  reviewConnectionRequest,
};
