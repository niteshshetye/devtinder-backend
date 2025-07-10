const User = require("../models/user");
const { validateUpdateProfileBody } = require("../validators/profile");

const getProfile = async (req, res) => {
  try {
    const user = req.user; // User is set by the verifyToken middleware

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user; // User is set by the verifyToken middleware

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const payload = await validateUpdateProfileBody(req.body);

    const { success = false, errors = {}, data = {} } = payload;

    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, data, {
      new: true,
      runValidators: true,
    }).select("-__v -_id");

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
