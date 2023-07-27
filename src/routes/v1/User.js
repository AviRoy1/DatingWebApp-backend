import express from "express";
import joi from "joi";
import {
  register,
  login,
  updateProfile,
  myprofile,
  getalluserAdmin,
  getalluser,
  deleteuser,
  addPhoto,
} from "../../controller/User.js";
import { getErrorMessage } from "../../utils/joi.util.js";
import verifytoken from "../../middlewares/verifyToken.js";

const router = express.Router();

//  SignUp
const signUpMiddleware = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required().trim(),
  password: joi.string().trim().required(),
});
router.post(
  "/signup",
  async (req, res, next) => {
    try {
      req.body = await signUpMiddleware.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }
  },
  register
);

//  LogIn
const loginMiddleware = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().trim().required(),
});
router.post(
  "/login",
  async (req, res, next) => {
    try {
      req.body = await loginMiddleware.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }
  },
  login
);

// Update profile
const updateProfileMiddleware = joi.object().keys({
  profilePic: joi.string(),
  gender: joi.string(),
  age: joi.string(),
  interestIn: joi.string(),
  location: joi.string(),
  bio: joi.string(),
  hobbies: joi.array().items(joi.string()),
  photos: joi.array().items(joi.string()),
  relationshipType: joi.string(),
  relationshipStatus: joi.string(),
  name: joi.string(),
});
router.post(
  "/profileupdate",
  verifytoken,
  async (req, res, next) => {
    try {
      req.body = await updateProfileMiddleware.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }
  },
  updateProfile
);

// My profile
router.get("/me", verifytoken, myprofile);

// add phot to My profile
const addPhotoSchema = joi.object().keys({
  photo: joi.string(),
});
router.post(
  "/addphoto",
  verifytoken,
  async (req, res, next) => {
    try {
      req.body = await addPhotoSchema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }
  },
  addPhoto
);

//  get user's profile by id;

// get all users - admin
router.get("/admin/alluser", verifytoken, getalluserAdmin);

// get all users - user
router.get("/alluser", verifytoken, getalluser);

//  delete user  -  ADMIN
const deleteUserSchema = joi.object().keys({
  id: joi.string().trim().required(),
});
router.put(
  "/admin/delete/:id",
  verifytoken,
  async (req, res, next) => {
    try {
      req.params = await deleteUserSchema.validateAsync(req.params);
      next();
    } catch (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }
  },
  deleteuser
);

export default router;
