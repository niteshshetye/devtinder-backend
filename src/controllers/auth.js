const User = require("../models/user");
const { validateSignupBody, validateLoginBody } = require("../validators/auth");

const signup = async (req, res) => {
  const {
    success = false,
    errors = [],
    data = {},
  } = await validateSignupBody(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }

  const user = new User(data);

  try {
    await user.save();
    const token = user.generateJwtToken();

    res.cookie("session_token", token, {
      httpOnle: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const loggedInUser = { ...user.toObject(), password: undefined }; // Exclude password from response

    return res.status(200).json({
      data: loggedInUser,
      message: "User Created Succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const login = async (req, res) => {
  const {
    success = false,
    errors = [],
    data = {},
  } = await validateLoginBody(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      errors: errors,
    });
  }

  const user = await User.findOne({
    emailId: data.emailId,
  }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordValid = await user.validatePassword(data.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const token = await user.generateJwtToken();

  res.cookie("session_token", token, {
    httpOnle: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  const loggedInUser = { ...user.toObject(), password: undefined }; // Exclude password from response

  return res
    .status(200)
    .json({ data: loggedInUser, message: "Login Successful", success: true });
};

const logout = async (req, res) => {
  res.cookie("session_token", null, {
    expires: new Date(Date.now()), // Set cookie to expire immediately
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
