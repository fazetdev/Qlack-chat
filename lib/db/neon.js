const { neon } = require("@neondatabase/serverless");

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

const sql = neon(databaseUrl);

module.exports = { sql };
