import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    lastMessage: {
      type: String,
      default: ""
    },
    lastMessageAt: {
      type: Date
    }
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, item: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
