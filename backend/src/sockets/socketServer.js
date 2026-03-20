import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { allowedOrigins, isOriginAllowed } from "../utils/allowedOrigins.js";

const getTokenFromHandshake = (socket) =>
  socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];

export const initializeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (isOriginAllowed(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Socket origin not allowed: ${origin}`));
      },
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = getTokenFromHandshake(socket);
      if (!token) {
        throw new Error("Authentication token missing.");
      }

      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        throw new Error("Invalid user.");
      }

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.user._id.toString());

    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("message:send", async ({ conversationId, content }) => {
      if (!content?.trim()) {
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return;
      }

      const isParticipant = conversation.participants.some(
        (participant) => participant.toString() === socket.user._id.toString()
      );

      if (!isParticipant) {
        return;
      }

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        content: content.trim()
      });

      conversation.lastMessage = message.content;
      conversation.lastMessageAt = message.createdAt;
      await conversation.save();

      const populatedMessage = await message.populate("sender", "name email avatar");
      io.to(conversationId).emit("message:new", populatedMessage);

      conversation.participants.forEach((participantId) => {
        io.to(participantId.toString()).emit("conversation:updated", {
          conversationId,
          lastMessage: message.content,
          lastMessageAt: message.createdAt,
          senderId: socket.user._id.toString(),
          senderName: socket.user.name,
          senderAvatar: socket.user.avatar || ""
        });
      });
    });
  });

  return io;
};
