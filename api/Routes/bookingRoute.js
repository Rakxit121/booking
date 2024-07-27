import express from "express";
import {
  bookingController,
  getBookingController,
} from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/bookings", bookingController);
router.get("/bookings", getBookingController);

export default router;
