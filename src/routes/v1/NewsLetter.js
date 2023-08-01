import express from "express";
import joi from "joi";
import { getErrorMessage } from "../../utils/joi.util.js";
import { newsLetterSignUp } from "../../controller/NewsLetter.js";

const router = express.Router();

const newsLetterSignUpMW = joi.object().keys({
  email: joi.string().email().required().trim(),
});

router.post("/", newsLetterSignUp);

export default router;
