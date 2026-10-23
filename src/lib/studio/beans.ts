import * as THREE from "three";
import type { Cavity } from "@/lib/studio/constants";

export type Bean = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  wx: number;
  wy: number;
  wz: number;
  r: number;
  sx: number;
  sy: number;
  sz: number;
  color: THREE.Color;
};

const PALETTE = ["#fff8ee", "#f4e2c6", "#ffeeda", "#efd0aa", "#fffaf4", "#e7c49a", "#f7d7b4"].map(
  (h) => new THREE.Color(h),
);

const CELL = 1.65;
const BUCKETS = 128;
const HEADS = new Int32Array(BUCKETS);
const NEXT = new Int32Array(256);
const HX = new Int32Array(256);
const HY = new Int32Array(256);
const HZ = new Int32Array(256);

function hash(ix: number, iy: number, iz: number) {
  return ((ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791)) & (BUCKETS - 1);
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

let beanGeo: THREE.BufferGeometry | null = null;
let beanMat: THREE.MeshPhysicalMaterial | null = null;

export function getBeanGeo() {
  if (beanGeo) return beanGeo;
  const g = new THREE.SphereGeometry(1, 16, 12);
  const pos = g.attributes.position;
  if (!pos) return g;
  for (let i = 0; i < pos.count; i += 1) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const k = x * x;
    x *= 1.08;
    y = y * 0.6 - k * 0.1;
    z = z * 0.8 + k * 0.06 * Math.sign(z || 1);
    pos.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 12, 1), 28);
  beanGeo = g;
  return g;
}

function beanTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  g.fillStyle = "#e7cfa6";
  g.fillRect(0, 0, 256, 256);
  const spots = ["#6d2c24", "#8a3d30", "#4a221c", "#a15a38", "#7a3418", "#5c241c"];
  for (let i = 0; i < 220; i += 1) {
    g.fillStyle = spots[i % spots.length] ?? "#6d2c24";
    g.globalAlpha = 0.35 + Math.random() * 0.55;
    const rw = 1.5 + Math.random() * 11;
    const rh = 1.2 + Math.random() * 8;
    g.beginPath();
    g.ellipse(Math.random() * 256, Math.random() * 256, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 0.9;
  g.fillStyle = "#c4a074";
  g.beginPath();
  g.ellipse(168, 128, 16, 8, 0.4, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#8d6844";
  g.lineWidth = 2;
  g.stroke();
  const img = g.getImageData(0, 0, 256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12;
    img.data[i] = Math.max(0, Math.min(255, (img.data[i] ?? 0) + n));
    img.data[i + 1] = Math.max(0, Math.min(255, (img.data[i + 1] ?? 0) + n));
    img.data[i + 2] = Math.max(0, Math.min(255, (img.data[i + 2] ?? 0) + n * 0.6));
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function getBeanMat() {
  if (beanMat) return beanMat;
  beanMat = new THREE.MeshPhysicalMaterial({
    map: beanTexture(),
    roughness: 0.62,
    metalness: 0,
    sheen: 0.45,
    sheenColor: new THREE.Color("#f0d8b0"),
    sheenRoughness: 0.55,
    clearcoat: 0.08,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.45,
  });
  return beanMat;
}

export function createBeans(count: number, box: Cavity): Bean[] {
  const beans: Bean[] = [];
  const n = Math.min(count, 240);
  for (let i = 0; i < n; i += 1) {
    const split = i % 9 === 0;
    const s = 0.56 + Math.random() * 0.3;
    beans.push({
      x: rand(box.x0 + 0.3, box.x1 - 0.3),
      y: 0.6 + Math.random() * Math.max(1, box.y1 - 0.8),
      z: rand(box.z0 + 0.2, box.z1 - 0.2),
      vx: rand(-2, 2),
      vy: rand(-4, 2),
      vz: rand(-2, 2),
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      wx: rand(-1, 1),
      wy: rand(-1, 1),
      wz: rand(-1, 1),
      r: 0.48 * s,
      sx: 1.22 * s,
      sy: (split ? 0.38 : 0.55) * s,
      sz: 0.84 * s,
      color: PALETTE[i % PALETTE.length] ?? PALETTE[0]!,
    });
  }
  separate(beans, 3);
  return beans;
}

function separate(beans: Bean[], iters = 1) {
  const n = beans.length;
  for (let iter = 0; iter < iters; iter += 1) {
    HEADS.fill(-1);
    for (let i = 0; i < n; i += 1) {
      const b = beans[i];
      if (!b) continue;
      HX[i] = Math.floor(b.x / CELL);
      HY[i] = Math.floor(b.y / CELL);
      HZ[i] = Math.floor(b.z / CELL);
      const h = hash(HX[i] ?? 0, HY[i] ?? 0, HZ[i] ?? 0);
      NEXT[i] = HEADS[h] ?? -1;
      HEADS[h] = i;
    }
    for (let i = 0; i < n; i += 1) {
      const a = beans[i];
      if (!a) continue;
      for (let ox = -1; ox <= 1; ox += 1) {
        for (let oy = -1; oy <= 1; oy += 1) {
          for (let oz = -1; oz <= 1; oz += 1) {
            let j = HEADS[hash((HX[i] ?? 0) + ox, (HY[i] ?? 0) + oy, (HZ[i] ?? 0) + oz)] ?? -1;
            while (j !== -1) {
              if (j > i) pushApart(a, beans[j]);
              j = NEXT[j] ?? -1;
            }
          }
        }
      }
    }
  }
}

function pushApart(a: Bean | undefined, c: Bean | undefined) {
  if (!a || !c) return;
  const dx = c.x - a.x;
  const dy = c.y - a.y;
  const dz = c.z - a.z;
  const min = (a.r + c.r) * 0.96;
  const d2 = dx * dx + dy * dy + dz * dz;
  if (d2 >= min * min || d2 < 1e-8) return;
  const d = Math.sqrt(d2);
  const push = (min - d) * 0.5;
  const nx = dx / d;
  const ny = dy / d;
  const nz = dz / d;
  a.x -= nx * push;
  a.y -= ny * push;
  a.z -= nz * push;
  c.x += nx * push;
  c.y += ny * push;
  c.z += nz * push;
  const rel = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny + (c.vz - a.vz) * nz;
  if (rel < 0) {
    const imp = rel * 0.28;
    a.vx += nx * imp;
    a.vy += ny * imp;
    a.vz += nz * imp;
    c.vx -= nx * imp;
    c.vy -= ny * imp;
    c.vz -= nz * imp;
    a.wz += nx * 1.4;
    c.wz -= nx * 1.4;
  }
}

export function stepBeans(beans: Bean[], dt: number, time: number, ambient: boolean, box: Cavity) {
  const n = beans.length;
  const ax = ambient ? Math.sin(time * 0.85) * 36 : 0;
  const az = ambient ? Math.cos(time * 0.67) * 18 : 0;
  const grav = 260;
  for (let i = 0; i < n; i += 1) {
    const b = beans[i];
    if (!b) continue;
    b.vx += ax * dt;
    b.vy -= grav * dt;
    b.vz += az * dt;
    const damp = Math.max(0, 1 - 1.35 * dt);
    b.vx *= damp;
    b.vy *= damp;
    b.vz *= damp;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.z += b.vz * dt;
    if (b.x < box.x0 + b.r) {
      b.x = box.x0 + b.r;
      b.vx *= -0.2;
    } else if (b.x > box.x1 - b.r) {
      b.x = box.x1 - b.r;
      b.vx *= -0.2;
    }
    if (b.z < box.z0 + b.r) {
      b.z = box.z0 + b.r;
      b.vz *= -0.18;
    } else if (b.z > box.z1 - b.r) {
      b.z = box.z1 - b.r;
      b.vz *= -0.18;
    }
    const floorY = b.r * 0.85 + Math.max(0, box.z1 - b.z) * 0.18;
    if (b.y < floorY) {
      b.y = floorY;
      if (b.vy < 0) b.vy *= -0.16;
      b.vx *= 0.9;
      b.vz *= 0.9;
    }
    if (b.y > box.y1) {
      b.y = box.y1;
      b.vy *= -0.15;
    }
    b.rx += (b.wx + b.vz * 0.15) * dt;
    b.ry += b.wy * dt;
    b.rz += (b.wz + b.vx * 0.12) * dt;
    b.wx *= 0.96;
    b.wy *= 0.96;
    b.wz *= 0.96;
  }
  separate(beans, 2);
}

export function kickBeans(beans: Bean[]) {
  for (const b of beans) {
    b.vx += rand(-34, 34);
    b.vy += 16 + Math.random() * 34;
    b.vz += rand(-20, 20);
    b.wx = rand(-7, 7);
    b.wy = rand(-7, 7);
    b.wz = rand(-7, 7);
  }
}

const dummy = new THREE.Object3D();

export function writeBeans(mesh: THREE.InstancedMesh, beans: Bean[]) {
  for (let i = 0; i < beans.length; i += 1) {
    const b = beans[i];
    if (!b) continue;
    dummy.position.set(b.x, b.y, b.z);
    dummy.rotation.set(b.rx, b.ry, b.rz);
    dummy.scale.set(b.sx, b.sy, b.sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
