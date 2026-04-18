#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, "..", "supabase", "migrations");

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error(
    "Missing SUPABASE_DB_URL in environment.\n" +
      "Get it from Supabase dashboard → Project Settings → Database → Connection String → URI,\n" +
      "then add it to .env.local as SUPABASE_DB_URL=\"postgresql://...\".",
  );
  process.exit(1);
}

const only = process.argv[2];

async function main() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const targets = only ? files.filter((f) => f === only) : files;
  if (targets.length === 0) {
    console.error(
      only
        ? `No migration matches "${only}". Available: ${files.join(", ")}`
        : "No .sql files found in supabase/migrations/",
    );
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    for (const file of targets) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      process.stdout.write(`→ ${file} ... `);
      await client.query(sql);
      console.log("ok");
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
