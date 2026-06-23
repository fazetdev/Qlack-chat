import { retrieve } from "@/lib/rag/retrieve"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")

const MODEL = "gemini-2.5-flash"

function compressContext(docs: any[]) {
  const seen = new Set<string>()
  const lines: string[] = []

  for (const doc of docs) {
    const text = (doc.content || "").trim()
    if (!text || text.length < 20) continue

    const key = text.slice(0, 120)
    if (seen.has(key)) continue
    seen.add(key)

    lines.push(text)
  }

  return lines.join("\n\n")
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message?.trim()) {
      return new Response("Empty message", { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return new Response("Missing API key", { status: 500 })
    }

    const docs = await retrieve(message)
    const context = compressContext(docs.slice(0, 6))

    const prompt = `
You are Qlack AI.

RULES:
- Use ONLY CONTEXT
- If missing info say: "I don't know based on available data"
- Be concise

CONTEXT:
${context}

QUESTION:
${message}

ANSWER:
`.trim()

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    )

    if (!response.ok || !response.body) {
      return new Response("Stream error", { status: 500 })
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.trim()) continue

            try {
              const json = JSON.parse(line.replace("data: ", ""))
              const text =
                json?.candidates?.[0]?.content?.parts?.[0]?.text

              if (text) {
                controller.enqueue(encoder.encode(text))
              }
            } catch {}
          }
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (err: any) {
    return new Response(err.message || "Error", { status: 500 })
  }
}
