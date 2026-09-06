import path from "node:path";
import { app } from "electron";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

let sqlite: Database.Database | undefined;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export const getDb = () => {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = path.join(app.getPath("userData"), "mementolane.sqlite3");
  sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");

  dbInstance = drizzle(sqlite, { schema });

  migrate(dbInstance, {
    migrationsFolder: path.join(__dirname, "..", "..", "drizzle"),
  });

  return dbInstance;
};
