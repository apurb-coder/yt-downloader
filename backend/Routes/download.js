import { exec } from "child_process";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const getYouTubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

//function to combine a video and a audio using ffmpeg
const combineVideoAndAudio = (videoPath, audioPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .output(outputPath)
      .videoCodec("copy")
      .audioCodec("copy")
      .on("progress", (progress) => {
        const percentDone = isNaN(progress.percent) ? 100 : progress.percent;
        console.log("Processing: " + percentDone + "% done");
      })
      .on("end", () => {
        console.log("Conversion finished");
        resolve(); // Resolve the Promise
      })
      .on("error", (err) => {
        console.error("Error:", err);
        reject(err); // Reject the Promise
      });

    command.run();
  });
};

// to remove |\*: and other reserved spcial character from the vidoe Title
const sanitizeFilePath = (filePath) => {
  // Define a regular expression to match special characters
  const regex = /[\\/:"*?<>|]/g;

  // Replace special characters with an empty string
  const sanitizedPath = filePath.replace(regex, "");

  return sanitizedPath;
};

const videoAudioDownloadBoth = (itagVal, videoId, folder) => {
  return new Promise((resolve, reject) => {
    const videoPath = `Downloads/${folder}/video.mp4`;
    const audioPath = `Downloads/${folder}/audio.m4a`;
    const extractedVideoId = getYouTubeVideoId(videoId);

    if (!extractedVideoId) {
      return reject(new Error("Invalid YouTube URL"));
    }

    exec(`yt-dlp -f bestvideo[ext=mp4] -o "${videoPath}" https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      console.log(`Video download stdout: ${stdout}`);
      console.error(`Video download stderr: ${stderr}`);

      exec(`yt-dlp -f bestaudio[ext=m4a] -o "${audioPath}" https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        console.log(`Audio download stdout: ${stdout}`);
        console.error(`Audio download stderr: ${stderr}`);

        exec(`yt-dlp --get-title https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return reject(error);
          }
          const vInfoTitle = sanitizeFilePath(stdout.trim());
          const outputPath = `Downloads/${folder}/${vInfoTitle}.mp4`;

          combineVideoAndAudio(videoPath, audioPath, outputPath)
            .then(() => {
              resolve(`${vInfoTitle}.mp4`);
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    });
  });
};

const videoDownloadOnly = (itagVal, videoId, folder) => {
  return new Promise((resolve, reject) => {
    const extractedVideoId = getYouTubeVideoId(videoId);

    if (!extractedVideoId) {
      return reject(new Error("Invalid YouTube URL"));
    }

    exec(`yt-dlp -f ${itagVal} --output "Downloads/${folder}/%(title)s.%(ext)s" https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      console.log(`Video download stdout: ${stdout}`);
      console.error(`Video download stderr: ${stderr}`);

      exec(`yt-dlp --get-title https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        const fileName = sanitizeFilePath(stdout.trim());
        resolve(`${fileName}.mp4`); // Assuming mp4 as default for now
      });
    });
  });
};

const decodeURLAndFolderName=(filePath)=>{
  const folderPath = decodeURIComponent(filePath);
  console.log(filePath);
  // Define a regular expression to match UUID pattern
  const uuidPattern =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

  // Use the regular expression to extract the UUID
  const match = folderPath.match(uuidPattern);

  // Check if a match is found
  let extractedUuid
  if (match && match.length > 0) {
    extractedUuid = match[0];
    console.log(extractedUuid);
  } else {
    console.log("UUID not found in the file path.");
  }
  return extractedUuid;
}

export { videoDownloadOnly, videoAudioDownloadBoth, decodeURLAndFolderName, getYouTubeVideoId };
