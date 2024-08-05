import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { STATIC_TOKEN } from "../config/serverConfig";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    if (!token) {
        return next(
            new ApiError(httpStatus.UNAUTHORIZED, "No API token provided")
        );
    }

    if (token.split(" ")[1] !== STATIC_TOKEN) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid API token"));
    }

    next();
};

export default authMiddleware;
