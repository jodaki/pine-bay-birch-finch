import * as THREE from "three";
import type { Face, Win } from "@/lib/studio/constants";

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0 || 1)));
  return t * t * (3 - 2 * t);
}

export function frontPoint(face: Face, u: number, v: number): [number, number, number] {
  const { w, h, d } = face;
  const seal = smoothstep(0.9, 1, v);
  const width = w * (1 - 0.018 * v);
  let x = (u - 0.5) * width;
  const y = v * h;
  const xN = Math.sin(Math.PI * u);
  const side = 0.15 + 0.85 * Math.pow(Math.max(0.0001, xN), 0.48);
  let z = d * 0.5 * side * (1 - seal * 0.9);
  z += Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, v * 1.02)) * d * 0.15 * (1 - seal);
  const bulge =
    Math.exp(-((u - 0.64) ** 2) / 0.08) * Math.exp(-((v - 0.22) ** 2) / 0.018) * d * 0.16;
  z += bulge * (1 - seal);
  z += Math.sin(u * 24 + v * 5) * 0.05;
  z += Math.sin(u * Math.PI * 15) * 0.09 * seal;
  const bottom = smoothstep(0.07, 0, v);
  const corner = u < 0.5 ? smoothstep(0.14, 0, u) : smoothstep(0.86, 1, u);
  const k = bottom * corner;
  x *= 1 - k * 0.5;
  z *= 1 - k * 0.28;
  return [x, y, z];
}

export function backPoint(face: Face, u: number, v: number): [number, number, number] {
  const [x, y, z] = frontPoint(face, u, v);
  return [x, y, -Math.abs(z) * 0.9];
}

function sidePoint(face: Face, t: number, v: number, edgeU: number, sign: number): [number, number, number] {
  const pf = frontPoint(face, edgeU, v);
  const pb = backPoint(face, edgeU, v);
  const seal = smoothstep(0.88, 1, v);
  const bow = Math.sin(t * Math.PI) * face.d * 0.07 * (1 - seal);
  return [
    pf[0] * (1 - t) + pb[0] * t + sign * bow,
    pf[1] * (1 - t) + pb[1] * t,
    pf[2] * (1 - t) + pb[2] * t,
  ];
}

function grid(
  segA: number,
  segB: number,
  sample: (a: number, b: number) => [number, number, number],
  uv: (a: number, b: number) => [number, number],
  flip: boolean,
) {
  const na = segA + 1;
  const pos = new Float32Array(na * (segB + 1) * 3);
  const uvs = new Float32Array(na * (segB + 1) * 2);
  for (let ib = 0; ib <= segB; ib += 1) {
    for (let ia = 0; ia <= segA; ia += 1) {
      const p = sample(ia / segA, ib / segB);
      const i = ib * na + ia;
      pos[i * 3] = p[0];
      pos[i * 3 + 1] = p[1];
      pos[i * 3 + 2] = p[2];
      const t = uv(ia / segA, ib / segB);
      uvs[i * 2] = t[0];
      uvs[i * 2 + 1] = t[1];
    }
  }
  const idx: number[] = [];
  for (let ib = 0; ib < segB; ib += 1) {
    for (let ia = 0; ia < segA; ia += 1) {
      const a = ib * na + ia;
      const b = a + 1;
      const c = a + na;
      const d = c + 1;
      if (!flip) idx.push(a, b, c, b, d, c);
      else idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export type PouchGeos = {
  front: THREE.BufferGeometry;
  back: THREE.BufferGeometry;
  left: THREE.BufferGeometry;
  right: THREE.BufferGeometry;
  bottom: THREE.BufferGeometry;
  glass: THREE.BufferGeometry;
};

const cache = new Map<string, PouchGeos>();

function disposeGeos(g: PouchGeos) {
  g.front.dispose();
  g.back.dispose();
  g.left.dispose();
  g.right.dispose();
  g.bottom.dispose();
  g.glass.dispose();
}

export function getPouchGeos(face: Face, win: Win): PouchGeos {
  const key = [face.w, face.h, face.d, win.u0, win.u1, win.v0, win.v1].map((n) => n.toFixed(3)).join("|");
  const hit = cache.get(key);
  if (hit) return hit;
  const geos: PouchGeos = {
    front: grid(32, 46, (u, v) => frontPoint(face, u, v), (u, v) => [u, v], false),
    back: grid(24, 36, (u, v) => backPoint(face, u, v), (u, v) => [1 - u, v], true),
    left: grid(5, 28, (t, v) => sidePoint(face, t, v, 0, -1), (t, v) => [t, v], false),
    right: grid(5, 28, (t, v) => sidePoint(face, t, v, 1, 1), (t, v) => [t, v], true),
    bottom: grid(
      24,
      6,
      (u, t) => {
        const pf = frontPoint(face, u, 0);
        const pb = backPoint(face, u, 0);
        return [pf[0] * (1 - t) + pb[0] * t, 0, pf[2] * (1 - t) + pb[2] * t];
      },
      (u, t) => [u, t],
      false,
    ),
    glass: grid(
      18,
      14,
      (a, b) => {
        const u = win.u0 + (win.u1 - win.u0) * a;
        const v = win.v0 + (win.v1 - win.v0) * b;
        const p = frontPoint(face, u, v);
        p[2] += 0.12;
        return p;
      },
      (a, b) => [a, b],
      false,
    ),
  };
  cache.set(key, geos);
  if (cache.size > 8) {
    const oldest = cache.keys().next().value;
    if (oldest && oldest !== key) {
      const old = cache.get(oldest);
      if (old) disposeGeos(old);
      cache.delete(oldest);
    }
  }
  return geos;
}

let plasticNormal: THREE.CanvasTexture | null = null;

export function getPlasticNormal() {
  if (plasticNormal) return plasticNormal;
  const size = 256;
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      height[y * size + x] =
        Math.sin(u * 46 + v * 8) * 0.45 +
        Math.sin(u * 15 + v * 33) * 0.28 +
        Math.sin((u + v) * 30) * 0.18;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    plasticNormal = new THREE.CanvasTexture(canvas);
    return plasticNormal;
  }
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const l = height[y * size + ((x + size - 1) % size)] ?? 0;
      const r = height[y * size + ((x + 1) % size)] ?? 0;
      const d = height[((y + size - 1) % size) * size + x] ?? 0;
      const u = height[((y + 1) % size) * size + x] ?? 0;
      const nx = -(r - l) * 1.6;
      const ny = -(u - d) * 1.6;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      const i = (y * size + x) * 4;
      img.data[i] = (nx / len) * 127 + 128;
      img.data[i + 1] = (ny / len) * 127 + 128;
      img.data[i + 2] = (nz / len) * 127 + 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  plasticNormal = new THREE.CanvasTexture(canvas);
  plasticNormal.wrapS = THREE.RepeatWrapping;
  plasticNormal.wrapT = THREE.RepeatWrapping;
  plasticNormal.repeat.set(2.2, 2.6);
  plasticNormal.colorSpace = THREE.NoColorSpace;
  return plasticNormal;
}

let shadowTex: THREE.CanvasTexture | null = null;

export function getShadowTexture() {
  if (shadowTex) return shadowTex;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 62);
    grd.addColorStop(0, "rgba(0,0,0,0.55)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  }
  shadowTex = new THREE.CanvasTexture(c);
  shadowTex.colorSpace = THREE.SRGBColorSpace;
  return shadowTex;
}

export function createCove() {
  const segX = 48;
  const segZ = 36;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let iz = 0; iz <= segZ; iz += 1) {
    for (let ix = 0; ix <= segX; ix += 1) {
      const u = ix / segX;
      const v = iz / segZ;
      const x = -170 + 340 * u;
      let z = 130 + (-90 - 130) * v;
      let y = 0;
      if (z < -6) {
        const t = Math.min(1, (-6 - z) / 58);
        const s = t * t * (3 - 2 * t);
        y = s * 110;
        z = -6 - Math.sin(s * Math.PI * 0.5) * 42;
      }
      pos.push(x, y, z);
      uv.push(u, v);
    }
  }
  const na = segX + 1;
  for (let iz = 0; iz < segZ; iz += 1) {
    for (let ix = 0; ix < segX; ix += 1) {
      const a = iz * na + ix;
      idx.push(a, a + 1, a + na, a + 1, a + na + 1, a + na);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
