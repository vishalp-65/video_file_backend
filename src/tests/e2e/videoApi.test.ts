// src/tests/e2e/videoApi.test.ts

import request from "supertest";
import app from "../../app";
import {
    emptyVideos,
    expectedBaseUrl,
    mockVideos,
    token,
} from "../mock/mockData";
import Video from "../../models/videoModel";

jest.mock("../../models/videoModel");
Video.findByPk = jest.fn();
Video.findAll = jest.fn();

describe("Video API Endpoints", () => {
    it("should merge videos and return a URL", async () => {
        const videoIds = [mockVideos[0].id, mockVideos[1].id, mockVideos[2].id];

        (Video.findAll as jest.Mock).mockResolvedValue(mockVideos);

        const response = await request(app)
            .post("/api/v1/video/merge")
            .set("Authorization", `Bearer ${token}`)
            .send({ videoIds });

        if (response.status !== 200) {
            console.error("Failed to merge videos:", response.body);
        }

        expect(response.status).toBe(200);
        expect(response.body.url.startsWith(expectedBaseUrl)).toBe(true);
    }, 600000);

    it("should return 404 if one or more videos are not found", async () => {
        const videoIds = [emptyVideos[0].id, emptyVideos[1].id];

        (Video.findAll as jest.Mock).mockResolvedValue(emptyVideos);

        const response = await request(app)
            .post("/api/v1/video/merge")
            .set("Authorization", `Bearer ${token}`)
            .send({ videoIds });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("One or more videos not found");
    });

    it("should trim the video and return a URL", async () => {
        const videoId = mockVideos[0].id;

        (Video.findByPk as jest.Mock).mockResolvedValue(mockVideos[0]);

        const response = await request(app)
            .post(`/api/v1/video/trim`)
            .set("Authorization", `Bearer ${token}`)
            .send({ videoId: videoId, start: 10, end: 30 });

        // Check if the API returned 200
        if (response.status !== 200) {
            console.error("Failed to trim video:", response.body);
        }

        expect(response.status).toBe(200);

        expect(response.body.url.startsWith(`${expectedBaseUrl}/trimmed`)).toBe(
            true
        );
    }, 600000);

    it("should return 404 if the video is not found", async () => {
        const videoId = emptyVideos[0].id;

        (Video.findByPk as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .post(`/api/v1/video/trim`)
            .set("Authorization", `Bearer ${token}`)
            .send({ videoId: videoId, start: 10, end: 20 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Video not found");
    });
});
