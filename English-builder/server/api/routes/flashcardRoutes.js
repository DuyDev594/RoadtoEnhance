import express from "express";
import {
  getFitVocabularies,
  getAdvancedVocabularies,
  markVocabularyLearned,
  getTopics,
  getReviewVocabularies
} from "../controllers/flashcardController.js";

import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/topic/:topicId/fit", verifyToken, getFitVocabularies);
router.get("/topic/:topicId/advanced", verifyToken, getAdvancedVocabularies);
router.post("/progress", verifyToken, markVocabularyLearned);
router.get("/topics", verifyToken, getTopics);
router.get("/review", verifyToken, getReviewVocabularies);

export default router;