// Crops the spider icon's whitespace away and scales it up to fill the frame.
import sharp from "sharp"
import path from "node:path"
import { fileURLToPath } from "node:url"

const SRC = process.argv[2]
const SIZE = 512
const PAD = 24 // small margin so the spider's legs don't touch the edge

const dir = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(dir, "..", "app", "icon.png")

const trimmed = await sharp(SRC).trim({ background: "#ffffff", threshold: 10 }).toBuffer()
const inner = SIZE - PAD * 2

await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: "#ffffff" } })
  .composite([{ input: await sharp(trimmed).resize(inner, inner, { fit: "contain", background: "#ffffff" }).toBuffer(), left: PAD, top: PAD }])
  .png()
  .toFile(out)

console.log("wrote", out)
