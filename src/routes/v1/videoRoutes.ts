import { Router } from "express";
import multer from "multer";
import { upload } from "../../controllers/videoController";

const router = Router();
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/upload", uploadMiddleware.single("video"), upload);

export default router;
