// Procedurally builds a low-poly jumping-spider GLB: carapace, abdomen, 8 legs (2-bone each), eyes.
// Vertex-colored to roughly match the peacock-spider reference photos (teal/orange face, cream+orange
// abdomen fan, tan banded legs). Exported as binary glTF for the SilkSpiderCursor component.
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UP = new THREE.Vector3(0, 1, 0);

function paintUniform(geo, color, rough) {
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    arr[i * 4] = color.r;
    arr[i * 4 + 1] = color.g;
    arr[i * 4 + 2] = color.b;
    arr[i * 4 + 3] = rough;
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(arr, 4));
}

function paintAbdomen(geo, center, edge, rough) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const pos = geo.attributes.position;
  const n = pos.count;
  const arr = new Float32Array(n * 4);
  const halfW = Math.max(1e-4, (bb.max.x - bb.min.x) / 2);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    let t = Math.min(1, Math.abs(x) / halfW);
    const topF = THREE.MathUtils.clamp((y - bb.min.y) / (bb.max.y - bb.min.y), 0, 1);
    t = THREE.MathUtils.lerp(t, 1, 1 - topF * 0.65);
    c.copy(center).lerp(edge, t);
    arr[i * 4] = c.r;
    arr[i * 4 + 1] = c.g;
    arr[i * 4 + 2] = c.b;
    arr[i * 4 + 3] = rough;
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(arr, 4));
}

function paintFace(geo, worldCenter, base, ring, rough) {
  const pos = geo.attributes.position;
  const n = pos.count;
  const arr = new Float32Array(n * 4);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i) + worldCenter.x, y = pos.getY(i) + worldCenter.y;
    const d = Math.hypot(x, y - (worldCenter.y + 0.02));
    const t = THREE.MathUtils.clamp((d - 0.05) / 0.09, 0, 1);
    c.copy(base).lerp(ring, 1 - t);
    arr[i * 4] = c.r;
    arr[i * 4 + 1] = c.g;
    arr[i * 4 + 2] = c.b;
    arr[i * 4 + 3] = rough;
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(arr, 4));
}

// Paints the black-widow hourglass: a soft red patch on the upper-rear of the
// abdomen, blended on top of whatever color (gloss gradient) is already there.
function paintHourglassMark(geo, markColor, markLocal, radius, strength) {
  const pos = geo.attributes.position;
  const colorAttr = geo.attributes.color;
  const n = pos.count;
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const dx = pos.getX(i) - markLocal.x;
    const dy = (pos.getY(i) - markLocal.y) * 1.6; // squash the falloff taller than wide
    const dz = pos.getZ(i) - markLocal.z;
    const dist = Math.hypot(dx, dy, dz);
    const w = THREE.MathUtils.clamp(1 - dist / radius, 0, 1) ** 1.4 * strength;
    if (w <= 0) continue;
    c.setRGB(colorAttr.getX(i), colorAttr.getY(i), colorAttr.getZ(i)).lerp(markColor, w);
    colorAttr.setXYZ(i, c.r, c.g, c.b);
  }
  colorAttr.needsUpdate = true;
}

const legBlack = new THREE.Color(0x100d0c);
const legJoint = new THREE.Color(0x030202);
function legColor(t) {
  const joint =
    Math.exp(-((t - 0.12) ** 2) / (2 * 0.02 ** 2)) +
    Math.exp(-((t - 0.52) ** 2) / (2 * 0.022 ** 2)) +
    Math.exp(-((t - 0.86) ** 2) / (2 * 0.02 ** 2));
  const c = legBlack.clone().lerp(legJoint, Math.min(1, joint * 0.9));
  return c;
}

function makeBone(a, b, r0, r1) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = Math.max(1e-4, dir.length());
  const geo = new THREE.CylinderGeometry(r1, r0, len, 10, 10, false);
  const pos = geo.attributes.position;
  const n = pos.count;
  const arr = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const ylocal = pos.getY(i);
    const t = THREE.MathUtils.clamp((ylocal + len / 2) / len, 0, 1);
    const c = legColor(t);
    arr[i * 4] = c.r;
    arr[i * 4 + 1] = c.g;
    arr[i * 4 + 2] = c.b;
    arr[i * 4 + 3] = 0.82;
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(arr, 4));
  geo.computeVertexNormals();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  geo.applyQuaternion(quat);
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  geo.translate(mid.x, mid.y, mid.z);
  return geo;
}

function mesh(geo, name) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  const m = new THREE.Mesh(geo, mat);
  m.name = name;
  return m;
}

const root = new THREE.Group();
root.name = "spider";

// --- carapace (cephalothorax) ---
const capCenter = new THREE.Vector3(0, 0.12, 0.1);
const carapace = new THREE.SphereGeometry(1, 28, 20);
carapace.scale(0.17, 0.12, 0.18);
carapace.translate(capCenter.x, capCenter.y, capCenter.z);
carapace.computeVertexNormals();
paintFace(
  carapace,
  capCenter,
  new THREE.Color(0x120e0c), // near-black base
  new THREE.Color(0x2e2521), // faint glossy sheen toward the face center
  0.3,
);
root.add(mesh(carapace, "carapace"));

// --- abdomen ---
const abdCenter = new THREE.Vector3(0, 0.115, -0.21);
const abdomen = new THREE.SphereGeometry(1, 28, 20);
abdomen.scale(0.165, 0.13, 0.21);
abdomen.translate(abdCenter.x, abdCenter.y, abdCenter.z);
abdomen.computeVertexNormals();
paintAbdomen(abdomen, new THREE.Color(0x15100e), new THREE.Color(0x090605), 0.28);
// black-widow hourglass: soft red patch on the upper-rear dorsal surface.
// Vertex positions here are already translated to world space (abdomen.translate
// ran above), so the mark's target point is abdCenter plus an offset, not the origin.
paintHourglassMark(
  abdomen,
  new THREE.Color(0xc01b1b),
  new THREE.Vector3(abdCenter.x, abdCenter.y + 0.06, abdCenter.z - 0.08),
  0.15,
  0.95,
);
root.add(mesh(abdomen, "abdomen"));

// --- waist (pedicel) ---
const waist = new THREE.SphereGeometry(0.035, 14, 10);
waist.translate(0, 0.11, -0.02);
waist.computeVertexNormals();
paintUniform(waist, new THREE.Color(0x120e0c), 0.3);
root.add(mesh(waist, "waist"));

// --- eyes ---
const eyeColor = new THREE.Color(0x0a0a0c);
function addEye(x, y, z, r, rough) {
  const g = new THREE.SphereGeometry(r, 14, 10);
  g.translate(x, y, z);
  g.computeVertexNormals();
  paintUniform(g, eyeColor, rough);
  root.add(mesh(g, "eye"));
}
addEye(0.05, 0.185, 0.185, 0.03, 0.08); // AME (big) right
addEye(-0.05, 0.185, 0.185, 0.03, 0.08); // AME (big) left
addEye(0.11, 0.15, 0.17, 0.016, 0.12); // ALE right
addEye(-0.11, 0.15, 0.17, 0.016, 0.12); // ALE left
addEye(0.09, 0.175, 0.08, 0.012, 0.18); // posterior right
addEye(-0.09, 0.175, 0.08, 0.012, 0.18); // posterior left

// --- legs: 4 pairs, index 0 = foremost, 3 = rearmost ---
const legDefs = [
  { hip: [0.1, 0.12, 0.15], out: [0.55, 0.45], femur: 0.16, tibia: 0.19, upBoost: 0.1 },
  { hip: [0.14, 0.12, 0.06], out: [0.85, 0.12], femur: 0.19, tibia: 0.23, upBoost: 0.11 },
  { hip: [0.15, 0.11, -0.05], out: [0.85, -0.12], femur: 0.19, tibia: 0.23, upBoost: 0.11 },
  { hip: [0.13, 0.105, -0.14], out: [0.6, -0.5], femur: 0.15, tibia: 0.18, upBoost: 0.09 },
];
const legTips = [];
for (const s of [1, -1]) {
  for (let i = 0; i < legDefs.length; i++) {
    const d = legDefs[i];
    const hip = new THREE.Vector3(d.hip[0] * s, d.hip[1], d.hip[2]);
    const outDir = new THREE.Vector3(d.out[0] * s, 0, d.out[1]).normalize();
    const knee = hip.clone().addScaledVector(outDir, d.femur * 0.85).addScaledVector(UP, d.upBoost);
    const foot = knee.clone().addScaledVector(outDir, d.tibia);
    foot.y = 0.012;
    root.add(mesh(makeBone(hip, knee, 0.022, 0.013, legColor), "femur" + i + (s > 0 ? "R" : "L")));
    root.add(mesh(makeBone(knee, foot, 0.012, 0.005, legColor), "tibia" + i + (s > 0 ? "R" : "L")));
    legTips.push(foot.clone());
  }
}

// --- export ---
// GLTFExporter's binary path uses the browser FileReader API to turn Blobs
// into data URIs / ArrayBuffers; polyfill the bits it actually calls.
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        console.log("FileReader readAsArrayBuffer done", buf.byteLength);
        this.onloadend && this.onloadend();
      }).catch((e) => {
        console.error("FileReader readAsArrayBuffer error", e);
        this.onerror && this.onerror(e);
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        const b64 = Buffer.from(buf).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${b64}`;
        this.onloadend && this.onloadend();
      }).catch((e) => this.onerror && this.onerror(e));
    }
  };
}

process.on("unhandledRejection", (e) => {
  console.error("UNHANDLED REJECTION", e);
  process.exit(3);
});

const exporter = new GLTFExporter();
const outGlb = path.join(path.dirname(fileURLToPath(import.meta.url)), "spider.glb");
exporter.parse(
  root,
  (result) => {
    const buf = Buffer.from(result);
    fs.writeFileSync(outGlb, buf);
    console.log("wrote", outGlb, buf.length, "bytes");
    console.log("TIPS_JSON", JSON.stringify(legTips.map((t) => [t.x, t.y, t.z])));
    process.exit(0);
  },
  (err) => {
    console.error("export failed", err);
    process.exit(1);
  },
  { binary: true },
);
