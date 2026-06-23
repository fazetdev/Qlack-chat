import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function askGemini(message: string, context: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `
You are Qlack chatbot.

You only answer using this context:
---
${context}
---

Rules:
- Be clear and short
- Explain Qlack only
- If unknown, say "I don’t know from Qlack data"

User: ${message}
`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
