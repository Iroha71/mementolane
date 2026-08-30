import { drizzle } from "drizzle-orm/node-sqlite";
import { migrate } from "drizzle-orm/node-sqlite/migrator";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "app.db");
const MIGRATIONS_DIR = path.join(process.cwd(), "public", "drizzle");

function createDb() {
  mkdirSync(DATA_DIR, { recursive: true });

  const sqlite = new DatabaseSync(DB_FILE);
  sqlite.exec("PRAGMA journal_mode = WAL");
  sqlite.exec("PRAGMA foreign_keys = ON");

  const db = drizzle({ client: sqlite });
  migrate(db, { migrationsFolder: MIGRATIONS_DIR });

  return db;
}

const globalForDb = globalThis as typeof globalThis & {
  __todoDb?: ReturnType<typeof createDb>;
};

export const db = globalForDb.__todoDb ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.__todoDb = db;

export { DB_FILE };
