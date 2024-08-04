import { uploadToS3 } from "../utils/s3_utils";
import { getVideoDuration, getVideoFormat } from "../utils/video_utils";
import { db } from "../database/sqlite";
import fs from "fs";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { Video } from "../models/videoModel";

const uploadVideo = async (file: Express.Multer.File) => {
    const tempPath = file.path;
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
    await fs.promises.unlink(tempPath);

    // Save metadata to SQLite
    const video = await Video.create({
        url: url,
        filename,
        mimetype,
        size,
        duration,
    });

    console.log("video", video);

    return url;
};

export { uploadVideo };
