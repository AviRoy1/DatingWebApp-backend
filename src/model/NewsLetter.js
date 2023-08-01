import mongoose from "mongoose";

const newsletterSignupSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const LetterModel = mongoose.model("NewsletterSignup", newsletterSignupSchema);

export default LetterModel;
