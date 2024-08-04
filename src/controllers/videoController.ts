import { Request, Response, NextFunction } from "express";
import { uploadVideo } from "../services/video.service";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";

export const upload = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            throw new ApiError(httpStatus.BAD_REQUEST, "File not found");
        }

        const videoType = req.file.mimetype;

        // Ensure that the file is a video
        if (!videoType.startsWith("video/")) {
            throw new ApiError(
                httpStatus.UNSUPPORTED_MEDIA_TYPE,
                "File should be video"
            );
        }

        try {
            const url = await uploadVideo(req.file!);
            res.status(httpStatus.OK).json({ url });
        } catch (error: any) {
            next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
        }
    }
);
