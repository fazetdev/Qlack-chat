export async function validateGeminiKey() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return {
      ok: false,
      type: "missing",
      error: "GEMINI_API_KEY not found"
    };
  }

  const keyType =
    key.startsWith("AQ.")
      ? "AQ"
      : key.startsWith("AIza")
      ? "AIza"
      : "unknown";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say OK"
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        type: keyType,
        status: res.status,
        error: data?.error?.message || "Gemini request failed"
      };
    }

    return {
      ok: true,
      type: keyType
    };
  } catch (err: any) {
    return {
      ok: false,
      type: keyType,
      error: err?.message || "Network error"
    };
  }
}
