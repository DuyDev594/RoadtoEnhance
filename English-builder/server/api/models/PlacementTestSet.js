import mongoose from "mongoose";

const placementTestSetSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    skills: {
        type: [String],
        enum: ["reading", "vocabulary", "grammar"],
        required: true
    },

    isActive: {
        type: Boolean,
        default: false
    }
    },
    {
    timestamps: true
    });

    export default mongoose.model(
    "PlacementTestSet",
    placementTestSetSchema
);