require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const rows = await sql`
    SELECT
      column_name,
      data_type
    FROM information_schema.columns
    WHERE table_name = 'document_chunks'
    ORDER BY ordinal_position
  `;

  console.log(rows);
}

run();
