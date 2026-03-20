import { Router } from "express";
import {
  createConversation,
  getConversations,
  getMessages
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:id/messages", getMessages);

export default router;
