#!/usr/bin/env node
/**
 * Run Supabase migrations only when CI env vars are set (e.g. Vercel).
 * Skips silently when not set so local `npm run build` still works.
 */
const { execSync } = require("child_process");

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!token || !projectRef || !dbPassword) {
  console.log("Supabase migrate: skipping (env not set)");
  process.exit(0);
}

const env = { ...process.env, SUPABASE_ACCESS_TOKEN: token, SUPABASE_DB_PASSWORD: dbPassword };
const supabase = "npx supabase";
try {
  execSync(`${supabase} link --project-ref ${projectRef}`, { stdio: "inherit", env });
  execSync(`${supabase} db push --yes`, { stdio: "inherit", env });
  console.log("Supabase migrate: done");
} catch (e) {
  console.error("Supabase migrate failed:", e.message);
  process.exit(1);
}
