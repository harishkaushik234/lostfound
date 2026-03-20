import asyncHandler from "express-async-handler";
import { Item } from "../models/Item.js";
import { ApiError } from "../utils/apiError.js";
import { createImageEmbedding, rankSimilarItems } from "../services/imageSimilarityService.js";
import { deleteCloudinaryAsset } from "../services/uploadService.js";

const buildItemFilters = (query) => {
  const filters = {};

  if (query.category && ["lost", "found"].includes(query.category)) {
    filters.category = query.category;
  }

  if (query.status && ["open", "resolved"].includes(query.status)) {
    filters.status = query.status;
  }

  if (query.location) {
    filters.location = { $regex: query.location, $options: "i" };
  }

  if (query.keyword) {
    filters.$or = [
      { title: { $regex: query.keyword, $options: "i" } },
      { description: { $regex: query.keyword, $options: "i" } }
    ];
  }

  return filters;
};

export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find(buildItemFilters(req.query))
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });

  res.json({ items });
});

export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate("user", "name email avatar bio");

  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  const candidates = await Item.find({
    _id: { $ne: item._id },
    category: item.category === "lost" ? "found" : "lost",
    status: "open",
    imageEmbedding: { $exists: true, $ne: [] }
  }).populate("user", "name email avatar");

  const matches = item.imageEmbedding?.length ? rankSimilarItems(item, candidates) : [];
  res.json({ item, matches });
});

export const createItem = asyncHandler(async (req, res) => {
  const { title, description, location, category, imageUrl, imagePublicId } = req.body;

  if (!title || !description || !location || !category || !imageUrl || !imagePublicId) {
    throw new ApiError(400, "All item fields including image are required.");
  }

  const imageEmbedding = await createImageEmbedding(imageUrl);

  const item = await Item.create({
    user: req.user._id,
    title,
    description,
    location,
    category,
    imageUrl,
    imagePublicId,
    imageEmbedding
  });

  const populatedItem = await item.populate("user", "name email avatar");
  res.status(201).json({ item: populatedItem });
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  if (item.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own posts.");
  }

  const hasImageChange =
    req.body.imageUrl &&
    req.body.imagePublicId &&
    (req.body.imageUrl !== item.imageUrl || req.body.imagePublicId !== item.imagePublicId);

  if (hasImageChange) {
    await deleteCloudinaryAsset(item.imagePublicId);
    item.imageUrl = req.body.imageUrl;
    item.imagePublicId = req.body.imagePublicId;
    item.imageEmbedding = await createImageEmbedding(req.body.imageUrl);
  }

  item.title = req.body.title || item.title;
  item.description = req.body.description || item.description;
  item.location = req.body.location || item.location;
  item.category = req.body.category || item.category;
  item.status = req.body.status || item.status;

  await item.save();
  const populatedItem = await item.populate("user", "name email avatar");
  res.json({ item: populatedItem });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  if (item.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own posts.");
  }

  await deleteCloudinaryAsset(item.imagePublicId);
  await item.deleteOne();
  res.json({ message: "Item deleted successfully." });
});

export const getUserItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user._id })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });

  res.json({ items });
});

export const getSimilarityMatches = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  const candidates = await Item.find({
    _id: { $ne: item._id },
    category: item.category === "lost" ? "found" : "lost",
    status: "open",
    imageEmbedding: { $exists: true, $ne: [] }
  }).populate("user", "name email avatar");

  res.json({ matches: rankSimilarItems(item, candidates) });
});
