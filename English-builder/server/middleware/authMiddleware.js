import jwt from "jsonwebtoken";
import User from "../api/models/User.js";

export const verifyToken = async (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;

        // 1. Check header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        // 2. Get token
        const token = authHeader.split(" ")[1];

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get user from DB
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
        return res.status(401).json({ message: "User not found" });
        }

        // 5. Attach user to request
        req.user = user;

        next();
    } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
    }
};