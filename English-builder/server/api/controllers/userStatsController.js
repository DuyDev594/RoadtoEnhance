import User from "../models/User.js";
import UserVocabularyProgress from "../models/UserVocabularyProgress.js";

export const getLearningActivity = async (req, res) => {
  try {

    const userId = req.user._id;

    const user = await User.findById(userId);

    /* ===== LESSON ACTIVITY ===== */

    const lessonMap = {};

    user.lessonProgress.forEach(p => {

      if (p.status !== "completed") return;

      const date = new Date(p.updatedAt)
        .toISOString()
        .split("T")[0];

      if (!lessonMap[date]) lessonMap[date] = 0;

      lessonMap[date] += 1;
    });

    /* ===== FLASHCARD ACTIVITY ===== */

    const flashcards = await UserVocabularyProgress.aggregate([
      {
        $match: {
          user: userId,
          status: "learned"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt"
            }
          },
          flashcards: { $sum: 1 }
        }
      }
    ]);

    /* ===== MERGE RESULT ===== */

    const result = {};

    Object.keys(lessonMap).forEach(date => {
      result[date] = {
        date,
        lessons: lessonMap[date],
        flashcards: 0
      };
    });

    flashcards.forEach(f => {

      if (!result[f._id]) {
        result[f._id] = {
          date: f._id,
          lessons: 0,
          flashcards: 0
        };
      }

      result[f._id].flashcards = f.flashcards;

    });

    res.json(Object.values(result));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load activity" });
  }
};