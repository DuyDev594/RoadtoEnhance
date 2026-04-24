import PlacementTestSet from "../models/PlacementTestSet.js";
import PlacementQuestion from "../models/PlacementQuestion.js";
import ReadingPassage from "../models/ReadingPassage.js";
import PlacementResult from "../models/PlacementResult.js";
import User from "../models/User.js";


export const startPlacementTest = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        const { allowed, remainingTime, completedLessons } =
            await canRetakePlacementTest(user);

        if (!allowed && user.hasTakenPlacementTest) {
            return res.status(403).json({
                message: "You are not eligible to retake yet",
                remainingTime,
                completedLessons,
                requiredLessons: 5
            });
        }


        
        const activeTestSets = await PlacementTestSet.find({ isActive: true });

        if (!activeTestSets.length) {
            return res.status(404).json({
                message: "No active placement test available"
            });
        }

        
        const usedTestSetIds = await PlacementResult.find({ userId })
            .distinct("testSetId");

        
        const availableTestSets = activeTestSets.filter(
            ts => !usedTestSetIds.some(id => id.toString() === ts._id.toString())
        );

        if (availableTestSets.length === 0) {
            return res.status(404).json({
                message: "You have completed all available placement tests."
            });
        }

        const pool = availableTestSets;
        
        const randomIndex = Math.floor(Math.random() * pool.length);
        const randomTestSet = pool[randomIndex];

        
        const placementResult = await PlacementResult.create({
            userId,
            testSetId: randomTestSet._id,
            assignedLevel: null
        });

        return res.status(200).json({
            placementResultId: placementResult._id,
            testSetId: randomTestSet._id
        });

    } catch (error) {
        console.error("startPlacementTest error:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const submitPlacementTest = async (req, res) => {
    try {
        const { answers } = req.body;
        const userId = req.user._id;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                message: "Invalid answers format"
            });
        }

        
        const questionIds = answers.map(a => a.questionId);

        const questions = await PlacementQuestion.find({
            _id: { $in: questionIds }
        });

        if (questions.length === 0) {
            return res.status(400).json({
                message: "No valid questions found"
            });
        }

        
        const passageIds = questions
            .filter(q => q.skill === "reading" && q.passageId)
            .map(q => q.passageId);

        const passages = await ReadingPassage.find({
            _id: { $in: passageIds }
        });

        const passageMap = {};
        passages.forEach(p => {
            passageMap[p._id.toString()] = p;
        });

        
        const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

        const byLevel = {
            A1: { correct: 0, total: 0 },
            A2: { correct: 0, total: 0 },
            B1: { correct: 0, total: 0 },
            B2: { correct: 0, total: 0 },
            C1: { correct: 0, total: 0 }
        };

        
        for (const answer of answers) {
            const question = questions.find(
                q => q._id.toString() === answer.questionId
            );

            if (!question) continue;

            let questionLevel = null;

            // Reading 
            if (question.skill === "reading") {
                const passage = passageMap[question.passageId?.toString()];
                if (!passage) continue;
                questionLevel = passage.level;
            }
            // Vocabulary or Grammar
            else {
                questionLevel = question.level;
            }

            if (!LEVELS.includes(questionLevel)) continue;

            byLevel[questionLevel].total += 1;

            if (answer.selectedAnswer === question.correctAnswer) {
                byLevel[questionLevel].correct += 1;
            }
        }

        
        let assignedLevel = "A1";

        for (const level of LEVELS) {
            const { correct, total } = byLevel[level];
            if (total === 0) continue;

            const accuracy = correct / total;
            if (accuracy >= 0.6) {
                assignedLevel = level;
            } else {
                break;
            }
        }

        
        const testSetId = questions[0].testSetId;

        const result = await PlacementResult.findOneAndUpdate(
            {
                userId,
                testSetId
            },
            {
                userId,
                testSetId,
                byLevel,
                assignedLevel
            },
            {
                new: true,
                upsert: true
            }
        );

        
        await User.findByIdAndUpdate(userId, {
            hasTakenPlacementTest: true,
            level: assignedLevel,
            lastPlacementTestAt: new Date()
        });

        
        return res.status(200).json({
            message: "Placement test submitted successfully",
            assignedLevel: result.assignedLevel,
            byLevel: result.byLevel,
            lastPlacementTestAt: new Date()
        });

    } catch (error) {
        console.error("submitPlacementTest error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};


export const getPlacementResult = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await PlacementResult.findOne({ userId })
            .sort({ createdAt: -1 });

        if (!result) {
            return res.status(404).json({ message: "No result found" });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getActivePlacementTest = async (req, res) => {
    try {
        const userId = req.user._id;

        
        const result = await PlacementResult.findOne({ userId })
            .sort({ createdAt: -1 });

        if (!result) {
            return res.status(404).json({
                message: "User has not started placement test"
            });
        }

        const testSetId = result.testSetId;

        const testSet = await PlacementTestSet.findById(testSetId);

        if (!testSet) {
            return res.status(404).json({
                message: "Test set not found"
            });
        }

        // Reading passages
        const readingPassages = await ReadingPassage.find({
            testSetId
        }).sort({ order: 1 });

        const readingQuestions = await PlacementQuestion.find({
            testSetId,
            skill: "reading"
        }).select("-correctAnswer");

        const readingMap = {};
        readingQuestions.forEach(q => {
            if (!readingMap[q.passageId]) {
                readingMap[q.passageId] = [];
            }
            readingMap[q.passageId].push(q);
        });

        const reading = readingPassages.map(p => ({
            ...p.toObject(),
            questions: readingMap[p._id] || []
        }));

        const vocabulary = await PlacementQuestion.find({
            testSetId,
            skill: "vocabulary"
        }).select("-correctAnswer");

        const grammar = await PlacementQuestion.find({
            testSetId,
            skill: "grammar"
        }).select("-correctAnswer");

        return res.json({
            testSetId,
            name: testSet.name,
            reading,
            vocabulary,
            grammar
        });

    } catch (err) {
        console.error("getActivePlacementTest error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const canRetakePlacementTest = async (user) => {
    const THREE_MONTHS = 90 * 24 * 60 * 60 * 1000;

    
    if (!user.lastPlacementTestAt) return { allowed: true };

    const now = Date.now();
    const lastTest = new Date(user.lastPlacementTestAt).getTime();

    const enoughTime = now - lastTest >= THREE_MONTHS;

    const completedLessons = user.lessonProgress.filter(
        l => l.status === "completed"
    ).length;

    const enoughLessons = completedLessons >= 5;

    return {
        allowed: enoughTime || enoughLessons,
        remainingTime: THREE_MONTHS - (now - lastTest),
        completedLessons
    };
};