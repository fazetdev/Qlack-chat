import { retrieve } from "@/lib/rag/retrieve"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")

const MODEL = "gemini-2.5-flash"

export async function POST(req: Request) {
try {
const { message } = await req.json()

if (!message?.trim()) {
  return Response.json(
    { error: "Empty message" },
    { status: 400 }
  )
}

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  return Response.json(
    { error: "GEMINI_API_KEY missing" },
    { status: 500 }
  )
}

const docs = await retrieve(message)

const context = docs
  .slice(0, 4)
  .map((d: any) => (d.content || "").slice(0, 800))
  .join("\n---\n")

const prompt = `

You are Qlack AI.

CONTEXT:
${context}

QUESTION:
${message}
`

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  }
)

const data = await res.json()

if (!res.ok) {
  return Response.json(
    {
      error: "Gemini API error",
      raw: data
    },
    { status: res.status }
  )
}

const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text

return Response.json({
  reply: text || "No response"
})

} catch (err: any) {
return Response.json(
{
error: err?.message || String(err)
},
{ status: 500 }
)
}
}
