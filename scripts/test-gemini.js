require("dotenv").config({ path: ".env.local" });

async function test() {
  const key = process.env.GEMINI_API_KEY;

  console.log("KEY EXISTS:", !!key);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "Say OK" }]
            }
          ]
        })
      }
    );

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("ERROR:", err.message);
  }
}

test();
