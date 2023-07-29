import express from "express";
import {
  createChat,
  findChat,
  userChats,
  userDetails,
  findfriends,
} from "../../controller/Chat.js";
import verifytoken from "../../middlewares/verifyToken.js";
const router = express.Router();

router.post("/", createChat);
router.post("/getall", userChats);
router.get("/detail/:userId", userDetails);
router.get("/find/:firstId/:secondId", findChat);
router.get("/find/friends", verifytoken, findfriends);

export default router;
