import express from "express";
const router = express.Router();

import { verifyToken } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";

// User route
router.get("/user", verifyToken, allowRoles("user", "admin"), (req, res) => {
    res.json({
        message: "User access granted",
        user: req.user
    });
    });

// Admin route
router.get("/admin", verifyToken, allowRoles("admin"), (req, res) => {
    res.json({
        message: "Admin access granted"
    });
});
export default router;
