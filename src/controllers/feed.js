const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const SAFE_SELECTED_FIELDS = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "bio",
  "skills",
];

const getUserFeed = async (req, res) => {
  try {
    /**
     * i need to send user which are not connected to the logged in user
     * and also not sent a request to the logged in user
     * and also not received a request from the logged in user
     *
     *
     */

    const loggedInUserId = req.user._id;
    let { page = 1, limit = 5 } = req.query;
    limit = Math.min(50, parseInt(limit));
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { senderUserId: loggedInUserId },
        { receiverUserId: loggedInUserId },
      ],
    }).select("senderUserId receiverUserId");

    const hideUserIds = new Set();

    connectionRequests.forEach((request) => {
      hideUserIds.add(request.senderUserId.toString());
      hideUserIds.add(request.receiverUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { _id: { $nin: Array.from(hideUserIds) } },
        { isDeleted: false },
      ],
    })
      .skip(skip)
      .limit(limit)
      .select(SAFE_SELECTED_FIELDS);

    const totaUsers = await User.countDocuments({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { _id: { $nin: Array.from(hideUserIds) } },
        { isDeleted: false },
      ],
    });

    // Logic to fetch user feed goes here
    res.status(200).json({
      success: true,
      message: "User feed fetched successfully",
      totaUsers: totaUsers,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching user feed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const receivedRequests = await ConnectionRequest.find({
      receiverUserId: loggedInUserId,
      status: "interested",
    }).populate("senderUserId", SAFE_SELECTED_FIELDS);

    res.status(200).json({
      success: true,
      message: "Received requests fetched successfully",
      data: receivedRequests,
    });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getConnectionRequests = async (req, res) => {
  const loggedInUserId = req.user._id;

  try {
    const connectionRequests = await ConnectionRequest.find({
      $and: [
        { status: "accepted" },
        {
          $or: [
            { senderUserId: loggedInUserId },
            { receiverUserId: loggedInUserId },
          ],
        },
      ],
    })
      .populate("senderUserId", SAFE_SELECTED_FIELDS)
      .populate("receiverUserId", SAFE_SELECTED_FIELDS);

    const data = connectionRequests.map((request) => {
      return loggedInUserId.toString() === request.senderUserId._id.toString()
        ? request.receiverUserId
        : request.senderUserId;
    });

    res.status(200).json({
      success: true,
      message: "Connection requests fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  getUserFeed,
  getReceivedRequests,
  getConnectionRequests,
};
