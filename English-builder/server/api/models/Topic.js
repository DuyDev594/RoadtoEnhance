import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,

    level: {
        type: String,
        enum: ["A1", "A2", "B1", "B2", "C1"],
        required: true
    },

    order: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
}

);
export default mongoose.model("Topic", TopicSchema);
