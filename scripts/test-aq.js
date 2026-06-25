require("dotenv").config({ path: ".env.local" });

async function run() {
  const key = process.env.GEMINI_API_KEY;

  console.log("KEY PREFIX:", key?.slice(0, 12));

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": key,
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

  console.log("STATUS:", res.status);
  console.log(await res.text());
}

run().catch(console.error);
