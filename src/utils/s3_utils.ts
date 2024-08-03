import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
});

export const uploadToS3 = async (
    file: Buffer,
    key: string,
    videoType: string
): Promise<string> => {
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `uploads/${key}-${Date.now()}`,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 900,
    });

    // Upload the file to the signed URL
    await axios.put(signedURL, file, {
        headers: {
            "Content-Type": videoType,
        },
        onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total!
            );
            console.log(`Upload progress: ${percentage}%`);
        },
    });

    // Return the file URL (without query parameters)
    return signedURL.split("?")[0];
};
