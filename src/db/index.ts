import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import * as schema from "@/db/schema";

const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_NEON_DATABASE_URL!,
});
const db = drizzle({ client: pool, schema: schema });

export default db;
