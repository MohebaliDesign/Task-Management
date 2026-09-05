/**
 * Reseed the local JSON store from scratch: `npm run seed`.
 * Writes data/db.json with the synthetic dataset in src/lib/seed.ts.
 * (Bypasses src/lib/db.ts because that module is `server-only`.)
 */
import fs from "node:fs";
import path from "node:path";
import { buildSeed } from "../src/lib/seed";

const dir = path.join(process.cwd(), "data");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "db.json"), JSON.stringify(buildSeed(), null, 2), "utf8");
// eslint-disable-next-line no-console
console.log("✓ data/db.json reseeded.");
