import { sql } from "./neon";

export async function testConnection() {
  const result = await sql`SELECT NOW() as time`;
  console.log("NEON CONNECTED:", result);
}
