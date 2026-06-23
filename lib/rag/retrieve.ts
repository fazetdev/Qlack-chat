import { sql } from "@/lib/db/neon";

export async function retrieve(query: string) {
  const rows = await sql`
    SELECT
      id,
      content,
      source,
      document_id,
      chunk_index,
      ts_rank(search_vector, plainto_tsquery('english', ${query})) AS score
    FROM document_chunks
    WHERE search_vector @@ plainto_tsquery('english', ${query})
    ORDER BY score DESC
    LIMIT 15
  `;

  // 1. remove empty content
  let cleaned = rows.filter(r => r.content && r.content.trim().length > 20);

  // 2. remove duplicates (basic content dedupe)
  const seen = new Set();
  cleaned = cleaned.filter(r => {
    const key = r.content.trim().slice(0, 120);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 3. apply score threshold (keep only meaningful matches)
  cleaned = cleaned.filter(r => Number(r.score || 0) > 0.01);

  // 4. normalize score
  return cleaned.map(r => ({
    ...r,
    score: Number(r.score || 0)
  }));
}
