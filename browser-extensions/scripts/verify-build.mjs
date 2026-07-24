// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0
//
// CI-side smoke test for build artifacts. Runs after `yarn build` and
// asserts: each target manifest parses, every file it references exists,
// the zip archives exist and are within a reasonable size budget.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const MAX_ZIP_BYTES = 1024 * 1024; // 1 MB

const TARGETS = ["chrome", "firefox"];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function checkTarget(target) {
  const outdir = path.join(DIST, target);
  const manifestPath = path.join(outdir, "manifest.json");
  if (!(await exists(manifestPath))) {
    throw new Error(`${target}: manifest.json missing`);
  }
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  const referenced = new Set();
  if (manifest.action?.default_popup) referenced.add(manifest.action.default_popup);
  if (manifest.options_ui?.page) referenced.add(manifest.options_ui.page);
  if (manifest.background?.service_worker) referenced.add(manifest.background.service_worker);
  if (Array.isArray(manifest.background?.scripts)) {
    for (const s of manifest.background.scripts) referenced.add(s);
  }
  for (const v of Object.values(manifest.icons ?? {})) referenced.add(v);
  for (const v of Object.values(manifest.action?.default_icon ?? {})) referenced.add(v);

  const missing = [];
  for (const rel of referenced) {
    if (!(await exists(path.join(outdir, rel)))) missing.push(rel);
  }
  if (missing.length > 0) {
    throw new Error(`${target}: missing referenced files: ${missing.join(", ")}`);
  }

  // popup.html and options.html are referenced — verify they pull in their js entry points.
  for (const html of ["popup.html", "options.html"]) {
    const p = path.join(outdir, html);
    if (!(await exists(p))) continue;
    const text = await fs.readFile(p, "utf8");
    const expectedJs = html.replace(".html", ".js");
    if (!text.includes(expectedJs)) {
      throw new Error(`${target}: ${html} does not reference ${expectedJs}`);
    }
    if (!(await exists(path.join(outdir, expectedJs)))) {
      throw new Error(`${target}: ${html} references ${expectedJs} but file is missing`);
    }
  }

  const zipPath = path.join(DIST, `${target}.zip`);
  if (!(await exists(zipPath))) {
    throw new Error(`${target}: zip missing at ${zipPath}`);
  }
  const stat = await fs.stat(zipPath);
  if (stat.size > MAX_ZIP_BYTES) {
    throw new Error(
      `${target}.zip is ${(stat.size / 1024).toFixed(1)} KB; expected < ${MAX_ZIP_BYTES / 1024} KB`,
    );
  }

  console.log(
    `✓ ${target}: manifest ok, ${referenced.size} referenced files present, zip ${(stat.size / 1024).toFixed(1)} KB`,
  );
}

async function main() {
  for (const target of TARGETS) {
    await checkTarget(target);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
