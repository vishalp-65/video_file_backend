# Video Files API

This project provides a REST API for handling video file operations, including upload, merge, and other video processing tasks. The API is built with Node.js, TypeScript, and AWS S3 for storage.

## Features

- Video upload to AWS S3
- Video merging
- Trim video
- Shareable link with expiry 
- Error handling
- Docker support

## Prerequisites

- Node.js
- npm
- Docker
- AWS account with S3 access

## Setup

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vishalp-65/video_file_backend.git
   cd video-file_backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory with the following variables:**

   ```env
   PORT=8000
   STATIC_TOKEN="ezyshjlki39hkh93eqi9jeq"   // Add your own
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_DEFAULT_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket_name
   ```

4. **Run the application:**

   ```bash
   npm run dev
   ```

5. **Access the API:**

   The API will be available at `http://localhost:8000`.

### Docker Setup

1. **Ensure you have Docker installed.**

2. **Create a `.env` file in the root directory with the environment variables as shown above.**

3. **Build the Docker image:**

   ```bash
   docker build -t video-files-api .
   ```

4. **Run the Docker container:**

   ```bash
   docker run -p 8000:8000 video-files-api
   ```

5. **Access the API:**

   The API will be available at `http://localhost:8000`.

## Postman Collection

- You can use the following Postman collection to test the API endpoints: [Postman Collection Link](https://drive.google.com/file/d/1eHa41xUmSP4U4MlZ2OFCo4cU3V3hLNRh/view?usp=sharing) .
- API ewndpoints and parameters types are mentioned in postman collection. 

## Assumptions 
We have logged in user and have a schema to store trim and merge video link. Also assume we have created a short polling or long polling api to fetch ongoing video status(uploading, merging, trimming).

## Articles followed 
- For trimming a video - https://stackoverflow.com/questions/63997589/cutting-a-video-without-re-encoding-using-ffmpeg-and-nodejs-fluent-ffmpeg
- For merging a video - https://community.gumlet.com/t/how-to-merge-multiple-videos-using-fluent-ffmpeg/461/2
