export const SITE_URL = "https://qlack.vercel.app"

export const ROUTES = [
  "/",
  "/faq",
  "/pricing",
  "/how-it-works",
  "/privacy",
  "/policy",
  "/disclaimer",
  "/samples",
]

export async function fetchPage(route: string) {
  const res = await fetch(SITE_URL + route)

  if (!res.ok) {
    throw new Error(
      `Failed ${route}: ${res.status}`
    )
  }

  return await res.text()
}

export function extractText(html: string) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
