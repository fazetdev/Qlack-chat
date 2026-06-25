import { GoogleGenAI } from "@google/genai";

console.log("GEMINI_API_KEY =", process.env.GEMINI_API_KEY);
console.log(
  "KEY PREFIX =",
  process.env.GEMINI_API_KEY?.slice(0, 15)
);

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
