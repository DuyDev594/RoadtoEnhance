import mongoose from "mongoose";

const userVocabularyProgressSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vocabulary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vocabulary",
    required: true
  },

  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlashcardTopic",
    required: true
  },

  status: {
    type: String,
    enum: ["learned", "review"],
    default: "review"
  }
},
{
  timestamps: true
}
);

userVocabularyProgressSchema.index(
  { user: 1, vocabulary: 1 },
  { unique: true }
);

export default mongoose.model(
  "UserVocabularyProgress",
  userVocabularyProgressSchema
);