import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECERT_ACCESS_KEY = process.env.AWS_SECERT_ACCESS_KEY;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const STATIC_TOKEN = process.env.STATIC_TOKEN;

export {
    PORT,
    AWS_ACCESS_KEY_ID,
    AWS_SECERT_ACCESS_KEY,
    AWS_DEFAULT_REGION,
    AWS_S3_BUCKET,
    STATIC_TOKEN,
};
