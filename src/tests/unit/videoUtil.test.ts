// src/tests/unit/videoUtils.test.ts

import { v4 as uuidv4 } from "uuid";
import { mockVideos, mockTrimmedVideo } from "../mockData";
import Video from "../../models/videoModel";
import {
    generateShareableLink,
    mergeVideos,
    trimVideo,
} from "../../services/video.service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_S3_BUCKET } from "../../config/serverConfig";

jest.mock("../../models/videoModel");
jest.mock("../../models/videoModel");
jest.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: jest.fn(),
}));

describe("mergeVideos", () => {
    it("should merge videos and return a URL", async () => {
        const videoIds = [mockVideos[0].id, mockVideos[1].id];

        (Video.findAll as jest.Mock).mockResolvedValue(mockVideos);

        const url = await mergeVideos(videoIds);

        expect(url).toContain("merged-video.mp4");
    });

    it("should throw an error if one or more videos are not found", async () => {
        const videoIds = [uuidv4(), uuidv4()];

        (Video.findAll as jest.Mock).mockResolvedValue([]);

        await expect(mergeVideos(videoIds)).rejects.toThrow(
            "One or more videos not found"
        );
    });
});

describe("trimVideo", () => {
    it("should trim the video and return a URL", async () => {
        const videoId = mockTrimmedVideo.id;

        (Video.findByPk as jest.Mock).mockResolvedValue(mockTrimmedVideo);

        const url = await trimVideo(videoId, 0, 10);

        expect(url).toContain("trimmed-video.mp4");
    });

    it("should throw an error if the video is not found", async () => {
        const videoId = uuidv4();

        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(trimVideo(videoId, 0, 10)).rejects.toThrow(
            "Video not found"
        );
    });
});

describe("generateShareableLink", () => {
    it("should generate a shareable link", async () => {
        const videoId = "387810b8-f9fc-48d2-92f3-4694b572dfd0";
        const videoData = { id: videoId, filename: "sample-video.mp4" };
        (Video.findByPk as jest.Mock).mockResolvedValue(videoData);
        (getSignedUrl as jest.Mock).mockResolvedValue(
            `https://s3.amazonaws.com/${AWS_S3_BUCKET}/uploads/videos/${videoData.filename}?signed-url`
        );

        const link = await generateShareableLink(videoId);

        expect(link).toContain(videoData.filename);
        expect(link).toContain("signed-url");
    });

    it("should throw an error if video is not found", async () => {
        const videoId = "387810b8-f9fc-48d2-92f3-4694b572dfd0";
        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(generateShareableLink(videoId)).rejects.toThrow(
            "Video not found"
        );
    });
});
