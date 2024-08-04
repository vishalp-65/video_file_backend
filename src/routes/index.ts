import { Router } from "express";

import videoRoutes from "./v1/index";

const router = Router();

router.use("/v1", videoRoutes);

export default router;
