import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export async function GET() {
  return Response.json({
    models: ["gemini-2.5-flash", "gemini-1.5-flash"]
  });
}
