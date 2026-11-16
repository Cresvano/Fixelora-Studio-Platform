import * as dotenv from "dotenv";
// Ensure environment variables are loaded both in Next.js and in standalone scripts
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  console.warn("Notice: DATABASE_URL not detected in process environment.");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
