import { uploadToS3 } from "../utils/s3_utils";
import {
    downloadFile,
    getVideoDuration,
    mergeVideoFiles,
    trimVideoFile,
} from "../utils/video_utils";
import fs from "fs";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import path from "path";
import Video from "../models/videoModel";
import { v4 as uuidv4 } from "uuid";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/s3Config";
import { AWS_S3_BUCKET } from "../config/serverConfig";

export const uploadVideo = async (file: Express.Multer.File) => {
    const tempPath = file.path;
    const duration = await getVideoDuration(tempPath); // Getting duration of video

    const { mimetype, size, filename, buffer } = file;
    // Assumes only these types are supported
    const allowedVideoTypes = [
        "video/mp4",
        "video/mkv",
        "video/avi",
        "video/mov",
    ];

    if (!allowedVideoTypes.includes(mimetype))
        throw new ApiError(
            httpStatus.UNSUPPORTED_MEDIA_TYPE,
            "Unsupported video type"
        );

    // Size and duration check
    const maxSizeMB = 25;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const maxDurationSecs = 300;

    // Handle if size and duration are exceeds limit
    if (file.size > maxSizeBytes) {
        await fs.promises.unlink(tempPath);
        throw new ApiError(httpStatus.BAD_REQUEST, "File size exceeds limit");
    }
    if (duration > maxDurationSecs) {
        await fs.promises.unlink(tempPath);
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "File duration exceeds limit"
        );
    }

    const key = `videos/${filename}`;
    // Uploading video to S3
    const url = await uploadToS3(fs.readFileSync(tempPath), key, mimetype);
    await fs.promises.unlink(tempPath); // Unlink temp path to avoid extra memory

    // Save metadata to SQLite
    const video = await Video.create({
        url: url,
        filename,
        mimetype,
        size,
        duration,
    });

    return video;
};

export const trimVideo = async (
    videoId: string,
    start: number,
    end: number
): Promise<string> => {
    // Find videoId in database
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }

    if (video.duration < end) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "End must be less then video duration"
        );
    }
    // Create a temp path for file
    const tempFilePath = path.join(__dirname, `../../temp/${video.filename}`);
    // Creating trimmed file path
    const trimmedFilePath = path.join(
        __dirname,
        `../../temp/trimmed-${video.filename}.mp4`
    );

    // Download video file from S3
    await downloadFile(video.url, tempFilePath);

    // Trimming the video
    await trimVideoFile(tempFilePath, trimmedFilePath, start, end);

    const trimmedFile = fs.readFileSync(trimmedFilePath);

    // Upload trimmed file on S3
    const url = await uploadToS3(
        trimmedFile,
        `trimmed/${video.filename}`,
        video.mimetype
    );

    // Free up memory
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(trimmedFilePath);

    return url;
};

export const mergeVideos = async (videoIds: string[]): Promise<string> => {
    // Search videoId in database
    const videos = await Video.findAll({ where: { id: videoIds } });
    if (videos.length !== videoIds.length) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "One or more videos not found"
        );
    }

    // Creating temp path array
    const tempFilePaths: string[] = [];
    for (const video of videos) {
        const tempFilePath = path.join(
            __dirname,
            `../../temp/${video.filename}`
        );
        tempFilePaths.push(tempFilePath);
        await downloadFile(video.url, tempFilePath);
    }

    const mergedFilePath = path.join(
        __dirname,
        `../../temp/merged-${uuidv4()}.mp4`
    );

    // Merge videos
    await mergeVideoFiles(tempFilePaths, mergedFilePath);

    const mergedFile = fs.readFileSync(mergedFilePath);

    // Upload merged video on S3
    const url = await uploadToS3(
        mergedFile,
        `merged-${uuidv4()}.mp4`,
        "video/mp4"
    );

    // Free up memory
    tempFilePaths.forEach((filePath) => fs.unlinkSync(filePath));
    fs.unlinkSync(mergedFilePath);

    return url;
};

export const generateShareableLink = async (
    videoId: string
): Promise<string> => {
    // Find video in database
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }

    // Get video object
    const getObjectCommand = new GetObjectCommand({
        Bucket: AWS_S3_BUCKET!,
        Key: `uploads/videos/${video.filename}`,
    });

    // Creating URL with expiry
    const signedURL = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn: 60 * 60, // By default set it to 1 hour
    });

    return signedURL;
};
