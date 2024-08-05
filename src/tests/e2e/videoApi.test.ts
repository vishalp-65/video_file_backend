import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import Video from "../../models/videoModel";
import app from "../../app";
import { uploadToS3 } from "../../utils/s3_utils";

jest.mock("../../models/videoModel");
jest.mock("../../utils/video_utils");
jest.mock("uuid");

describe("Video API Endpoints", () => {
    beforeEach(() => {
        (uuidv4 as jest.Mock).mockReturnValue("unique-id");
    });

    it("should trim a video", async () => {
        const response = await request(app).post("/trim").send({
            inputPath: "input.mp4",
            outputPath: "output.mp4",
            start: 0,
            end: 10,
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Video trimmed successfully");
    });

    it("should merge videos", async () => {
        (Video.findAll as jest.Mock).mockResolvedValue([
            {
                id: "1",
                filename: "video1.mp4",
                url: "http://example.com/video1.mp4",
            },
            {
                id: "2",
                filename: "video2.mp4",
                url: "http://example.com/video2.mp4",
            },
        ]);
        (uploadToS3 as jest.Mock).mockResolvedValue(
            "http://example.com/uploads/unique-id.mp4"
        );

        const response = await request(app)
            .post("/merge")
            .send({ videoIds: ["1", "2"] });
        expect(response.status).toBe(200);
        expect(response.body.url).toBe(
            "http://example.com/uploads/unique-id.mp4"
        );
    });

    it("should generate a shareable link", async () => {
        // Add your test case here
    });
});
