import { supabase } from "@/lib/supabase/client"

export async function retrieve(query: string) {
  const keywords = query.split(" ").filter(Boolean)

  let q = supabase.from("qlack_docs").select("*").limit(20)

  // simple OR matching (works like weak semantic search)
  keywords.forEach(k => {
    q = q.ilike("content", `%${k}%`)
  })

  const { data } = await q

  return data || []
}
