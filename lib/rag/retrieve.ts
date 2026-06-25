import { sql } from "@/lib/db/neon";

export async function retrieve(query: string) {
  const rows = await sql`
    SELECT
      id,
      document_id,
      chunk_index,
      content,
      ts_rank(
        search_vector,
        plainto_tsquery('english', ${query})
      ) AS score
    FROM document_chunks
    WHERE search_vector @@ plainto_tsquery('english', ${query})
    ORDER BY score DESC
    LIMIT 10
  `;

  return rows.map((r: any) => ({
    ...r,
    score: Number(r.score || 0)
  }));
}
