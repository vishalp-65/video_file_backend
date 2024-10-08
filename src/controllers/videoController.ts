import { Request, Response, NextFunction } from "express";
import {
    generateShareableLink,
    mergeVideos,
    trimVideo,
    uploadVideo,
} from "../services/video.service";
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
    console.log({ videoId, start, end });
    const startInt = parseInt(start);
    const endInt = parseInt(end);

    if (!videoId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "videoId is required");
    }
    if (!startInt || startInt < 0) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Invalid start time ${start}`
        );
    }
    if (!endInt) {
        throw new ApiError(httpStatus.BAD_REQUEST, "end time is required");
    }
    if (endInt < startInt) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "end time must be greater then start"
        );
    }

    const url = await trimVideo(videoId, startInt, endInt);
    res.status(httpStatus.OK).json({ url });
});

export const merge = catchAsync(async (req: Request, res: Response) => {
    const { videoIds } = req.body;
    console.log("videoIds", videoIds);

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Invalid input. Provide an array of video IDs.",
        });
    }
    const url = await mergeVideos(videoIds);
    res.status(httpStatus.OK).json({ url });
});

export const shareLink = catchAsync(async (req: Request, res: Response) => {
    const { videoId } = req.body;
    if (!videoId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Video ID is required");
    }
    const url = await generateShareableLink(videoId);
    res.status(httpStatus.OK).json({ url });
});
