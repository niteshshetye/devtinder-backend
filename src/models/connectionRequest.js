const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender user ID is required"],
    },
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver user ID is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignore", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      required: [true, "Status is required"],
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure uniqueness of connection requests
// between two users, regardless of the order of sender and receiver
connectionRequestSchema.index({ senderUserId: 1, receiverUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.senderUserId.equals(connectionRequest.receiverUserId)) {
    return next(new Error("You cannot send a request to yourself"));
  }

  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
