import express from "express";
import {
  uploadByLinkController,
  uploadPhotoController,
} from "../Controllers/uploadController.js";
import multer from "multer";

const router = express.Router();

// upload pic by link
router.post("/upload-by-link", uploadByLinkController);

// upload by photo
const photosMiddleware = multer({ dest: "uploads/" });
router.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  uploadPhotoController
);

export default router;
