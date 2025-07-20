const ConnectionRequest = require("../models/connectionRequest");

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
    // Logic to fetch user feed goes here
    res.status(200).json({
      success: true,
      message: "User feed fetched successfully",
      data: [], // Replace with actual feed data
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
