import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Video from "../../models/videoModel";
import {
    generateShareableLink,
    mergeVideos,
} from "../../services/video.service";
import ApiError from "../../utils/ApiError";

// Mock dependencies
jest.mock("../../models/videoModel");
jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("../../utils/video_utils", () => ({
    downloadFile: jest.fn(),
    mergeVideoFiles: jest.fn(),
    uploadToS3: jest.fn(),
}));

describe("Video Controller", () => {
    describe("generateShareableLink", () => {
        it("should generate a shareable link for a video", async () => {
            const videoId = "387810b8-f9fc-48d2-92f3-4694b572dfd0";
            const expectedUrl = "https://example.com/uploads/video.mp4";

            (Video.findByPk as jest.Mock).mockResolvedValue({
                filename: "video.mp4",
                mimetype: "video/mp4",
            });

            (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

            const url = await generateShareableLink(videoId);
            expect(url).toBe(url);
        });

        it("should throw an error if the video is not found", async () => {
            const videoId = "9b42a96a-03e1-4690-8f52-42b93f67b4el";
            (Video.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(generateShareableLink(videoId)).rejects.toThrow(
                ApiError
            );
        });
    });

    describe("mergeVideos", () => {
        it("should merge videos and return the URL", async () => {
            const videoIds = [
                "9b42a96a-03e1-4690-8f52-42b93f67b4ee",
                "580b947e-270b-49dc-9b36-3bfc3be59ab9",
            ];
            const expectedUrl = "https://example.com/uploads/merged-video.mp4";

            (Video.findAll as jest.Mock).mockResolvedValue([
                {
                    id: videoIds[0],
                    filename: "video1.mp4",
                    url: "http://example.com/video1.mp4",
                },
                {
                    id: videoIds[1],
                    filename: "video2.mp4",
                    url: "http://example.com/video2.mp4",
                },
            ]);

            const mockDownloadFile = jest.fn().mockResolvedValue(undefined);
            const mockMergeVideoFiles = jest.fn().mockResolvedValue(undefined);
            const mockUploadToS3 = jest.fn().mockResolvedValue(expectedUrl);

            const videoUtils = require("../../utils/video_utils");
            videoUtils.downloadFile = mockDownloadFile;
            videoUtils.mergeVideoFiles = mockMergeVideoFiles;
            videoUtils.uploadToS3 = mockUploadToS3;

            const url = await mergeVideos(videoIds);
            expect(url).toBe(expectedUrl);
        });

        it("should throw an error if one or more videos are not found", async () => {
            const videoIds = [
                "9b42a96a-03e1-4690-8f52-42b93f67b4ef",
                "580b947e-270b-49dc-9b36-3bfc3be59ab9",
            ];
            (Video.findAll as jest.Mock).mockResolvedValue([]);

            await expect(mergeVideos(videoIds)).rejects.toThrow(ApiError);
        });
    });
});
