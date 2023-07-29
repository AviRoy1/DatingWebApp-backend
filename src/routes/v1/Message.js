import express from "express";
import {
  addMessage,
  getMessages,
  getLatestMessage,
} from "../../controller/Message.js";
import verifytoken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", addMessage);
router.get("/:chatId", getMessages);
router.get("/newMessage/:chatId", getLatestMessage);
export default router;
