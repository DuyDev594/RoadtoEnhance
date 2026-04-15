// api/controllers/lessonController.js
import  Topic from "../models/Topic.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

function getNextLevel(level) {
    const idx = LEVELS.indexOf(level);
    return LEVELS[idx + 1] || null;
}

export const getTopicsForUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const lessonProgress = user.lessonProgress || [];
        const currentLevel = user.level;
        const nextLevel = getNextLevel(currentLevel);

        
        const topics = await Topic.find({
            level: { $in: [currentLevel, nextLevel] },
            isPublished: true
        }).sort({ order: 1 });

        let currentTopics = [];
        let nextTopics = [];

        
        for (let topic of topics) {

            const lessons = await Lesson.find({
                topicId: topic._id,
                isPublished: true
            });

            const lessonIds = lessons.map(l => l._id.toString());

            const completedLessons = lessonProgress.filter(lp =>
                lessonIds.includes(lp.lessonId?.toString()) &&
                lp.status === "completed"
            );

            const percent = lessons.length === 0
                ? 0
                : completedLessons.length / lessons.length;

            const topicData = {
                ...topic.toObject(),
                progress: percent,
                isCompleted: percent === 1
            };

            if (topic.level === currentLevel) {
                currentTopics.push(topicData);
            } else {
                nextTopics.push(topicData);
            }
        }

        
        const currentTopicIds = currentTopics.map(t => t._id.toString());

            
            const allLessonsCurrentLevel = await Lesson.find({
                topicId: { $in: currentTopicIds },
                isPublished: true
            });

            const allLessonIds = allLessonsCurrentLevel.map(l => l._id.toString());

            
            const completedLessons = lessonProgress.filter(lp =>
                allLessonIds.includes(lp.lessonId?.toString()) &&
                lp.status === "completed"
            );

            
            const levelProgress = allLessonsCurrentLevel.length === 0
                ? 0
                : completedLessons.length / allLessonsCurrentLevel.length;

            
            const unlockNextLevel = levelProgress >= 0.8;

        res.json({
            currentLevel,
            nextLevel,
            unlockNextLevel,
            currentTopics,
            nextTopics
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load topics" });
    }
};

export const getLessonsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        const lessons = await Lesson.find({
            topicId,
            isPublished: true
        })
            .select("title order isPublished")
            .sort({ order: 1 });

        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: "Failed to load lessons" });
    }
};

export const getLessonDetail = async (req, res) => {
    try {

        const lesson = await Lesson.findOne({
            _id: req.params.id,
            isPublished: true
        });

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const user = await User.findById(req.user.id);

        const progress = user.lessonProgress.find(
            lp => lp.lessonId.toString() === lesson._id.toString()
        );

        res.json({
            lesson,
            progress: progress || null
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to load lesson" });
    }
};

// Progress

export const updateLessonProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const lessonId = req.params.id;
        
        
        const { score } = req.body; 
        
        
        const status = score >= 80 ? "completed" : "in_progress";

        if (!user.lessonProgress) user.lessonProgress = [];

        const index = user.lessonProgress.findIndex(
            lp => lp.lessonId?.toString() === lessonId
        );

        const progressData = {
            lessonId,
            status,
            score: score, 
            updatedAt: new Date()
        };

        if (index === -1) {
            user.lessonProgress.push(progressData);
        } else {
            user.lessonProgress[index].status = status;
            user.lessonProgress[index].score = score;
            user.lessonProgress[index].updatedAt = new Date();
        }

        await user.save();

        
        res.json({ 
            message: status === "completed" ? "Lesson passed!" : "Score too low!",
            status,
            lessonProgress: user.lessonProgress 
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update progress failed" });
    }
};

export const updateSegmentProgress = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)

    const { lessonId, segmentIndex } = req.body

    let progress = user.lessonProgress.find(
      lp => lp.lessonId?.toString() === lessonId
    )

    if (!progress) {

      progress = {
        lessonId,
        status: "in_progress",
        completedSegments: [segmentIndex],
        updatedAt: new Date()
      }

      user.lessonProgress.push(progress)

    } else {

      if (!progress.completedSegments)
        progress.completedSegments = []

      if (!progress.completedSegments.includes(segmentIndex)) {
        progress.completedSegments.push(segmentIndex)
      }

      progress.status = "in_progress"
      progress.updatedAt = new Date()

    }

    await user.save()

    res.json({
      message: "Segment progress saved",
      lessonProgress: user.lessonProgress
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({ message: "Segment progress failed" })

  }
};