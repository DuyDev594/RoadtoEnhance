import mongoose from "mongoose";

const readingPassageSchema = new mongoose.Schema(
{
    testSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlacementTestSet",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    passageText: {
        type: String,
        required: true
    },

    level: {
        type: String,
        enum: ["A1", "A2", "B1", "B2", "C1"],
        required: true
    },

    order: {
        type: Number,
        required: true
    }
    },
    {
    timestamps: true
    });

    export default mongoose.model(
    "ReadingPassage",
    readingPassageSchema
);