import { GoogleGenAI } from "@google/genai"

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    })

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Reply exactly: GenAI works"
    })

    return Response.json({
      ok: true,
      text: response.text
    })
  } catch (e: any) {
    return Response.json({
      ok: false,
      error: e?.message || String(e)
    })
  }
}
