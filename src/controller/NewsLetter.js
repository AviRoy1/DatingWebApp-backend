import LetterModel from "../model/NewsLetter.js";

export const newsLetterSignUp = async (req, res) => {
  const email = req.body.email;
  const newSignUp = new LetterModel({
    email,
  });
  try {
    const result = await newSignUp.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
