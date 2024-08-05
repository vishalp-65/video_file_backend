import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import ApiError from "./ApiError";
import httpStatus from "http-status";
import axios from "axios";
import fs from "fs";
import path from "path";
import { ensureDirectoryExists } from "../validation/validatePath";

// Set the path to the ffprobe binary
// ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Only for window(My local machine)
ffmpeg.setFfprobePath(ffprobeStatic.path);

export const getVideoDuration = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error("Error executing ffprobe:", err);
                return reject(
                    new ApiError(
                        httpStatus.EXPECTATION_FAILED,
                        `ffprobe error: ${err.message}`
                    )
                );
            }
            if (!metadata || !metadata.format) {
                return reject(
                    new ApiError(
                        httpStatus.UNSUPPORTED_MEDIA_TYPE,
                        "Invalid metadata returned by ffprobe"
                    )
                );
            }
            resolve(metadata.format.duration!);
        });
    });
};

export const getVideoFormat = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            const format = metadata?.format?.format_name;
            if (!format)
                return reject(
                    new ApiError(
                        httpStatus.UNSUPPORTED_MEDIA_TYPE,
                        "Unable to determine video format"
                    )
                );
            resolve(format);
        });
    });
};

export const trimVideoFile = async (
    inputPath: string,
    outputPath: string,
    start: number,
    end: number
): Promise<void> => {
    try {
        console.log("Starting trim operation");

        // Ensure directory exists
        ensureDirectoryExists(outputPath);
        ensureDirectoryExists(inputPath);

        return await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .setStartTime(start)
                .setDuration(end - start)
                .output(outputPath)
                .on("end", () => {
                    console.log("Trim operation completed");
                    resolve();
                })
                .on("error", (err) => {
                    console.error("FFmpeg error:", err);
                    reject(
                        new ApiError(
                            httpStatus.INTERNAL_SERVER_ERROR,
                            "Unable to trim video"
                        )
                    );
                })
                .run();
        });
    } catch (error) {
        console.error("Caught error:", error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Unable to trim video"
        );
    }
};

export const downloadFile = async (
    url: string,
    destPath: string
): Promise<void> => {
    try {
        // Create the directory if it doesn't exist
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(destPath, Buffer.from(response.data));
    } catch (error) {
        console.log("error", error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "can't get video from S3"
        );
    }
};

export const mergeVideoFiles = (
    inputPaths: string[],
    outputPath: string
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const ffmpegCommand = ffmpeg();
        inputPaths.forEach((filePath) => ffmpegCommand.input(filePath));
        ffmpegCommand
            .on("end", () => resolve())
            .on("error", (err) => {
                console.error("Merge error:", err);
                reject(
                    new ApiError(
                        httpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to merge video"
                    )
                );
            })
            .mergeToFile(outputPath, "./temp");
    });
};
