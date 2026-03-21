import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { getLearningActivity } from "../controllers/userStatsController.js";

const router = express.Router();

router.get("/activity", verifyToken, getLearningActivity);

export default router;