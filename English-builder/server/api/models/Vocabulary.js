import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema(
{
  word: {
    type: String,
    required: true,
    trim: true
  },

  definition: {
    type: String,
    required: true
  },

  example: {
    type: String
  },

  imageUrl: {
    type: String
  },

  level: {
    type: String,
    enum: ["A1", "A2", "B1", "B2", "C1"],
    required: true
  },
  
  pronunciation: {
    us: { ipa: String },
    uk: { ipa: String }
  }, 

  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlashcardTopic",
    required: true
  }
},
{
  timestamps: true
}
);

vocabularySchema.index(
  { word: 1, topic: 1 },
  { unique: true }
);

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);
export default Vocabulary;