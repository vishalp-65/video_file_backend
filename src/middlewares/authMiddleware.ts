import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const staticApiToken = process.env.STATIC_TOKEN!;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if (!token) {
        return next(
            new ApiError(httpStatus.UNAUTHORIZED, "No API token provided")
        );
    }

    if (token !== staticApiToken) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid API token"));
    }

    next();
};

export default authMiddleware;
