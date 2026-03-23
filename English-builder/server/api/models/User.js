import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
username: {
    type: String,
    required: true,
    trim: true
},

email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
},

password: {
    type: String,
    required: true
},

role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
},

// detect first-time login
hasTakenPlacementTest: {
    type: Boolean,
    default: false
},

level: {
    type: String,
    enum: ["A1", "A2", "B1", "B2", "C1", null],
    default: null
},
lessonProgress: [
    {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
        status: {
        type: String,
        enum: ["not_started", "in_progress", "completed"],
        default: "not_started"
        },
        score: Number,
        completedSegments: {
            type: [Number],
            default: []
        },
        updatedAt: Date
    }
],
lastPlacementTestAt: {
    type: Date,
    default: null
},
aiWriting: {
  dailyCount: { type: Number, default: 0 },
  lastUsed: { type: Date, default: null },
  retryCount: { type: Number, default: 0 }
}
},
{
timestamps: true
},

);

const User = mongoose.model("User", userSchema);
export default User;