import mongoose from "mongoose";
import validator from "validator";

const matchSchema = new mongoose.Schema(
  {
    user1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    user2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    user1Swiped: {
      type: String,
      enum: ["like", "dislike", "superlike", ""],
      default: "",
    },
    user2Swiped: {
      type: String,
      enum: ["like", "dislike", "superlike", ""],
      default: "",
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
