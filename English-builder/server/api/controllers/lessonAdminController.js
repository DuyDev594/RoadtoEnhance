import Topic from "../models/Topic.js";
import Lesson from "../models/Lesson.js";

// CREATE topic
export const createTopic = async (req, res) => {
    try {
        const { title, level, description } = req.body;

         const errors = {};

        if (!title) errors.title = "Title is required";
        if (!level) errors.level = "Level is required";

        if (!["A1", "A2", "B1", "B2", "C1"].includes(level)) {
            errors.level = "Invalid level";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        // tìm order lớn nhất trong cùng level
        const lastTopic = await Topic.findOne({ level })
        .sort({ order: -1 });

        const nextOrder = lastTopic ? lastTopic.order + 1 : 1;

        const topic = await Topic.create({
        title,
        description,
        level,
        order: nextOrder,
        isPublished: false
        });

        res.status(201).json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET all topics (admin)
export const getAllTopics = async (req, res) => {
    try {
        const levelOrder = ["A1", "A2", "B1", "B2", "C1"];
        const topics = await Topic.find();

        topics.sort((a, b) => {
            return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
        });

        res.json(topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE topic
export const updateTopic = async (req, res) => {
    try {
        const { title, level } = req.body;
            const errors = {};
        if (!title) errors.title = "Title is required";
        if (level && !["A1", "A2", "B1", "B2", "C1"].includes(level)) {
            errors.level = "Invalid level";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const topic = await Topic.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        res.json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE topic
export const deleteTopic = async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.id);
        await Lesson.deleteMany({ topicId: req.params.id }); // cleanup
        res.json({ message: "Topic deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lesons

// CREATE lesson
export const createLesson = async (req, res) => {
    try {
        const { topicId, title, type } = req.body;

        const errors = {};

        if (!topicId) errors.topicId = "Topic is required";
        if (!title) errors.title = "Title is required";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const lastLesson = await Lesson.findOne({ topicId })
            .sort({ order: -1 });

        const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

        const lesson = await Lesson.create({
            topicId,
            title,
            type: type || "video",
            order: nextOrder,
            isPublished: false
        });

        res.status(201).json(lesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET lessons by topic
export const getLessonsByTopic = async (req, res) => {
    try {
        const lessons = await Lesson.find({ topicId: req.query.topicId })
        .sort({ order: 1 });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET lesson detail (admin)
export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        res.json(lesson);
    } catch (err) {
        res.status(404).json({ message: "Lesson not found" });
    }
};

// UPDATE lesson
export const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE lesson
export const deleteLesson = async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: "Lesson deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const publishLesson = async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    lesson.isPublished = true;
    await lesson.save();

    res.json({ message: "Lesson published" });
};

// video 

export const updateVideoInfo = async (req, res) => {
    try {
        // Kiểm tra an toàn để tránh lỗi 500 do match()
        const videoIdInput = req.body.videoId || ""; 
        
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = videoIdInput.match(regExp);
        const videoId = (match && match[7].length === 11) ? match[7] : videoIdInput;

        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        // Cập nhật theo đúng cấu trúc Schema
        lesson.video = { 
            provider: "youtube", 
            videoId: videoId 
        };
        
        await lesson.save();
        res.json(lesson.video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Segments feature

// ADD segment
export const addSegment = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        if (lesson.type !== "video") {
            return res.status(400).json({
                message: "Cannot add segments to grammar lesson"
            });
        }
        const nextOrder = lesson.segments.length + 1;

        const segment = {
            order: nextOrder,
            start: Number(req.body.start),
            end: Number(req.body.end),
            transcript: req.body.transcript,
            dictation: req.body.dictation || {},
            hints: req.body.hints || [],
            grammarTag: req.body.grammarTag || ""
        };

        lesson.segments.push(segment);
        await lesson.save();

        res.status(201).json(lesson.segments.at(-1));
    } catch (err) {
        console.error("ADD SEGMENT ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE segment (by index)
export const updateSegment = async (req, res) => {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const segment = lesson.segments.id(req.params.segmentId);
    if (!segment) return res.status(404).json({ message: "Segment not found" });

    Object.assign(segment, req.body);
    await lesson.save();

    res.json(segment);
};

// DELETE segment
export const deleteSegment = async (req, res) => {
    const { lessonId, segmentId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
    }

    const segment = lesson.segments.id(segmentId);
    if (!segment) {
        return res.status(404).json({ message: "Segment not found" });
    }

    segment.deleteOne();
    await lesson.save();

    res.json({ message: "Segment deleted" });
};


// Grammar  

export const updateGrammar = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        // Lấy dữ liệu từ FE (FE sẽ gửi { explanation: "..." })
        const { explanation } = req.body;

        // FIX LỖI "Cannot create field": 
        // Nếu grammar cũ đang là Array, ta ép nó về Object rỗng trước khi gán
        if (Array.isArray(lesson.grammar)) {
            lesson.grammar = { explanation: "" };
        }

        lesson.grammar.explanation = explanation || "";
        
        await lesson.save();
        res.json(lesson.grammar);
    } catch (err) {
        console.error("UPDATE GRAMMAR ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
// review

export const updateReview = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        if (!req.body || !Array.isArray(req.body.questions)) {
            return res.status(400).json({ message: "Invalid review format" });
        }

        lesson.review = {
            type: "quiz_text",
            questions: req.body.questions
        };

        await lesson.save();

        res.json(lesson.review);
    } catch (err) {
        console.error("UPDATE REVIEW ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};