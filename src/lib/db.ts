import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Database } from "./domain";
import { buildSeed } from "./seed";

/**
 * Lightweight local persistence: a single JSON document on disk.
 *
 * This is a deliberate, documented alternative to the SQLite/Drizzle stack the
 * brief lists as "preferred" — see docs/OPEN_PRODUCT_DECISIONS.md. It keeps the
 * prototype dependency-free of native modules (reliable on Windows), while still
 * being a real server-side read/write layer driven by server actions.
 *
 * Concurrency note: for a single-user local prototype a naive read-modify-write
 * is sufficient. Swapping in SQLite later only touches this file + queries.ts.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function seedIfMissing() {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const seed = buildSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

export function readDb(): Database {
  seedIfMissing();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw) as Database;
}

export function writeDb(db: Database): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

/** Read, mutate in place, persist — the single mutation primitive. */
export function mutate<T>(fn: (db: Database) => T): T {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

/** Force a reseed (used by `npm run seed`). */
export function resetDb(): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(buildSeed(), null, 2), "utf8");
}
