import { uploadToS3 } from "../utils/s3_utils";
import { getVideoDuration, getVideoFormat } from "../utils/video_utils";
import { db } from "../database/sqlite";
import fs from "fs";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const uploadVideo = async (file: Express.Multer.File) => {
    const tempPath = file.path;
    const duration = await getVideoDuration(tempPath);
    const videoType = await getVideoFormat(tempPath);
    const allowedVideoTypes = [
        "video/mp4",
        "video/mkv",
        "video/avi",
        "video/mov",
    ];

    if (!allowedVideoTypes.includes(videoType))
        throw new ApiError(httpStatus.BAD_REQUEST, "Unsupported video type");

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

    const key = `videos/${file.filename}`;
    const url = await uploadToS3(fs.readFileSync(tempPath), key, videoType);
    await fs.promises.unlink(tempPath);

    // Save metadata to SQLite
    await (
        await db
    ).run("INSERT INTO videos (id, url, duration) VALUES (?, ?, ?)", [
        file.filename,
        url,
        duration,
    ]);

    return url;
};

export { uploadVideo };
