import { generateTopic, evaluateEssay } from "../../services/aiService.js";


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


function countWords(text) {
  return text.trim().split(/\s+/).length;
}

//Validate AI response

function validateAIResponse(data) {
  if (!data) return false;

  if (typeof data.score !== "number") return false;
  if (!data.level) return false;
  if (!Array.isArray(data.errors)) return false;

  return true;
}

//GET /topic

export const getTopic = async (req, res) => {
  try {
    console.log("API HIT: /api/writing/topic");
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    user.aiWriting ||= {
      dailyCount: 0,
      retryCount: 0,
      lastUsed: new Date()
    };

    user.aiWriting.currentTopic ||= null;
    user.aiWriting.hasSubmitted ||= false;

    resetDaily(user);

    if (user.aiWriting.currentTopic && !user.aiWriting.hasSubmitted) {
      return res.json({
        topic: user.aiWriting.currentTopic,
        aiWriting: user.aiWriting
      });
    }

    // 🧠 CASE 2: chưa có topic hoặc đã submit → tạo mới
    const topic = await generateTopic(user.level);

    // lưu topic mới
    user.aiWriting.currentTopic = topic;
    user.aiWriting.hasSubmitted = false;

    await user.save();

    res.json({
      topic,
      aiWriting: user.aiWriting
    });

  } catch (err) {
    console.error("getTopic error:", err);

    res.status(500).json({
      message: "Failed to generate topic"
    });
  }
};

//POST /submit
 
export const submitEssay = async (req, res) => {
  try {
    console.log("API HIT: /api/writing/submit");
    const { essay } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    user.aiWriting ||= {
      dailyCount: 0,
      retryCount: 0,
      lastUsed: new Date()
    };

    user.aiWriting.currentTopic ||= null;
    user.aiWriting.hasSubmitted ||= false;

    if (!essay || typeof essay !== "string") {
      return res.status(400).json({
        success: false,
        errorCode: "EMPTY_ESSAY",
        message: "Essay is required"
      });
    }

    resetDaily(user);

    if (user.aiWriting.dailyCount >= 2) {
      return res.status(403).json({
        success: false,
        errorCode: "DAILY_LIMIT",
        message: "Daily limit reached (2 essays)"
      });
    }

    const wordCount = countWords(essay);

    if (wordCount < 200 || wordCount > 350) {
      return res.status(400).json({
        success: false,
        errorCode: "WORD_LIMIT",
        message: "Essay must be between 200 and 350 words"
      });
    }

    
    const result = await evaluateEssay(user.level, essay);

    // validate response
    if (!validateAIResponse(result)) {
      console.error("Invalid AI response:", result);

      return res.status(500).json({
        message: "AI response invalid structure"
      });
    }

    
    user.aiWriting.dailyCount += 1;
    user.aiWriting.lastUsed = new Date();

    // 🔥 QUAN TRỌNG
    user.aiWriting.hasSubmitted = true;

   

    await user.save();

    res.json({...result, aiWriting: user.aiWriting});

  } catch (err) {
    console.error("submitEssay error:", err);

    res.status(500).json({
      success: false,
      errorCode: "AI_ERROR",
      message: "Failed to evaluate essay"
    });
  }
};

export const nextTopic = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.aiWriting ||= {
      dailyCount: 0,
      retryCount: 0,
      lastUsed: new Date()
    };

    user.aiWriting.currentTopic ||= null;
    user.aiWriting.hasSubmitted ||= false;

    resetDaily(user);

    if (user.aiWriting.dailyCount >= 2) {
      return res.status(403).json({
        success: false,
        errorCode: "DAILY_LIMIT",
        message: "Daily limit reached"
      });
    }

    const topic = await generateTopic(user.level);

    user.aiWriting.currentTopic = topic;
    user.aiWriting.hasSubmitted = false;

    await user.save();

    res.json({
      topic,
      aiWriting: user.aiWriting
    });

  } catch (err) {
    console.error("nextTopic error:", err);

    res.status(500).json({
      message: "Failed to generate next topic"
    });
  }
};