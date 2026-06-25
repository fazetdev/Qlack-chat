require("dotenv").config({ path: ".env.local" });

const https = require("https");

const body = JSON.stringify({
  contents: [
    {
      parts: [
        {
          text: "Say OK"
        }
      ]
    }
  ]
});

const req = https.request(
  {
    hostname: "generativelanguage.googleapis.com",
    path: "/v1beta/models/gemini-2.5-flash:generateContent",
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  },
  (res) => {
    let data = "";

    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      console.log("STATUS:", res.statusCode);
      console.log(data);
    });
  }
);

req.on("error", console.error);
req.write(body);
req.end();
