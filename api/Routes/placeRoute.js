import express from "express";
import {
  getPlacesByIdController,
  getPlacesController,
  getUserPlaceController,
  placeController,
  updatePlaceController,
} from "../Controllers/placeController.js";
const router = express.Router();

// place route

router.post("/places", placeController);
router.get("/user-places", getUserPlaceController);
router.get("/places", getPlacesController);
router.put("/places", updatePlaceController);
router.get("/places/:id", getPlacesByIdController);

export default router;
