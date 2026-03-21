import mongoose from "mongoose";

const placementResultSchema = new mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        },

        testSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlacementTestSet",
        required: true
        },

        byLevel: {
            A1: {
                correct: { type: Number, default: 0 },
                total: { type: Number, default: 0 }
            },
            A2: {
                correct: { type: Number, default: 0 },
                total: { type: Number, default: 0 }
            },
            B1: {
                correct: { type: Number, default: 0 },
                total: { type: Number, default: 0 }
            },
            B2: {
                correct: { type: Number, default: 0 },
                total: { type: Number, default: 0 }
            },
            C1: {
                correct: { type: Number, default: 0 },
                total: { type: Number, default: 0 }
            }
        },
        
        assignedLevel: {
            type: String,
            enum: ["A1", "A2", "B1", "B2", "C1", null],
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "PlacementResult",
    placementResultSchema
);