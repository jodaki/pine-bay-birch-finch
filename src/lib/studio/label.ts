import type { Face, Win } from "@/lib/studio/constants";

export type LabelResult = { front: string; back: string; side: string };

export type LabelOptions = {
  face: Face;
  cropWhite: boolean;
  fit: "cover" | "contain";
  windowOpen: boolean;
  win: Win;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("تصویر باز نشد"));
    img.src = src;
  });
}

function isPaper(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max > 242 && max - min < 18;
}

function cropPaper(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return c;
  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      if (!isPaper(r, g, b)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) return c;
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  out.getContext("2d")?.drawImage(c, minX, minY, w, h, 0, 0, w, h);
  return out;
}

function hex(r: number, g: number, b: number) {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function sample(canvas: HTMLCanvasElement, x0: number, y0: number, x1: number, y1: number) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { r: 90, g: 140, b: 30 };
  const { data, width } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const xStart = Math.max(0, Math.floor(x0));
  const yStart = Math.max(0, Math.floor(y0));
  const xEnd = Math.min(canvas.width, Math.floor(x1));
  const yEnd = Math.min(canvas.height, Math.floor(y1));
  for (let y = yStart; y < yEnd; y += 4) {
    for (let x = xStart; x < xEnd; x += 3) {
      const i = (y * width + x) * 4;
      if ((data[i + 3] ?? 0) < 200) continue;
      r += data[i] ?? 0;
      g += data[i + 1] ?? 0;
      b += data[i + 2] ?? 0;
      n += 1;
    }
  }
  if (!n) return { r: 90, g: 140, b: 30 };
  return { r: r / n, g: g / n, b: b / n };
}

function roundedRectSDF(x: number, y: number, x0: number, y0: number, x1: number, y1: number, rad: number) {
  const hx = (x1 - x0) / 2;
  const hy = (y1 - y0) / 2;
  const dx = Math.abs(x - (x0 + x1) / 2) - (hx - rad);
  const dy = Math.abs(y - (y0 + y1) / 2) - (hy - rad);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(dx, dy), 0) - rad;
}

function punchWindow(canvas: HTMLCanvasElement, win: Win) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  const { width: w, height: h } = canvas;
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  const x0 = win.u0 * w;
  const x1 = win.u1 * w;
  const y0 = (1 - win.v1) * h;
  const y1 = (1 - win.v0) * h;
  const rad = Math.min(w, h) * 0.02;
  const feather = 2.5;
  for (let y = Math.max(0, Math.floor(y0 - feather)); y < Math.min(h, Math.ceil(y1 + feather)); y += 1) {
    for (let x = Math.max(0, Math.floor(x0 - feather)); x < Math.min(w, Math.ceil(x1 + feather)); x += 1) {
      const dist = roundedRectSDF(x + 0.5, y + 0.5, x0, y0, x1, y1, rad);
      if (dist > feather) continue;
      const i = (y * w + x) * 4;
      const keep = dist <= 0 ? 0 : dist / feather;
      data[i + 3] = Math.round((data[i + 3] ?? 255) * keep);
    }
  }
  ctx.putImageData(img, 0, 0);
}

async function drawBack(side: string, face: Face) {
  await document.fonts.ready;
  try {
    await document.fonts.load("700 64px Vazirmatn");
  } catch {
    /* system fonts still cover Persian */
  }
  const w = 720;
  const h = Math.round((w * face.h) / face.w);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c.toDataURL("image/png");
  const n = Number.parseInt(side.slice(1), 16);
  const r = Math.round((((n >> 16) & 255) || 40) * 0.45);
  const g = Math.round((((n >> 8) & 255) || 70) * 0.48);
  const b = Math.round(((n & 255) || 30) * 0.42);
  ctx.fillStyle = hex(r, g, b);
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(244,241,232,0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.fillStyle = "#f4f1e8";
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.font = "700 72px Vazirmatn, 'DejaVu Sans', sans-serif";
  ctx.fillText("اوشان", w / 2, h * 0.28);
  ctx.font = "500 34px Vazirmatn, 'DejaVu Sans', sans-serif";
  ctx.fillText("حبوبات و غلات", w / 2, h * 0.36);
  ctx.font = "600 24px Vazirmatn, 'DejaVu Sans', sans-serif";
  ctx.fillText("PULSES & GRAINS", w / 2, h * 0.42);
  ctx.font = "600 30px Vazirmatn, 'DejaVu Sans', sans-serif";
  ctx.fillText("وزن خالص ۹۰۰ گرم", w / 2, h * 0.58);
  ctx.font = "400 24px Vazirmatn, 'DejaVu Sans', sans-serif";
  ctx.fillStyle = "rgba(244,241,232,0.82)";
  ctx.fillText("در جای خشک و خنک نگهداری شود", w / 2, h * 0.72);
  return c.toDataURL("image/jpeg", 0.86);
}

export async function prepareLabel(src: string, opts: LabelOptions): Promise<LabelResult> {
  const img = await loadImage(src);
  const cropped = opts.cropWhite ? cropPaper(img) : img;
  const bw = cropped instanceof HTMLCanvasElement ? cropped.width : img.naturalWidth;
  const bh = cropped instanceof HTMLCanvasElement ? cropped.height : img.naturalHeight;
  const probe = document.createElement("canvas");
  probe.width = Math.max(1, bw);
  probe.height = Math.max(1, bh);
  probe.getContext("2d")?.drawImage(cropped, 0, 0, probe.width, probe.height);
  const edge = sample(probe, probe.width * 0.02, probe.height * 0.08, probe.width * 0.18, probe.height * 0.42);
  const side = hex(edge.r * 0.92, edge.g * 0.92, edge.b * 0.92);

  const tw = 900;
  const th = Math.max(1, Math.round((tw * opts.face.h) / opts.face.w));
  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { front: src, back: src, side };
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, tw, th);
  const scale = opts.fit === "contain" ? Math.min(tw / bw, th / bh) : Math.max(tw / bw, th / bh);
  const dw = bw * scale;
  const dh = bh * scale;
  ctx.drawImage(cropped, (tw - dw) / 2, (th - dh) / 2, dw, dh);
  if (opts.windowOpen) punchWindow(canvas, opts.win);
  const front = canvas.toDataURL("image/png");
  const back = await drawBack(side, opts.face);
  return { front, back, side };
}
