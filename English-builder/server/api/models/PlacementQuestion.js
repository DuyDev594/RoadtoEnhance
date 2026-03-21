import mongoose from "mongoose";

const placementQuestionSchema = new mongoose.Schema(
{
    testSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlacementTestSet",
        required: true
    },

    skill: {
        type: String,
        enum: ["reading", "vocabulary", "grammar"],
        required: true
    },

    passageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReadingPassage",
        default: null
    },

    questionText: {
        type: String,
        required: true
    },

    options: {
        type: [String],
        required: true
    },

    correctAnswer: {
        type: String,
        required: true
    },

    level: {
        type: String,
        enum: ["A1", "A2", "B1", "B2", "C1"],
        required: function () {
            return this.skill !== "reading";
        }
    },

    score: {
        type: Number,
        default: 1
    }
    },
    {
    timestamps: true
    });

    export default mongoose.model(
    "PlacementQuestion",
    placementQuestionSchema
);