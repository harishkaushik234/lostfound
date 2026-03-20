import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  req.user = user;
  next();
});
