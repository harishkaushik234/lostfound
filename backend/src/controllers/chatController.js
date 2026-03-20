import asyncHandler from "express-async-handler";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { Item } from "../models/Item.js";
import { ApiError } from "../utils/apiError.js";

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id
  })
    .populate("participants", "name email avatar")
    .populate("item", "title imageUrl category status")
    .sort({ updatedAt: -1 });

  res.json({ conversations });
});

export const createConversation = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  if (item.user.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot start a chat on your own item.");
  }

  const participantIds = [req.user._id, item.user];
  let conversation = await Conversation.findOne({
    item: item._id,
    participants: { $all: participantIds, $size: 2 }
  })
    .populate("participants", "name email avatar")
    .populate("item", "title imageUrl category status");

  if (!conversation) {
    conversation = await Conversation.create({
      item: item._id,
      participants: participantIds
    });

    conversation = await conversation.populate("participants", "name email avatar");
    conversation = await conversation.populate("item", "title imageUrl category status");
  }

  res.status(201).json({ conversation });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || !conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
    throw new ApiError(404, "Conversation not found.");
  }

  const messages = await Message.find({ conversation: conversation._id })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 });

  res.json({ messages });
});
