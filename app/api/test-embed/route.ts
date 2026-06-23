import { embedText } from "../../../lib/gemini/embed"

export async function GET() {
  const vec = await embedText("test embedding")

  return Response.json({
    length: vec.length,
    sample: vec.slice(0, 5)
  })
}
