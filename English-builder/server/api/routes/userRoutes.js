import express from "express";
const router = express.Router();

import { getMe, updateMe  } from "../controllers/userController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";


router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
export default router;