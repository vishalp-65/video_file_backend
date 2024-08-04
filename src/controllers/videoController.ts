import { Request, Response, NextFunction } from "express";
import { trimVideo, uploadVideo } from "../services/video.service";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";

export const upload = catchAsync(async (req: Request, res: Response) => {
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

    const video = await uploadVideo(req.file!);
    res.status(httpStatus.OK).json(video);
});

export const trim = catchAsync(async (req: Request, res: Response) => {
    const { videoId, start, end } = req.body;

    if (!videoId || !start || !end) {
        throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
    }
    const url = await trimVideo(videoId, start, end);
    res.status(httpStatus.OK).json({ url });
});
