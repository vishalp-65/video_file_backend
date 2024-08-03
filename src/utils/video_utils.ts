import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";

// Set the path to the ffprobe binary
ffmpeg.setFfprobePath(ffprobeStatic.path);

export const getVideoDuration = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error("Error executing ffprobe:", err);
                return reject(new Error(`ffprobe error: ${err.message}`));
            }
            if (!metadata || !metadata.format) {
                return reject(
                    new Error("Invalid metadata returned by ffprobe")
                );
            }
            resolve(metadata.format.duration!);
        });
    });
};

export const getVideoFormat = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            const format = metadata?.format?.format_name;
            if (!format)
                return reject(new Error("Unable to determine video format"));
            resolve(format);
        });
    });
};
