import ChatModel from "../model/Chat.js";
import User from "../model/User.js";
import UserActivity from "../model/UserActivity.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userDetails = async (req, res) => {
  const id = req.params.userId;
  try {
    const details = await User.findOne({ _id: id }, { name: 1, profilePic: 1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findfriends = async (req, res) => {
  try {
    const me = await User.findById(req.body.id);
    let userActivity = await UserActivity.findOne({ userId: me._id });
    if (!userActivity) {
      userActivity = await UserActivity.create({ userId: me._id });
    }

    return res.status(200).json({ friends: userActivity.matchedUsers });
  } catch (error) {
    res.status(500).json(error);
  }
};
