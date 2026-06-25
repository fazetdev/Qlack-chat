import { ai } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message || "Say OK",
    });

    return Response.json({
      reply: result.text || "No response",
    });

  } catch (err: any) {
    console.error("GEMINI ERROR:", err);

    return Response.json(
      {
        error: err?.message || String(err),
      },
      {
        status: 500,
      }
    );
  }
}
