import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const model = genAI.getGenerativeModel({
  model: "embedding-001"
})

export async function embedText(text: string): Promise<number[]> {
  if (!text?.trim()) throw new Error("Empty text")

  const result = await model.embedContent(text)

  return result.embedding.values
}
