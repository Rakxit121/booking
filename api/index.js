import express from "express";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoute.js";
import uploadRoutes from "./Routes/uploadRoute.js";
import placeRoutes from "./Routes/placeRoute.js";
import bookingRoutes from "./Routes/bookingRoute.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url"; // Import the fileURLToPath function
import path from "path"; // Import the path module

// config env
dotenv.config();

//database config
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
// Get the current module's URL and convert it to a file path
const currentModulePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentModulePath);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(currentDir, "uploads")));
app.use(morgan("dev"));
app.use(cors());

app.get("/test", (req, res) => {
  res.json("test ok");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", uploadRoutes);
app.use("/api/auth", placeRoutes);
app.use("/api/auth", bookingRoutes);

app.listen(5000, (req, res) => {
  console.log("Listening server".bgCyan.white);
});
