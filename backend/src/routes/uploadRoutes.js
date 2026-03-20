import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/image", protect, upload.single("image"), uploadImage);

export default router;
