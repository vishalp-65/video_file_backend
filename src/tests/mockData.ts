// src/tests/mockData.js

import { v4 as uuidv4 } from "uuid";

const videoId1 = "580b947e-270b-49dc-9b36-3bfc3be59ab9";
const videoId2 = "387810b8-f9fc-48d2-92f3-4694b572dfd0";
const trimmedVideoId = "580b947e-270b-49dc-9b36-3bfc3be59ab9";

const mockVideos = [
    {
        id: videoId1,
        filename: "sample-video1.mp4",
    },
    {
        id: videoId2,
        filename: "sample-video2.mp4",
    },
];

const mockTrimmedVideo = {
    id: trimmedVideoId,
    filename: "trimmed-video.mp4",
};

export { mockVideos, mockTrimmedVideo };
