// src/tests/unit/videoUtils.test.ts

import Video from "../../models/videoModel";
import { generateShareableLink } from "../../services/video.service";

jest.mock("../../src/models/videoModel");
jest.mock("../../src/models/videoTokenModel");

describe("generateShareableLink", () => {
    it("should generate a shareable link", async () => {
        const videoId = "387810b8-f9fc-48d2-92f3-4694b572dfd0";

        (Video.findByPk as jest.Mock).mockResolvedValue(videoId);

        const link = await generateShareableLink(videoId);

        expect(link).toContain(videoId);
    });

    it("should throw an error if video is not found", async () => {
        const videoId = "387810b8-f9fc-48d2-92f3-4694b572dfd0";
        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(generateShareableLink(videoId)).rejects.toThrow(
            "Video not found"
        );
    });
});
