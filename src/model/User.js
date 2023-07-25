import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
    // select: false,
  },
  age: {
    type: String,
    // require: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    // require: [true, "Please enter your gender"],
  },
  interestIn: {
    type: String,
    enum: ["male", "female", "other"],
    // require: true,
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  photos: [{ type: String }],
  hobbies: [{ type: String }],
  relationshipStatus: {
    type: String,
    enum: ["Single", "Marid"],
  },
  relationshipType: {
    type: String,
    enum: ["Friendship", "Long Term", "Short Term", "Casual", "Hookups"],
  },
  superLikeCount: {
    type: Number,
    default: 0,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDeactivate: {
    type: Boolean,
    default: false,
  },
  subscription: {
    id: String,
    status: {
      type: String,
      default: "inactive",
    },
    plan: { type: String, default: "0" },
  },
  createdAt: {
    type: Date,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
