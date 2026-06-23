import { runIngestion } from "@/lib/rag/run-ingestion"

export async function GET() {
  const result = await runIngestion()

  return Response.json({
    ok: true,
    result
  })
}
