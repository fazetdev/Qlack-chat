import { supabase } from "@/lib/supabase/client"

export async function ingestText(content: string, source: string) {
  const chunks = chunkText(content, 800)

  for (const chunk of chunks) {
    const { data, error } = await supabase
      .from("qlack_docs")
      .insert({
        content: chunk,
        source
      })
      .select()

    if (error) {
      console.log("INSERT ERROR:", error.message)
    } else {
      console.log("INSERT OK:", data?.length)
    }
  }
}

function chunkText(text: string, size: number) {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}
