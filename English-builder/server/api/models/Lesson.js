import mongoose from "mongoose";
const SegmentSchema = new mongoose.Schema({
    order: { type: Number, required: true },

    start: { type: Number, required: true },
    end: { type: Number, required: true },

    transcript: { type: String, required: true },

    dictation: {
        masked: String,
        answer: String
    },

    hints: [String],
    grammarTag: String,

});

const GrammarSchema = new mongoose.Schema({
    title: String,
    explanation: String,
    examples: [String]
});

const ReviewQuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["fill_blank", "reorder", "multiple_choice"]
    },
    question: String,
    options: [String],
    answer: mongoose.Schema.Types.Mixed
});

const LessonSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },

    type: {
        type: String,
        enum: ["video", "grammar"],
        required: true,
        default: "video"
    },

    title: { type: String, required: true },
    order: { type: Number, default: 1 },

    video: {
        provider: {
            type: String,
            enum: ["youtube"],
            default: "youtube"
        },
        videoId: { type: String, default: "" }
    },

    
    segments: {
        type: [SegmentSchema],
        default: []
    },

    grammar: {
        explanation: { type: Object, default: null }
    },

    review: {
        type: {
            type: String,
            enum: ["quiz_text"],
            default: "quiz_text"
        },
        questions: [ReviewQuestionSchema]
    },

    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Lesson", LessonSchema);