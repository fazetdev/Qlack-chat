import { ai } from "@/lib/ai/gemini";
import { retrieve } from "@/lib/rag/retrieve";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const userQuery = message || "Say OK";

    // 1. Dynamic Search Expansion: Include semantic synonyms to help Full-Text Search match chunks
    let expandedQuery = userQuery;
    const lowerQuery = userQuery.toLowerCase().trim();
    
    if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("tier") || lowerQuery.includes("subscription")) {
      expandedQuery = `${userQuery} price pricing subscription cost plans tiers dollars`;
    } else if (lowerQuery.includes("work") || lowerQuery.includes("do") || lowerQuery.includes("use")) {
      expandedQuery = `${userQuery} workflow features document notes pdf voice recording structure`;
    }

    console.log(`[QLACK-RAG] Querying knowledge base with expansion: "${expandedQuery}"`);
    const contextChunks = await retrieve(expandedQuery);
    
    const contextText = contextChunks && contextChunks.length > 0
      ? contextChunks.map((c: any) => `- ${c.content}`).join("\n\n")
      : "";

    // 2. Execute content generation grounded strictly by your dynamic database chunks
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: `You are Q-BOT, the premium product-information assistant for Qlack.
Your job is to answer questions about Qlack using ONLY the provided documentation context pulled from our database.

[PRODUCT DESCRIPTION]
Qlack is an academic productivity tool that transforms raw student materials (notes, PDFs, screenshots, lecture materials, audio notes/voice recordings) into a beautifully structured academic writing framework. It helps students understand and organize thoughts before drafting papers.
CRITICAL CONSTRAINT: Qlack is NOT an essay-mill and never generates finished academic submissions or completes assignments automatically.

[APPROVED RETRIEVED CONTEXT]
${contextText || "No matching database documentation found for this query."}

[BEHAVIORAL INSTRUCTIONS]
- Keep answers professional, concise, premium, and friendly.
- Rely on the Approved Retrieved Context to answer details about features, workflows, and pricing tiers.
- IMPORTANT: If the context text is empty or does not contain specific figures to answer the question, do not make up numbers. Instead, politely tell the user what Qlack does generally and ask them to specify if they are looking for specific plan tiers, workflows, or material features so you can search the index again.`
      }
    });

    return Response.json({
      reply: result.text || "No response",
    });

  } catch (err: any) {
    console.error("GEMINI RUNTIME ERROR:", err);
    return Response.json(
      {
        error: `RAG processing runtime error. ${err?.message || String(err)}`,
      },
      {
        status: 500,
      }
    );
  }
}
