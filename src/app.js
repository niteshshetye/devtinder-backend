const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { authRouter } = require("./routes/auth");
const { userFeedRoutes } = require("./routes/feed");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");

const verifyToken = require("./middlewares/verifyToken");

const { connectDb } = require("./config/database");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/user/feed", userFeedRoutes);

app.get("/", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the User Management API",
  });
});

const startProcess = async () => {
  try {
    await connectDb();
    console.log("Database connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the process:", error);
    process.exit(1);
  }
};

startProcess();
