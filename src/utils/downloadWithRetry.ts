import { uploadToS3 } from "./s3_utils";
import { downloadFile } from "./video_utils";

export const downloadFileWithRetry = async (
    url: string,
    destPath: string,
    retries: number = 3
): Promise<void> => {
    try {
        await downloadFile(url, destPath);
    } catch (error: any) {
        if (error.code === "ECONNRESET" && retries > 0) {
            console.log(`Retrying download... Attempts left: ${retries}`);
            await downloadFileWithRetry(url, destPath, retries - 1);
        } else {
            console.error("Error occurred during file download:", error);
            throw error;
        }
    }
};

export const uploadFileWithRetry = async (
    trimmedFile: Buffer,
    key: string,
    videoType: string,
    retries: number = 3
): Promise<string> => {
    try {
        const url = uploadToS3(trimmedFile, key, videoType);
        return url;
    } catch (error: any) {
        if (error.code === "ECONNRESET" && retries > 0) {
            console.log(`Retrying download... Attempts left: ${retries}`);
            const url = await uploadFileWithRetry(
                trimmedFile,
                key,
                videoType,
                retries - 1
            );
            return url;
        } else {
            console.error("Error occurred during file download:", error);
            throw error;
        }
    }
};
