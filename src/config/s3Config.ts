import { S3Client } from "@aws-sdk/client-s3";
import {
    AWS_DEFAULT_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECERT_ACCESS_KEY,
} from "../config/serverConfig";

const s3Client = new S3Client({
    region: AWS_DEFAULT_REGION!,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECERT_ACCESS_KEY!,
    },
});

export default s3Client;
