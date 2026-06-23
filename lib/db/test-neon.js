require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function test() {
  const result = await sql`SELECT NOW() as time`;
  console.log("NEON OK:", result);
}

test();
