const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const { authRouter } = require("./routes/auth");
const { connectDb } = require("./config/database");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

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
