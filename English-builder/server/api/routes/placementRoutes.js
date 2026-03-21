import express from "express";
import { startPlacementTest } from "../controllers/placementController.js";


const router = express.Router();

import {
    submitPlacementTest,
    getPlacementResult,
    getActivePlacementTest
} from "../controllers/placementController.js";

import { verifyToken } from "../../middleware/authMiddleware.js";

router.use(verifyToken);

// Get active placement test
router.get("/test", startPlacementTest);

// Submit placement test
router.post("/submit", submitPlacementTest);

// Get result
router.get("/result", getPlacementResult);

// Get active placement test details
router.get("/active", getActivePlacementTest);

export default router;
