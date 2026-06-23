import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || ""
    )

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const result = await model.generateContent(
      "Reply with exactly: Gemini works"
    )

    return Response.json({
      ok: true,
      text: result.response.text()
    })
  } catch (err: any) {
    return Response.json({
      ok: false,
      error: err?.message || String(err)
    })
  }
}
