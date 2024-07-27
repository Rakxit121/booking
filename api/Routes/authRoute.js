import express from "express";
import {
  loginController,
  logoutController,
  profileController,
  registerController,
} from "../Controllers/authController.js";

const router = express.Router();

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// profile
router.get("/profile", profileController);

// logout
router.post("/logout", logoutController);

export default router;
