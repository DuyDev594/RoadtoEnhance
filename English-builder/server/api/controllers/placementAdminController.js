import PlacementTestSet from "../models/PlacementTestSet.js";
import ReadingPassage from "../models/ReadingPassage.js";
import PlacementQuestion from "../models/PlacementQuestion.js"; 

export const createTestSet = async (req, res) => {
    try {
        const testSet = await PlacementTestSet.create(req.body);
        res.status(201).json(testSet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getAllTestSets = async (req, res) => {
    try {
        const testSets = await PlacementTestSet.find().sort({ createdAt: -1 });
        res.json(testSets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTestSet = async (req, res) => {
    try {
        const updated = await PlacementTestSet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteTestSet = async (req, res) => {
    try {
        await PlacementTestSet.findByIdAndDelete(req.params.id);
        res.json({ message: "Test set deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createReadingPassage = async (req, res) => {
    try {
        const { testSetId } = req.params;

        const count = await ReadingPassage.countDocuments({ testSetId });
        if (count >= 3) {
            return res.status(400).json({
                message: "Each test set can only have 3 reading passages"
            });
        }

        const passage = await ReadingPassage.create(req.body);
        res.status(201).json(passage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getReadingPassages = async (req, res) => {
    try {
        const passages = await ReadingPassage.find({
        testSetId: req.params.testSetId
        }).sort({ order: 1 });

        res.json(passages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateReadingPassage = async (req, res) => {
    try {
        const updated = await ReadingPassage.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteReadingPassage = async (req, res) => {
    try {
        await ReadingPassage.findByIdAndDelete(req.params.id);
        res.json({ message: "Passage deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createQuestion = async (req, res) => {
    try {
        const {
            testSetId,
            skill,
            questionText,
            options,
            correctAnswer,
            level,
            passageId
        } = req.body;

        // Validate chung
        if (!testSetId || !skill || !questionText || !options || !correctAnswer) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // Validate riêng cho reading
        if (skill === "reading") {
            if (!passageId) {
                return res.status(400).json({
                    message: "Reading question must belong to a passage"
                });
            }

            const passage = await ReadingPassage.findById(passageId);
            if (!passage) {
                return res.status(404).json({
                    message: "Reading passage not found"
                });
            }
        }

        // Validate vocab / grammar
        if (skill !== "reading" && !level) {
            return res.status(400).json({
                message: "Level is required for vocabulary and grammar questions"
            });
        }

        const question = new PlacementQuestion({
            testSetId,
            skill,
            questionText,
            options,
            correctAnswer,
            level: skill === "reading" ? undefined : level,
            passageId: skill === "reading" ? passageId : undefined
        });

        await question.save();

        res.status(201).json({
            message: "Question created successfully",
            question
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getQuestions = async (req, res) => {
    try {
        const { testSetId, skill, level } = req.query;

        const filter = {};
        if (testSetId) filter.testSetId = testSetId;
        if (skill) filter.skill = skill;
        if (level) filter.level = level;

        const questions = await PlacementQuestion.find(filter);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const updated = await PlacementQuestion.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        await PlacementQuestion.findByIdAndDelete(req.params.id);
        res.json({ message: "Question deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getQuestionsByPassage = async (req, res) => {
    try {
        const { passageId } = req.params;

        const questions = await PlacementQuestion.find({
            passageId,
            skill: "reading"
        }).sort({ createdAt: 1 });

        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};