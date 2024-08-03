import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    if (!header)
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ error: "Invalid authorization" });
    const token = header.split(" ")[1];
    if (!token || token !== process.env.STATIC_TOKEN) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ error: "Unauthorized" });
    }
    next();
};

export default authMiddleware;
