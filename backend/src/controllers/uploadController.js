import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { uploadBufferToCloudinary } from "../services/uploadService.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Image file is required.");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer);

  res.status(201).json({
    imageUrl: result.secure_url,
    imagePublicId: result.public_id
  });
});
