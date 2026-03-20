import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  getSimilarityMatches,
  getUserItems,
  updateItem
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getItems);
router.get("/me/list", protect, getUserItems);
router.get("/:id", getItemById);
router.get("/:id/matches", getSimilarityMatches);
router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

export default router;
