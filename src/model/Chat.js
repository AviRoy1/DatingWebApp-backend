import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: String,
      default: "0",
    },
    TotalMessage: {
      type: Number,
      default: 10,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
