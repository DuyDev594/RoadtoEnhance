import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("🌐 BASE URL:", client.baseURL);
// ==========================
// CONSTANTS
// ==========================
const WORD_REQUIREMENT = "Your essay should be between 250 and 350 words.";

// ==========================
// GENERATE TOPIC (PRODUCTION READY)
// ==========================
export async function generateTopic(level) {
  console.log("🚀 START CALL OPENAI (generateTopic)");
  console.log("🔑 KEY:", process.env.OPENAI_API_KEY?.slice(0, 10));
  const prompt = `
You are an English teacher.

Generate ONE writing topic for CEFR level ${level}.

STRICT REQUIREMENTS:
- The topic MUST be suitable for ${level} learners
- MUST include this EXACT sentence at the end:
"${WORD_REQUIREMENT}"
- DO NOT omit or modify this sentence
- Use clear and natural English
- Provide a real-life context
- Encourage personal opinion

Example:
"Describe your favorite place to relax. Explain why you like it and how often you go there. ${WORD_REQUIREMENT}"

Return ONLY the topic text. No explanation.
`;

  try {
  console.log("🔥 BEFORE CALL OPENAI (generateTopic)");

  const res = await client.responses.create({
  model: "gpt-4.1-mini",
  input: prompt,
});
  console.log("✅ FULL RESPONSE:", res);
  console.log("📊 USAGE:", res.usage);
  console.log("✅ OPENAI SUCCESS (generateTopic)");

  let topic = res.output?.[0]?.content?.[0]?.text?.trim() || "";

  if (!topic.includes("250") || !topic.includes("350")) {
    topic += " " + WORD_REQUIREMENT;
  }

  return topic;

} catch (err) {
  console.error("❌ generateTopic error:", err.response?.data || err.message);

  return `Write about your daily routine and explain why it is important to you. ${WORD_REQUIREMENT}`;
}}

// ==========================
// SAFE JSON PARSE
// ==========================
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ JSON parse error:", text);

    return {
      score: 0,
      level: "A1",
      feedback: "AI response error. Please try again.",
      errors: [],
      globalIssues: ["System could not analyze this essay properly."]
    };
  }
}

// ==========================
// EVALUATE ESSAY (STRICT + STABLE)
// ==========================
export async function evaluateEssay(level, essay) {
  console.log("🚀 START CALL OPENAI (evaluateEssay)");
console.log("🔑 KEY:", process.env.OPENAI_API_KEY?.slice(0, 10));
  const prompt = `
You are a strict English examiner based on CEFR.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no explanation.
- "original" MUST be an EXACT substring from the essay.
- Each "original" must be SHORT (max 10 words).
- DO NOT include long paragraphs in "original".
- Limit to MAX 5 grammar errors.
- "suggestion" MUST be a corrected version (not explanation).
- Separate grammar errors and global issues clearly.

TASK:
1. Score the essay (0–100)
2. Assign CEFR level (A1–C1)
3. Provide general feedback (2–3 sentences)
4. Detect grammar mistakes
5. Detect global issues (repetition, coherence, structure)

RETURN FORMAT:

{
  "score": number,
  "level": "A1|A2|B1|B2|C1",
  "feedback": "string",
  "errors": [
    {
      "type": "grammar",
      "original": "exact phrase from essay",
      "suggestion": "corrected phrase",
      "explanation": "short explanation"
    }
  ],
  "globalIssues": [
    "string"
  ]
}

Essay:
${essay}
`;

  try {
  console.log("🔥 BEFORE CALL OPENAI (evaluateEssay)");

  const res = await client.responses.create({
  model: "gpt-4.1-mini",
  input: prompt,
});

  console.log("✅ OPENAI SUCCESS (evaluateEssay)");

  const raw = res.output?.[0]?.content?.[0]?.text || "";

  console.log("✅ FULL RESPONSE:", res);
  console.log("📊 USAGE:", res.usage);
  console.log("📥 RAW RESPONSE:", raw);

  return safeParse(raw);

} catch (err) {
  console.error("❌ OpenAI error:", err.response?.data || err.message);

  return {
    score: 0,
    level: "A1",
    feedback: "System error. Please try again later.",
    errors: [],
    globalIssues: []
  };
}
}