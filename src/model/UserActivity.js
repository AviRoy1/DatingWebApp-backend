import mongoose from "mongoose";
import validator from "validator";

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matchedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profileVisitor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    SubscriptionID: {
      type: String,
    },
    SwapCount: {
      type: Number,
      default: 0,
    },
    lastswap: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      action: {
        type: String,
        enum: ["like", "dislike", "none"],
        default: "none",
      },
    },
    MessageCount: {
      type: Number,
      default: 0,
    },
    onDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
