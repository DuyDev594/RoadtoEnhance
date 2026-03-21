import Vocabulary from "../models/Vocabulary.js";
import User from "../models/User.js";
import UserVocabularyProgress from "../models/UserVocabularyProgress.js";
import FlashcardTopic from "../models/FlashcardTopic.js";

const levelOrder = ["A1", "A2", "B1", "B2", "C1"];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

/* ================= GET TOPICS ================= */

export const getTopics = async (req, res) => {
  try {

    const userId = req.user._id;

    const topics = await FlashcardTopic.find();

    const result = await Promise.all(
      topics.map(async (topic) => {

        const totalVocab = await Vocabulary.countDocuments({
          topic: topic._id
        });

        const learnedCount = await UserVocabularyProgress.countDocuments({
          user: userId,
          topic: topic._id,
          status: "learned"
        });

        const reviewCount = await UserVocabularyProgress.countDocuments({
          user: userId,
          topic: topic._id,
          status: "review"
        });

        return {
          ...topic.toObject(),
          totalVocab,
          learnedCount,
          reviewCount,
          completed: totalVocab > 0 && learnedCount >= totalVocab
        };

      })
    );

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= FIT VOCAB ================= */

export const getFitVocabularies = async (req, res) => {
  try {

    const { topicId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || !user.level) {
      return res.status(400).json({
        message: "User level not found. Please complete placement test."
      });
    }

    const userLevelIndex = levelOrder.indexOf(user.level);

    const allowedLevels = levelOrder.slice(0, userLevelIndex + 1);

    const vocabularies = await Vocabulary.find({
      topic: topicId,
      level: { $in: allowedLevels }
    });

    res.json(shuffle(vocabularies));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADVANCED VOCAB ================= */

export const getAdvancedVocabularies = async (req, res) => {
  try {

    const { topicId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || !user.level) {
      return res.status(400).json({
        message: "User level not found."
      });
    }

    const userLevelIndex = levelOrder.indexOf(user.level);

    const advancedLevels = levelOrder.slice(userLevelIndex + 1);

    const vocabularies = await Vocabulary.find({
      topic: topicId,
      level: { $in: advancedLevels }
    });

    res.json(shuffle(vocabularies));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK PROGRESS ================= */

export const markVocabularyLearned = async (req, res) => {
  try {

    const { vocabularyId, topicId, status } = req.body;
    const userId = req.user._id;

    if (!vocabularyId || !topicId) {
      return res.status(400).json({
        message: "Missing vocabularyId or topicId"
      });
    }

    const existing = await UserVocabularyProgress.findOne({
      user: userId,
      vocabulary: vocabularyId
    });

    if (existing) {

      existing.status = status || "learned";
      await existing.save();

      return res.json({
        message: "Progress updated",
        progress: existing
      });
    }

    const newProgress = await UserVocabularyProgress.create({
      user: userId,
      vocabulary: vocabularyId,
      topic: topicId,
      status: status || "learned"
    });

    res.json({
      message: "Progress saved",
      progress: newProgress
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= REVIEW ================= */

export const getReviewVocabularies = async (req, res) => {
  try {

    const userId = req.user._id;

    const progress = await UserVocabularyProgress
      .find({
        user: userId,
        status: "learned"
      })
      .populate("vocabulary");

    const vocabularies = progress
      .map(p => p.vocabulary)
      .filter(v => v !== null);

    res.json(vocabularies);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};