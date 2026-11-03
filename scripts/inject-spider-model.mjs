// Copies the generated spider.glb to public/spider-model.glb. DEFAULT_MODEL
// in silk-spider-cursor.tsx points at that path directly (asset lives as a
// static file, not inlined base64 — keeps the JS bundle small), so after
// running generate-spider.mjs this is the only step needed to ship a new model.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const dir = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(dir, "spider.glb")
const dst = path.join(dir, "..", "public", "spider-model.glb")

fs.copyFileSync(src, dst)
console.log("copied", fs.statSync(dst).size, "bytes to", dst)
