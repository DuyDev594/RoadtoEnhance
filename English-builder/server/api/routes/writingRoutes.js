import express from "express";
import { getTopic, submitEssay } from "../controllers/writingController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/topic", verifyToken, getTopic);
router.post("/submit", verifyToken, submitEssay);

export default router;