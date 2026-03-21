import express from "express";
const router = express.Router();

import { verifyToken } from "../../middleware/authMiddleware.js";
import { getLessonDetail, getLessonsByTopic, updateLessonProgress, getTopicsForUser  } from "../controllers/lessonController.js";
import { updateSegmentProgress } from "../controllers/lessonController.js"

router.use(verifyToken);
router.get("/topics", getTopicsForUser);
router.get("/topics/:topicId/lessons", getLessonsByTopic);

router.get("/:id", getLessonDetail);
router.put("/:id/progress", updateLessonProgress);
router.post("/segment-progress", updateSegmentProgress)
export default router;
