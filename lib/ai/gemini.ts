import { GoogleGenAI } from "@google/genai";

// Standardize local environment configurations
const apiKey = process.env.GEMINI_API_KEY || "";
const prefix = apiKey ? apiKey.slice(0, 4) : "NONE";

console.log(`[QLACK-INIT] Initializing Gemini client with key prefix: ${prefix}...`);

// Prevent internal SDK overrides by removing competing OAuth/Cloud credentials from current execution context
if (process.env.GOOGLE_API_KEY) {
  console.log(`[QLACK-INIT] Found conflicting GOOGLE_API_KEY prefix: ${process.env.GOOGLE_API_KEY.slice(0, 4)}. Clearing fallback.`);
  delete process.env.GOOGLE_API_KEY;
}

export const ai = new GoogleGenAI({
  apiKey: apiKey,
});
