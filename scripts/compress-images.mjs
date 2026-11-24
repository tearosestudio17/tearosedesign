#!/usr/bin/env node
// One-off compression pass for oversized source photos in public/work.
// Resizes to a max dimension and re-encodes in place, same filename/extension
// (lib/work-content.ts references exact paths, so names must not change).
import sharp from "sharp";
import { statSync, renameSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 78;

const targets = [
  "public/work/The figure out/IMG_0042.JPEG",
  "public/work/Mr beans/DSC09458.jpeg",
  "public/work/Ethiopia/coffee mockup 02.PNG",
  "public/work/Ethiopia/mock 01.PNG",
  "public/work/Ikigai/PRA08205.jpeg",
  "public/work/Industrial brands/DSC06530_Original.JPG",
  "public/work/Ethiopia/Coffee Mockup 022.PNG",
  "public/work/Teens & beyond/MDF09271.jpeg",
  "public/work/lkoi/_AKA9959.jpeg",
  "public/work/Luma/1.png",
  "public/work/Teens & beyond/MDF00003.jpeg",
  "public/work/Menyre/0C0A8577_Original.JPG",
  "public/work/Industrial brands/261C71E6-1D64-4DC5-8EE1-D66AF9605E15.png",
  "public/work/Mr beans/IMG_7617_Original.JPG",
  "public/work/lkoi/17B02478-3A22-4BA3-9B27-EB618894129A.png",
  "public/work/Inizio/2A316C64-D6E7-49A8-A25F-FE4F6672A91D.png",
  "public/work/Kinders den/1.png",
  "public/work/Inizio/5W7A9632_Original.JPG",
  "public/work/The figure out/DSC00754.jpeg",
  "public/work/Inizio/EB5DBD45-7BD8-473F-9CFD-0AC8B8A668F0.png",
  "public/work/Teens & beyond/BDE951CC-02B4-492F-8F78-30A41E678034.png",
  "public/work/Menyre/0C0A0461_Original.JPG",
  "public/flip.png",
];

function fmtBytes(n) {
  return `${(n / 1024 / 1024).toFixed(2)}M`;
}

async function compressOne(relPath) {
  const absPath = path.join(repoRoot, relPath);
  const ext = path.extname(absPath).toLowerCase();
  const before = statSync(absPath).size;
  const tmpPath = `${absPath}.tmp`;

  const img = sharp(absPath).rotate();
  const meta = await img.metadata();
  const resized =
    meta.width && meta.height && Math.max(meta.width, meta.height) > MAX_DIMENSION
      ? img.resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: "inside",
          withoutEnlargement: true,
        })
      : img;

  if (ext === ".jpg" || ext === ".jpeg") {
    await resized.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpPath);
  } else if (ext === ".png") {
    await resized.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmpPath);
  } else {
    console.warn(`skip (unsupported ext): ${relPath}`);
    return;
  }

  const after = statSync(tmpPath).size;
  if (after < before) {
    renameSync(tmpPath, absPath);
    console.log(`${relPath}: ${fmtBytes(before)} -> ${fmtBytes(after)}`);
  } else {
    const { unlinkSync } = await import("node:fs");
    unlinkSync(tmpPath);
    console.log(`${relPath}: kept original (${fmtBytes(before)}, compressed was larger)`);
  }
}

for (const relPath of targets) {
  try {
    await compressOne(relPath);
  } catch (err) {
    console.error(`FAILED ${relPath}:`, err.message);
  }
}
