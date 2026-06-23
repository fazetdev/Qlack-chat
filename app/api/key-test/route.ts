import { GoogleGenAI } from "@google/genai"

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || ""
    })

    return Response.json({
      ok: true,
      keyLoaded: !!process.env.GEMINI_API_KEY,
      keyPrefix: process.env.GEMINI_API_KEY?.slice(0, 6)
    })
  } catch (e: any) {
    return Response.json({
      ok: false,
      error: e?.message || String(e)
    })
  }
}
