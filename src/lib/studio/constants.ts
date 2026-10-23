export const DEFAULT_LABEL = "/pack/default-bag.jpg";
export const MAX_BAGS = 6;

export type Face = { w: number; h: number; d: number };
export type Win = { u0: number; u1: number; v0: number; v1: number };
export type FaceMode = "product" | "print";

/** Standing pouch matched to the product photo (width / height ≈ 0.43). */
export const FACE_PRODUCT: Face = { w: 15.5, h: 36, d: 7.4 };
/** Print file the user supplies: 28 cm wide × 34 cm tall. */
export const FACE_PRINT: Face = { w: 28, h: 34, d: 10 };

export const DEFAULT_WIN: Win = { u0: 0.292, u1: 0.978, v0: 0.018, v1: 0.385 };

export function faceOf(mode: FaceMode): Face {
  return mode === "print" ? FACE_PRINT : FACE_PRODUCT;
}

export function beanCount(face: Face): number {
  const area = face.w * 0.7 * face.h * 0.36;
  return Math.max(100, Math.min(200, Math.round(area * 1.2)));
}

export type Cavity = { x0: number; x1: number; y1: number; z0: number; z1: number };

export function cavityOf(face: Face, win: Win): Cavity {
  return {
    x0: -face.w * 0.42,
    x1: face.w * 0.42,
    y1: face.h * Math.min(0.52, win.v1 + 0.05),
    z0: -face.d * 0.28,
    z1: face.d * 0.55,
  };
}

export const BACKGROUNDS = [
  { id: "paper", label: "کاغذ روشن", color: "#f3f0e7" },
  { id: "warm", label: "کرم گرم", color: "#e6d5c3" },
  { id: "gray", label: "خاکستری", color: "#cfcfcb" },
  { id: "char", label: "زغالی", color: "#232826" },
  { id: "forest", label: "جنگلی", color: "#1b3328" },
  { id: "navy", label: "سرمه‌ای", color: "#1a2430" },
] as const;

export const EXPORTS = {
  portrait: { w: 1600, h: 2000, label: "عمودی" },
  square: { w: 1800, h: 1800, label: "مربع" },
  landscape: { w: 1920, h: 1080, label: "افقی" },
} as const;

export type ExportSize = keyof typeof EXPORTS;

export function faNum(n: number, digits = 0): string {
  return n.toFixed(digits).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d);
}
