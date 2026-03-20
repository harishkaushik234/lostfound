import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { generateToken } from "../utils/generateToken.js";

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already in use.");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(buildAuthResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid credentials.");
  }

  res.json(buildAuthResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.name = req.body.name || user.name;
  user.bio = req.body.bio ?? user.bio;
  user.avatar = req.body.avatar ?? user.avatar;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar
    }
  });
});
