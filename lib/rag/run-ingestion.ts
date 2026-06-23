import { ROUTES, fetchPage, extractText } from "./crawl"
import { ingestText } from "./ingest"

export async function runIngestion() {
  let ingested = 0
  let failed = 0

  for (const route of ROUTES) {
    try {
      const html = await fetchPage(route)

      const text = extractText(html)

      console.log(
        route,
        "html:",
        html.length,
        "text:",
        text.length
      )

      if (!text || text.length < 50) {
        console.log("Skipped:", route)
        continue
      }

      await ingestText(text, route)

      ingested++

      console.log("Ingested:", route)
    } catch (e) {
      failed++
      console.log("Failed:", route, e)
    }
  }

  return {
    ingested,
    failed,
    routes: ROUTES.length
  }
}
