import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import videoRoutes from "./videoRoutes";
import httpStatus from "http-status";

const router = Router();

router.use("/video", videoRoutes);

// Checking api is live
router.get("/info", authMiddleware, (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
