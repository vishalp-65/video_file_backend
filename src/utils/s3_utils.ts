import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import s3Client from "../config/s3Config";
import { AWS_S3_BUCKET } from "../config/serverConfig";
import httpStatus from "http-status";
import ApiError from "./ApiError";

export const uploadToS3 = async (
    file: Buffer,
    key: string,
    videoType: string
): Promise<string> => {
    const putObjectCommand = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: `uploads/${key}`,
    });
    // console.log("put");

    let signedURL;
    try {
        signedURL = await getSignedUrl(s3Client, putObjectCommand, {
            expiresIn: 600000,
        });
        console.log("Generated Signed URL:", signedURL);
    } catch (error) {
        console.error("Error generating signed URL:", error);
        if (error instanceof Error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        } else {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Unknown error occurred while generating signed URL"
            );
        }
    }

    console.log("Uploading start...");
    // Upload the file to the signed URL
    try {
        await axios.put(signedURL!, file, {
            headers: {
                "Content-Type": videoType,
            },
            // onUploadProgress: (progressEvent) => {
            //     const percentage = Math.round(
            //         (progressEvent.loaded * 100) / progressEvent.total!
            //     );
            //     console.log(`Upload progress: ${percentage}%`);
            // },
        });
    } catch (error) {
        console.log("Error while uploading video to S3", error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Unable to upload video on S3"
        );
    }

    // Return the file URL (without query parameters)
    return signedURL!.split("?")[0];
};
