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

export const uploadVideo = async (file: Express.Multer.File) => {
    const tempPath = file.path;
    console.log("tempPath", tempPath);
    const duration = await getVideoDuration(tempPath);

    const { mimetype, size, filename, buffer } = file;
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
    const url = await uploadToS3(fs.readFileSync(tempPath), key, mimetype);
    console.log("url", url);
    await fs.promises.unlink(tempPath);

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
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }

    const tempFilePath = path.join(__dirname, `../../temp/${video.filename}`);
    const trimmedFilePath = path.join(
        __dirname,
        `../../temp/trimmed-${video.filename}`
    );

    await downloadFile(video.url, tempFilePath);
    console.log("file downloaded");

    await trimVideoFile(tempFilePath, trimmedFilePath, start, end);
    console.log("file trimmed");

    const trimmedFile = fs.readFileSync(trimmedFilePath);
    const url = await uploadToS3(trimmedFile, video.filename, video.mimetype);
    console.log("url", url);

    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(trimmedFilePath);

    return url;
};

export const mergeVideos = async (videoIds: string[]): Promise<string> => {
    const videos = await Video.findAll({ where: { id: videoIds } });
    if (videos.length !== videoIds.length) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "One or more videos not found"
        );
    }

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

    await mergeVideoFiles(tempFilePaths, mergedFilePath);

    const mergedFile = fs.readFileSync(mergedFilePath);
    const url = await uploadToS3(
        mergedFile,
        `merged-${uuidv4()}.mp4`,
        "video/mp4"
    );

    tempFilePaths.forEach((filePath) => fs.unlinkSync(filePath));
    fs.unlinkSync(mergedFilePath);

    return url;
};
