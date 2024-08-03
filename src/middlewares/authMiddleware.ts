import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    if (!header)
        return res.status(401).json({ error: "Invalid authorization" });
    const token = header.split(" ")[1];
    if (!token || token !== process.env.STATIC_TOKEN) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

export default authMiddleware;
