// Fails when the site links to the old demo address. Every demo link goes to the public start page,
// https://app.youroperator.ai/start (decision 29 in the app's repo): nothing may point to simbuilds.co, which now
// redirects there, or to the Halden sample at /d/halden, which stays only as the app's test sample.
//
// Runs before every build (`prebuild`), and by hand with `npm run check:links`.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = ["app", "components", "lib", "hooks", "public", "next.config.ts"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);
const TEXT = /\.(tsx?|jsx?|mjs|cjs|json|md|mdx|html|css|txt|xml|svg)$/;
const BANNED = [/simbuilds\.co/i, /\/d\/halden\b/i];

function* files(path) {
  const stat = statSync(path, { throwIfNoEntry: false });
  if (!stat) return;
  if (stat.isFile()) {
    if (TEXT.test(path)) yield path;
    return;
  }
  for (const name of readdirSync(path)) {
    if (!SKIP_DIRS.has(name)) yield* files(join(path, name));
  }
}

const problems = [];
for (const top of SCAN) {
  for (const file of files(join(ROOT, top))) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (BANNED.some((re) => re.test(line))) problems.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
      });
  }
}

if (problems.length > 0) {
  console.error("Links to the old demo address (use https://app.youroperator.ai/start instead):");
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("No links to simbuilds.co or /d/halden.");
