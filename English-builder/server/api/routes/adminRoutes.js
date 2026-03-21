import express from "express";
const router = express.Router();


import { verifyToken } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";

import {
    getAllUsers,
    getAdminProfile,
    updateUserRole,
    updateUser,
    deleteUser,
    createUser
} from "../controllers/adminController.js";

import {
    createTestSet,
    getAllTestSets,
    updateTestSet,
    deleteTestSet,
    createReadingPassage,
    getReadingPassages,
    updateReadingPassage,
    deleteReadingPassage,
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion,
    getQuestionsByPassage
} from "../controllers/placementAdminController.js";

import {
    createTopic,
    getAllTopics,
    createLesson,
    getLessonsByTopic,
    getLessonById,
    updateTopic,
    deleteTopic,
    updateLesson,
    deleteLesson,
    addSegment,
    updateSegment,
    deleteSegment,
    updateGrammar,
    updateReview,
    updateVideoInfo   
} from "../controllers/lessonAdminController.js";

import {
    createFlashcardTopic,
    getAllFlashcardTopics,
    getFlashcardTopicById,
    updateFlashcardTopic,
    deleteFlashcardTopic,
    getAllVocabularies,
    getVocabularyById,
    getVocabularyByTopic,
    updateVocabulary,
    deleteVocabulary,
    createVocabulary
    
} from "../controllers/flashcardAdminController.js";

import upload from "../../middleware/uploadMiddleware.js"

router.use(verifyToken);
router.use(allowRoles("admin"));

router.get("/users", getAllUsers);
router.get("/profile", getAdminProfile);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", verifyToken, allowRoles("admin"), updateUserRole);

router.post("/placement/test-sets", createTestSet);
router.get("/placement/test-sets", getAllTestSets);
router.put("/placement/test-sets/:id", updateTestSet);
router.delete("/placement/test-sets/:id", deleteTestSet);

router.post("/placement/test-sets/:testSetId/reading-passages", createReadingPassage);
router.get("/placement/test-sets/:testSetId/reading-passages", getReadingPassages);
router.put("/placement/reading-passages/:id", updateReadingPassage);
router.delete("/placement/reading-passages/:id", deleteReadingPassage);

router.post("/placement/questions", createQuestion);
router.get("/placement/questions", getQuestions);
router.get("/placement/reading-passages/:passageId/questions", getQuestionsByPassage);
router.put("/placement/questions/:id", updateQuestion);
router.delete("/placement/questions/:id", deleteQuestion);

router.post("/topics",createTopic);
router.get("/topics",getAllTopics);
router.put("/topics/:id",updateTopic);
router.delete("/topics/:id",deleteTopic);

router.post("/lessons",createLesson);
router.get("/lessons", getLessonsByTopic);
router.get("/lessons/:id", getLessonById);
router.put("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);
router.put("/lessons/:id/video", updateVideoInfo);

router.post("/lessons/:id/segments",addSegment);
router.put("/lessons/:lessonId/segments/:segmentId", updateSegment);
router.delete("/lessons/:lessonId/segments/:segmentId", deleteSegment);

router.put("/lessons/:id/grammar", updateGrammar);
router.put("/lessons/:id/review", updateReview);


router.post("/flashcards/vocabularies", upload.single("image"), createVocabulary);
router.get("/flashcards/vocabularies", getAllVocabularies);
router.get("/flashcards/vocabularies/topic/:topicId", getVocabularyByTopic);
router.get("/flashcards/vocabularies/:id", getVocabularyById);
router.put( "/flashcards/vocabularies/:id", upload.single("image"), updateVocabulary);
router.delete( "/flashcards/vocabularies/:id", deleteVocabulary);

router.post( "/flashcards/topics", createFlashcardTopic);
router.get( "/flashcards/topics", getAllFlashcardTopics);
router.get( "/flashcards/topics/:id", getFlashcardTopicById);
router.put( "/flashcards/topics/:id", updateFlashcardTopic);
router.delete( "/flashcards/topics/:id", deleteFlashcardTopic);

export default router;
