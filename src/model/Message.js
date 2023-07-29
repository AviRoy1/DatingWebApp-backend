import mongoose from "mongoose";

// const messagingSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     matchId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Matchs",
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     count: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messagingSchema);

// export default Message;

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
