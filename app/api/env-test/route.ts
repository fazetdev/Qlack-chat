export async function GET() {
  return Response.json({
    hasKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY?.slice(0, 6)
  })
}
