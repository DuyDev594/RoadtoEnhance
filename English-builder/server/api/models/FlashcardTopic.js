import mongoose from "mongoose";

const flashcardTopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
}, { timestamps: true });

flashcardTopicSchema.pre("findOneAndDelete", async function(next) {
  const topicId = this.getQuery()._id;

  await mongoose.model("Vocabulary").deleteMany({
    topic: topicId
  });

  next();
});

const FlashcardTopic = mongoose.model("FlashcardTopic", flashcardTopicSchema);
export default FlashcardTopic;