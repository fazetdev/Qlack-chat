require("dotenv").config({ path: ".env.local" });

const { GoogleGenAI } = require("@google/genai");

async function run() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say OK"
  });

  console.log(response.text);
}

run().catch(console.error);
