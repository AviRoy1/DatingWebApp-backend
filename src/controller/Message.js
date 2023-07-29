import Match from "../model/Matchs.js";
import MessageModel from "../model/Message.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getLatestMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await MessageModel.findOne({ chatId })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};
