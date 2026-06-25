require("dotenv").config({ path: ".env.local" });

async function test() {
  const key = process.env.GEMINI_API_KEY;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
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

  const data = await res.json();

  console.log("STATUS:", res.status);
  console.log(JSON.stringify(data, null, 2));
}

test();
