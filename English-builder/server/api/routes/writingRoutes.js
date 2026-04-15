import express from "express";
import { getTopic, submitEssay, nextTopic } from "../controllers/writingController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/topic", verifyToken, getTopic);
router.post("/submit", verifyToken, submitEssay);
router.get("/next-topic", verifyToken, nextTopic);

export default router;