import { generateTopic, evaluateEssay } from "../../services/aiService.js";

/**
 * Reset quota nếu sang ngày mới
 */
function resetDaily(user) {
  const today = new Date().toDateString();

  const last = user.aiWriting?.lastUsed
    ? new Date(user.aiWriting.lastUsed).toDateString()
    : null;

  if (today !== last) {
    user.aiWriting.dailyCount = 0;
    user.aiWriting.retryCount = 0;
    user.aiWriting.lastUsed = new Date();
  }
}

/**
 * Đếm số từ chuẩn
 */
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

/**
 * Validate AI response
 */
function validateAIResponse(data) {
  if (!data) return false;

  if (typeof data.score !== "number") return false;
  if (!data.level) return false;
  if (!Array.isArray(data.errors)) return false;

  return true;
}

/**
 * GET /topic
 */
export const getTopic = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // đảm bảo structure tồn tại
    user.aiWriting ||= {
      dailyCount: 0,
      retryCount: 0,
      lastUsed: new Date()
    };

    resetDaily(user);

    

    const topic = await generateTopic(user.level);

    await user.save();

    res.json({ topic });

  } catch (err) {
    console.error("❌ getTopic error:", err);

    res.status(500).json({
      message: "Failed to generate topic"
    });
  }
};

/**
 * POST /submit
 */
export const submitEssay = async (req, res) => {
  try {
    const { essay } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // đảm bảo structure tồn tại
    user.aiWriting ||= {
      dailyCount: 0,
      retryCount: 0,
      lastUsed: new Date()
    };

    if (!essay || typeof essay !== "string") {
      return res.status(400).json({
        message: "Essay is required"
      });
    }

    resetDaily(user);

    if (user.aiWriting.dailyCount >= 2) {
      return res.status(403).json({
        message: "Daily limit reached (2 essays)"
      });
    }

    const wordCount = countWords(essay);

    if (wordCount < 250 || wordCount > 350) {
      return res.status(400).json({
        message: "Essay must be between 250 and 350 words"
      });
    }

    // 🔥 NEW: đã là object (KHÔNG parse nữa)
    const result = await evaluateEssay(user.level, essay);

    // 🔍 validate response
    if (!validateAIResponse(result)) {
      console.error("❌ Invalid AI response:", result);

      return res.status(500).json({
        message: "AI response invalid structure"
      });
    }

    // 🎯 tăng quota chỉ khi hợp lệ
    user.aiWriting.dailyCount += 1;
    user.aiWriting.lastUsed = new Date();

    await user.save();

    res.json(result);

  } catch (err) {
    console.error("❌ submitEssay error:", err);

    res.status(500).json({
      message: "Failed to evaluate essay"
    });
  }
};