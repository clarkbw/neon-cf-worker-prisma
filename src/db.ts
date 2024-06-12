import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

export async function getClient(env) {
  neonConfig.webSocketConstructor = ws;
  const connectionString = `${env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const client = new PrismaClient({ adapter });
  return client;
}
