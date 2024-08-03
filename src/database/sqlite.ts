import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve(__dirname, "../../database/sqlite.db");

const initDb = async () => {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      duration REAL
    );
  `);

    return db;
};

export const db = initDb();
