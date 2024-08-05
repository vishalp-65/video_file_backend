import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import httpStatus from "http-status";
import { trimVideoFile } from "../../utils/video_utils";
import ApiError from "../../utils/ApiError";
import { ensureDirectoryExists } from "../../validation/validatePath";

jest.mock("fs");
jest.mock("fluent-ffmpeg");

describe("Video Utils", () => {
    describe("ensureDirectoryExists", () => {
        const filePath = "path/to/file.txt";

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should create directory if it does not exist", () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            ensureDirectoryExists(filePath);

            expect(fs.existsSync).toHaveBeenCalledWith(path.dirname(filePath));
            expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(filePath), {
                recursive: true,
            });
        });

        it("should not create directory if it already exists", () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);

            ensureDirectoryExists(filePath);

            expect(fs.existsSync).toHaveBeenCalledWith(path.dirname(filePath));
            expect(fs.mkdirSync).not.toHaveBeenCalled();
        });
    });

    describe("trimVideoFile", () => {
        const inputPath = "path/to/input.mp4";
        const outputPath = "path/to/output.mp4";
        const start = 60;
        const end = 120;

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should trim the video file correctly", async () => {
            const mockFfmpeg = {
                setStartTime: jest.fn().mockReturnThis(),
                setDuration: jest.fn().mockReturnThis(),
                output: jest.fn().mockReturnThis(),
                on: jest.fn().mockReturnThis(),
                run: jest.fn(),
            };

            (ffmpeg as any).mockReturnValue(mockFfmpeg);

            mockFfmpeg.on
                .mockImplementationOnce((event, callback) => {
                    if (event === "end") {
                        callback();
                    }
                    return mockFfmpeg;
                })
                .mockImplementationOnce((event, callback) => {
                    if (event === "error") {
                        callback(new Error("ffmpeg error"));
                    }
                    return mockFfmpeg;
                });

            await trimVideoFile(inputPath, outputPath, start, end);

            expect(ffmpeg).toHaveBeenCalledWith(inputPath);
            expect(mockFfmpeg.setStartTime).toHaveBeenCalledWith(start);
            expect(mockFfmpeg.setDuration).toHaveBeenCalledWith(end - start);
            expect(mockFfmpeg.output).toHaveBeenCalledWith(outputPath);
            expect(mockFfmpeg.on).toHaveBeenCalledWith(
                "end",
                expect.any(Function)
            );
            expect(mockFfmpeg.on).toHaveBeenCalledWith(
                "error",
                expect.any(Function)
            );
            expect(mockFfmpeg.run).toHaveBeenCalled();
        });

        it("should throw an error if ffmpeg fails", async () => {
            const mockFfmpeg = {
                setStartTime: jest.fn().mockReturnThis(),
                setDuration: jest.fn().mockReturnThis(),
                output: jest.fn().mockReturnThis(),
                on: jest.fn().mockReturnThis(),
                run: jest.fn(),
            };

            (ffmpeg as any).mockReturnValue(mockFfmpeg);

            mockFfmpeg.on.mockImplementationOnce((event, callback) => {
                if (event === "error") {
                    callback(new Error("ffmpeg error"));
                }
                return mockFfmpeg;
            });

            await expect(
                trimVideoFile(inputPath, outputPath, start, end)
            ).rejects.toThrow(
                new ApiError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to trim video"
                )
            );
        });
    });
});
