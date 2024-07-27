import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import imageDownloader from "image-downloader";

const currentModulePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentModulePath);

// Configure your upload directory path
const UPLOAD_DIR = path.join(currentDir, "../uploads");

export const uploadByLinkController = async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg"; // Construct the new filename
  const destPath = path.join(UPLOAD_DIR, newName);

  try {
    await imageDownloader.image({
      url: link,
      dest: destPath,
    });

    // Return the new filename to the client
    res.json(newName);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while downloading and saving the image.",
    });
  }
};

export const uploadPhotoController = async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const relativePath = newPath.replace("uploads\\", "");
    uploadedFiles.push(relativePath);
  }
  res.json(uploadedFiles);
};
