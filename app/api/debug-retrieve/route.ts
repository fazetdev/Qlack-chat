import { retrieve } from "@/lib/rag/retrieve"

export async function GET() {
try {
const docs = await retrieve("test")

return Response.json({
  count: docs?.length || 0,
  docs
})

} catch (err: any) {
return Response.json({
error: err?.message || String(err)
})
}
}
