import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function GET() {
  const models = await genAI.listModels()
  return Response.json(models)
}
