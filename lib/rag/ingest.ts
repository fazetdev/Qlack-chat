import { sql } from "@/lib/db/neon";

export async function ingestText(content: string, source: string) {
  const chunks = chunkText(content, 800);

  // 1. Create document record
  const docResult = await sql`
    INSERT INTO documents (source, content)
    VALUES (${source}, ${content})
    RETURNING id
  `;

  const documentId = docResult[0]?.id;

  if (!documentId) {
    throw new Error("Failed to create document");
  }

  // 2. Insert chunks linked to document
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    await sql`
      INSERT INTO document_chunks (
        document_id,
        chunk_index,
        content,
        search_vector
      )
      VALUES (
        ${documentId},
        ${i},
        ${chunk},
        to_tsvector('english', ${chunk})
      )
    `;
  }

  console.log("INGEST COMPLETE:", source, "DOC_ID:", documentId);
}

function chunkText(text: string, size: number) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
