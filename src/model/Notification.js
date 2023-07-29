import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  message: [
    {
      text: { type: String },
      time: { type: Date },
      type: { type: String, enum: ["subscription", "like", "match"] },
    },
  ],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
