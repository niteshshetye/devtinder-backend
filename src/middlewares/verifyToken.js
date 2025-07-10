const User = require("../models/user");
const { verifyJwt } = require("../utils");

const verifyToken = async (req, res, next) => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session token provided",
    });
  }

  try {
    const decoded = verifyJwt(sessionToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session token",
      });
    }

    const userId = decoded._id; // Extract user ID from the decoded token

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session token",
      });
    }

    const user = await User.findById(userId).select("-__v");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid session token" });
  }
};

module.exports = verifyToken;
