import mongoose from "mongoose";

const UserLessonProgressSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },

  completedSegments: {
    type: [Number],
    default: []
  },

  dictationScore: {
    type: Number,
    default: 0
  },

  reviewScore: {
    type: Number,
    default: 0
  },

  completed: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("UserLessonProgress", UserLessonProgressSchema);