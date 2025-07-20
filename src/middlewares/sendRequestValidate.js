const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const sendRequestValidate = async (req, res, next) => {
  const { userId: receiverUserId = "", status = "" } = req.params;
  const loggedInUser = req.user;
  const senderUserId = loggedInUser._id;

  if (!receiverUserId || !senderUserId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  const allowedStatuses = ["interested", "ignore"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of ${allowedStatuses.join(", ")}`,
    });
  }

  try {
    const senderUser = await User.findById(senderUserId);

    if (!senderUser) {
      return res.status(404).json({
        success: false,
        message: "Sender user not found",
      });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { senderUserId, receiverUserId },
        { senderUserId: receiverUserId, receiverUserId: senderUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "A request already exists between these users",
      });
    }

    req.senderUserId = senderUserId;
    req.receiverUserId = receiverUserId;
    req.status = status;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while checking existing requests",
    });
  }
};

module.exports = sendRequestValidate;
