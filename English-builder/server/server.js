import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

// CORS: chỉ cho phép frontend của bạn gọi API
const allowedOrigins = [
    process.env.CLIENT_URL,       // ví dụ https://roadtoenhance.vercel.app
    "http://localhost:5173",      // khi chạy dev ở máy
].filter(Boolean);

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
            cb(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/RoadtoEnhance")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));
import authRoutes from "./api/routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import testRoutes from "./api/routes/testRoutes.js";
app.use("/api/test", testRoutes);

import userRoutes from "./api/routes/userRoutes.js";
app.use("/api/users", userRoutes);

import placementRoutes from "./api/routes/placementRoutes.js";
app.use("/api/placement-test", placementRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

import adminRoutes from "./api/routes/adminRoutes.js";
app.use("/api/admin", adminRoutes);

import lessonRoutes from "./api/routes/lessonRoutes.js";
app.use("/api/lessons", lessonRoutes);

import flashcardRoutes from "./api/routes/flashcardRoutes.js";
app.use("/api/flashcards", flashcardRoutes);

import userStatsRoutes from "./api/routes/userStatsRoutes.js";
app.use("/api/user", userStatsRoutes);

import writingRoutes from "./api/routes/writingRoutes.js";
app.use("/api/writing", writingRoutes);

