// src/tests/unit/videoUtils.test.ts

import Video from "../../models/videoModel";
import { generateShareableLink } from "../../services/video.service";
import { emptyVideos, expectedBaseUrl, mockVideos } from "../mock/mockData";

jest.mock("../../models/videoModel");
Video.findByPk = jest.fn();

describe("generateShareableLink", () => {
    it("should generate a shareable link", async () => {
        const videoId = mockVideos[0].id;

        (Video.findByPk as jest.Mock).mockResolvedValue(mockVideos[0]);

        const link = await generateShareableLink(videoId);

        expect(link.startsWith(`${expectedBaseUrl}/videos`)).toBe(true);
    });

    it("should throw an error if video is not found", async () => {
        const videoId = emptyVideos[0].id;
        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(generateShareableLink(videoId)).rejects.toThrow(
            "Video not found"
        );
    });
});
