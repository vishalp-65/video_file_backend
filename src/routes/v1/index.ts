import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

// Checking api is live
router.get("/info", authMiddleware, (req, res) => {
    res.status(200).json("Api is working fine");
});

export default router;
