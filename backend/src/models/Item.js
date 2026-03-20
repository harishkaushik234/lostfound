import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ["lost", "found"],
      required: true
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open"
    },
    imageUrl: {
      type: String,
      required: true
    },
    imagePublicId: {
      type: String,
      required: true
    },
    imageEmbedding: {
      type: [Number],
      default: []
    }
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", description: "text", location: "text" });

export const Item = mongoose.model("Item", itemSchema);
