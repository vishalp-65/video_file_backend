// src/tests/unit/videoUtils.test.ts

import { v4 as uuidv4 } from "uuid";
import { emptyVideos, expectedBaseUrl, mockVideos } from "../mock/mockData";
import Video from "../../models/videoModel";
import { mergeVideos, trimVideo } from "../../services/video.service";

jest.mock("../../models/videoModel");
Video.findByPk = jest.fn();
Video.findAll = jest.fn();
jest.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: jest.fn(),
}));

describe("mergeVideos", () => {
    it("should merge videos and return a URL", async () => {
        const videoIds = [mockVideos[0].id, mockVideos[1].id, mockVideos[2].id];
        (Video.findAll as jest.Mock).mockResolvedValue(mockVideos);

        const url = await mergeVideos(videoIds);
        expect(url.startsWith(`${expectedBaseUrl}/trimmed`)).toBe(true);
    }, 600000);

    it("should throw an error if one or more videos are not found", async () => {
        const videoIds = [emptyVideos[0].id, emptyVideos[1].id];

        (Video.findAll as jest.Mock).mockResolvedValue(emptyVideos);

        await expect(mergeVideos(videoIds)).rejects.toThrow(
            "One or more videos not found"
        );
    });
});

describe("trimVideo", () => {
    it("should trim the video and return a URL", async () => {
        const videoId = mockVideos[0].id;

        (Video.findByPk as jest.Mock).mockResolvedValue(mockVideos[0]);

        const url = await trimVideo(videoId, 10, 20);

        expect(url.startsWith(`${expectedBaseUrl}/trimmed`)).toBe(true);
    }, 600000);

    it("should throw an error if the video is not found", async () => {
        const videoId = uuidv4();

        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(trimVideo(videoId, 10, 20)).rejects.toThrow(
            "Video not found"
        );
    });
});
