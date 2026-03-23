import OpenAI from "openai";
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: "Say hello"
        }
      ],
    });

    console.log("RESULT:");
    console.log(res.choices[0].message.content);

  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

console.log("API KEY:", process.env.OPENAI_API_KEY);

main();