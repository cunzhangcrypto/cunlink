// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0
//
// Regenerates assets/icon-{16,32,48,128}.png from assets/icon.svg.
//
// Uses sharp if installed (`yarn add -D sharp`); otherwise falls back to
// the system `magick` binary (ImageMagick). Manual one-shot tool — the
// build pipeline does not call this; the PNGs are checked in.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SVG = path.join(ROOT, "assets", "icon.svg");
const SIZES = [16, 32, 48, 128];

function which(bin) {
  return new Promise((resolve) => {
    const proc = spawn("which", [bin]);
    let stdout = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.on("close", (code) => resolve(code === 0 ? stdout.trim() : null));
    proc.on("error", () => resolve(null));
  });
}

async function renderWithMagick(size) {
  const out = path.join(ROOT, "assets", `icon-${size}.png`);
  await new Promise((resolve, reject) => {
    const proc = spawn("magick", [
      "-density",
      "384",
      "-background",
      "none",
      SVG,
      "-resize",
      `${size}x${size}`,
      out,
    ]);
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`magick exited ${code}`))));
    proc.on("error", reject);
  });
}

async function renderWithSharp(size) {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    return false;
  }
  const buf = await fs.readFile(SVG);
  const out = path.join(ROOT, "assets", `icon-${size}.png`);
  await sharp(buf, { density: 384 }).resize(size, size).png().toFile(out);
  return true;
}

async function main() {
  const usedSharp = (await renderWithSharp(SIZES[0])) !== false;
  if (usedSharp) {
    for (const size of SIZES.slice(1)) await renderWithSharp(size);
    console.log(`✓ regenerated ${SIZES.length} PNG sizes via sharp`);
    return;
  }
  if (!(await which("magick"))) {
    throw new Error(
      "Neither `sharp` (npm) nor `magick` (ImageMagick) is available. Install one and re-run.",
    );
  }
  for (const size of SIZES) await renderWithMagick(size);
  console.log(`✓ regenerated ${SIZES.length} PNG sizes via ImageMagick`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
