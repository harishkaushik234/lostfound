import { env } from "../config/env.js";

const ensureProtocol = (origin) => {
  if (!origin) {
    return "";
  }

  if (origin.startsWith("http://") || origin.startsWith("https://")) {
    return origin;
  }

  return `https://${origin}`;
};

const normalizeOrigin = (origin) => ensureProtocol(origin).replace(/\/+$/, "");

export const allowedOrigins = env.clientUrl
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

export const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
};
