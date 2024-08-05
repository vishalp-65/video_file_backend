// src/tests/e2e/videoApi.test.ts

import request from "supertest";
import app from "../../app";
import { v4 as uuidv4 } from "uuid";
import { mockVideos, mockTrimmedVideo } from "../mockData";
import Video from "../../models/videoModel";

jest.mock("../../models/videoModel");

describe("Video API Endpoints", () => {
    it("should merge videos and return a URL", async () => {
        const videoIds = [mockVideos[0].id, mockVideos[1].id];

        (Video.findAll as jest.Mock).mockResolvedValue(mockVideos);

        const response = await request(app)
            .post("/api/videos/merge")
            .send({ videoIds });

        expect(response.status).toBe(200);
        expect(response.body.url).toContain("merged-video.mp4");
    });

    it("should return 404 if one or more videos are not found", async () => {
        const videoIds = [uuidv4(), uuidv4()];

        (Video.findAll as jest.Mock).mockResolvedValue([]);

        const response = await request(app)
            .post("/api/videos/merge")
            .send({ videoIds });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("One or more videos not found");
    });

    it("should trim the video and return a URL", async () => {
        const videoId = mockTrimmedVideo.id;

        (Video.findByPk as jest.Mock).mockResolvedValue(mockTrimmedVideo);

        const response = await request(app)
            .post(`/api/videos/trim/${videoId}`)
            .send({ start: 0, end: 10 });

        expect(response.status).toBe(200);
        expect(response.body.url).toContain("trimmed-video.mp4");
    });

    it("should return 404 if the video is not found", async () => {
        const videoId = uuidv4();

        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .post(`/api/videos/trim/${videoId}`)
            .send({ start: 0, end: 10 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Video not found");
    });
});
