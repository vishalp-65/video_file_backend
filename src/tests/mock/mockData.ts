// src/tests/mockData.js
import { v4 as uuidv4 } from "uuid";

const mockVideos = [
    {
        id: "580b947e-270b-49dc-9b36-3bfc3be59ab9",
        url: "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads/videos/dfd6494b025918c8ed203087741451f6",
        filename: "dfd6494b025918c8ed203087741451f6",
        mimetype: "video/mp4",
        size: 7520701,
        duration: 157.08,
    },
    {
        id: "9b42a96a-03e1-4690-8f52-42b93f67b4ee",
        url: "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads/videos/50930b50985e8cd3c7ffd8d194283d1c",
        filename: "50930b50985e8cd3c7ffd8d194283d1c",
        mimetype: "video/mp4",
        size: 2804550,
        duration: 60.2,
    },
    {
        id: "a32a3593-9ea9-42e5-905f-5177c587f02b",
        url: "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads/videos/bfc288f25a76d18ad2cc1d5fcdb74fce",
        filename: "bfc288f25a76d18ad2cc1d5fcdb74fce",
        mimetype: "video/mp4",
        size: 7520701,
        duration: 157.08,
    },
];
const emptyVideos = [
    {
        id: uuidv4(),
        url: "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads/videos/dfd6494b025918c8ed203087741451f6",
        filename: "dfd6494b025918c8ed203087741451f6",
        mimetype: "video/mp4",
        size: 7520701,
        duration: 157.08,
    },
    {
        id: uuidv4(),
        url: "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads/videos/50930b50985e8cd3c7ffd8d194283d1c",
        filename: "50930b50985e8cd3c7ffd8d194283d1c",
        mimetype: "video/mp4",
        size: 2804550,
        duration: 60.2,
    },
    {
        id: uuidv4(),
        url: "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads/videos/bfc288f25a76d18ad2cc1d5fcdb74fce",
        filename: "bfc288f25a76d18ad2cc1d5fcdb74fce",
        mimetype: "video/mp4",
        size: 7520701,
        duration: 157.08,
    },
];

const expectedBaseUrl =
    "https://video-files-assignment.s3.ap-south-1.amazonaws.com/uploads";

const token = "ezyshjlki39hkh93eqi9jeq";

export { mockVideos, emptyVideos, expectedBaseUrl, token };
