import express from "express";
import { exec } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import * as rimraf from "rimraf"; // used for deleting of file
import {
  videoDownloadOnly,
  videoAudioDownloadBoth,
  decodeURLAndFolderName,
  getYouTubeVideoId,
} from "./download.js";

const router = express.Router();

let fileName_ = "";
// NOTE: ':yt_link' must be encoded using encodeURIComponent() before hitting the endpoint
router.get("/video-info/:yt_link", async (req, res) => {
  try {
    //use encodeURIComponent() to encode utl in the front-end and then send it to back-end
    const videoId = req.params.yt_link; // url se :yt_link ka content extract karta hai
    const extractedVideoId = getYouTubeVideoId(videoId);

    if (!extractedVideoId) {
      throw new Error("Invalid YouTube video link");
    }

    // Use await to wait for the getInfo operation to complete
    const { stdout } = await new Promise((resolve, reject) => {
      exec(`yt-dlp --dump-json https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        resolve({ stdout, stderr });
      });
    });

    const info = JSON.parse(stdout);

    const optionsDownload = { videoDetails: {}, quality: {} };
    optionsDownload.videoDetails = {
      title: info.title,
      duration: `${
        Math.floor(info.duration / 3600) !== 0
          ? `${Math.floor(info.duration / 3600)}:`
          : ""
      }${Math.floor((info.duration % 3600) / 60)}:${info.duration % 60}`,
      thumbnails: info.thumbnails,
      videoId: info.id,
    };

    info.formats.forEach((format) => {
      if (format.ext === "mp4" && format.vcodec !== "none" && format.acodec !== "none") {
        optionsDownload.quality[format.format_note] = {
          container: format.ext,
          itag: format.format_id,
          audioExist: true,
        };
      } else if (format.ext === "mp4" && format.vcodec !== "none" && format.acodec === "none") {
        optionsDownload.quality[format.format_note] = {
          container: format.ext,
          itag: format.format_id,
          audioExist: false,
        };
      }
    });

    // Sending response after getting video-info and available download options
    // res.json(info)
    res.json(optionsDownload);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }

  // sending response of the video-info and available download options
});

router.post("/video-download/:yt_link", async (req, res) => {
  try {
    const folder_name = crypto.randomUUID(); // Random folder name
    const folder_path = `Downloads/${folder_name}`;

    // Creating folder with folder_name
    fs.mkdirSync(folder_path);

    const videoId = req.params.yt_link;
    const extractedVideoId = getYouTubeVideoId(videoId);

    if (!extractedVideoId) {
      throw new Error("Invalid YouTube video link");
    }

    const { stdout } = await new Promise((resolve, reject) => {
      exec(`yt-dlp --dump-json https://www.youtube.com/watch?v=${extractedVideoId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        resolve({ stdout, stderr });
      });
    });

    const info = JSON.parse(stdout);

    const optionsDownload = { videoDetails: {}, quality: {} };

    optionsDownload.videoDetails = {
      title: info.title,
      duration: `${
        Math.floor(info.duration / 3600) !== 0
          ? `${Math.floor(info.duration / 3600)}:`
          : ""
      }${Math.floor((info.duration % 3600) / 60)}:${info.duration % 60}`,
      thumbnails: info.thumbnails,
      videoId: info.id,
    };

    info.formats.forEach((format) => {
      if (format.ext === "mp4" && format.vcodec !== "none" && format.acodec !== "none") {
        optionsDownload.quality[format.format_note] = {
          container: format.ext,
          itag: format.format_id,
          audioExist: true,
        };
      } else if (format.ext === "mp4" && format.vcodec !== "none" && format.acodec === "none") {
        optionsDownload.quality[format.format_note] = {
          container: format.ext,
          itag: format.format_id,
          audioExist: false,
        };
      }
    });

    const reqested_quality = req.body.quality || "720p";

    let fileName;

    if (
      optionsDownload[reqested_quality].audioExist === false ||
      optionsDownload[reqested_quality].audioExist === undefined
    ) {
      fileName = await videoAudioDownloadBoth(
        optionsDownload[reqested_quality].itag,
        optionsDownload[reqested_quality].vid_id,
        folder_name
      );
    } else {
      fileName = await videoDownloadOnly(
        optionsDownload[reqested_quality].itag,
        optionsDownload[reqested_quality].vid_id,
        folder_name
      );
    }

    const filePath = `${folder_path}/${fileName}`;
    fileName_ = fileName;
    console.log(filePath);
    // Send a response to the client
    res.json({
      itag: optionsDownload[reqested_quality].itag,
      quality: reqested_quality,
      filePath: encodeURIComponent(filePath),
      fileName: fileName,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// to handle and avoid multiple download request
let isDownloadInProgress = false;

// must give the correct file path
// Must give the correct file path
router.get("/:filePath", async (req, res) => {
  const filePath = req.params.filePath;
  console.log(`http://localhost:8000/${filePath}`);
  const fileName = fileName_ || "output.mp4";

  try {
    // Set appropriate headers for file download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", fs.statSync(filePath).size);

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Clean up temporary files and folders after the download is complete
    fileStream.on("close", () => cleanupDownload(filePath));

    // Handle errors during file streaming
    fileStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      cleanupDownload(filePath);
      res.status(500).send("Error streaming file");
    });
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Error downloading file");
  }
});

// Function to clean up temporary files and folders
function cleanupDownload(filePath) {
  let folderPath = decodeURIComponent(filePath);
  folderPath = `Downloads/${folderPath.split("/")[1]}`;

  // Get a list of all files in the directory
  const files = fs.readdirSync(folderPath);

  // Delete each file
  for (const file of files) {
    rimraf.sync(path.join(folderPath, file));
  }
}

export default router;
