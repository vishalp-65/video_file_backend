import { Router } from "express";
import multer from "multer";
import { merge, trim, upload } from "../../controllers/videoController";

const router = Router();
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/upload", uploadMiddleware.single("video"), upload);
router.post("/trim", trim);
router.post("/merge", merge);

export default router;
