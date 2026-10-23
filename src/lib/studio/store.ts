import { create } from "zustand";
import {
  BACKGROUNDS,
  DEFAULT_WIN,
  type ExportSize,
  type FaceMode,
  faceOf,
  MAX_BAGS,
} from "@/lib/studio/constants";

export type Bag = {
  id: string;
  x: number;
  z: number;
  yaw: number;
  source: string | null;
};

export type Skin = { front: string; back: string; side: string };

export type CameraState = {
  azimuth: number;
  polar: number;
  radius: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  applyToken: number;
};

type StudioState = {
  bags: Bag[];
  skins: Record<string, Skin>;
  selectedId: string;
  faceMode: FaceMode;
  fit: "cover" | "contain";
  cropWhite: boolean;
  windowOpen: boolean;
  u0: number;
  u1: number;
  v0: number;
  v1: number;
  shakeToken: number;
  draggingId: string | null;
  camera: CameraState;
  bg: string;
  lightAzimuth: number;
  lightElevation: number;
  lightKey: number;
  lightFill: number;
  lightRim: number;
  autoRotate: boolean;
  exportSize: ExportSize;
  exportTransparent: boolean;
  status: string;
  select: (id: string) => void;
  addBag: () => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
  arrange: () => void;
  moveBag: (id: string, x: number, z: number) => void;
  setYaw: (id: string, yaw: number) => void;
  setSource: (id: string, source: string | null) => void;
  setSkins: (skins: Record<string, Skin>) => void;
  setFaceMode: (mode: FaceMode) => void;
  setFit: (fit: "cover" | "contain") => void;
  setCropWhite: (on: boolean) => void;
  setWindowOpen: (on: boolean) => void;
  setWindow: (patch: Partial<Pick<StudioState, "u0" | "u1" | "v0" | "v1">>) => void;
  shake: () => void;
  beginDrag: (id: string) => void;
  endDrag: () => void;
  patchCamera: (partial: Partial<CameraState>, apply?: boolean) => void;
  syncView: (partial: Partial<CameraState>) => void;
  look: (azimuth: number, polar: number, radiusMul?: number) => void;
  setBg: (bg: string) => void;
  setLight: (patch: Partial<Pick<StudioState, "lightAzimuth" | "lightElevation" | "lightKey" | "lightFill" | "lightRim">>) => void;
  setAutoRotate: (on: boolean) => void;
  setExportSize: (size: ExportSize) => void;
  setExportTransparent: (on: boolean) => void;
  setStatus: (status: string) => void;
};

let seq = 2;

function nid() {
  seq += 1;
  return `b${seq}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function centroid(bags: Bag[]) {
  if (!bags.length) return { x: 0, z: 0 };
  let x = 0;
  let z = 0;
  for (const b of bags) {
    x += b.x;
    z += b.z;
  }
  return { x: x / bags.length, z: z / bags.length };
}

function spanOf(bags: Bag[]) {
  if (bags.length <= 1) return 0;
  let minX = Infinity;
  let maxX = -Infinity;
  for (const b of bags) {
    minX = Math.min(minX, b.x);
    maxX = Math.max(maxX, b.x);
  }
  return maxX - minX;
}

const face0 = faceOf("product");

export const useStudio = create<StudioState>((set, get) => ({
  bags: [{ id: "b1", x: 0, z: 0, yaw: 0, source: null }],
  skins: {},
  selectedId: "b1",
  faceMode: "product",
  fit: "cover",
  cropWhite: false,
  windowOpen: true,
  ...DEFAULT_WIN,
  shakeToken: 0,
  draggingId: null,
  camera: {
    azimuth: 32,
    polar: 66,
    radius: face0.h * 2.55,
    targetX: 0,
    targetY: face0.h * 0.42,
    targetZ: 0,
    applyToken: 1,
  },
  bg: BACKGROUNDS[0].color,
  lightAzimuth: 36,
  lightElevation: 54,
  lightKey: 2.6,
  lightFill: 0.55,
  lightRim: 0.85,
  autoRotate: false,
  exportSize: "portrait",
  exportTransparent: false,
  status: "",

  select: (id) => set({ selectedId: id }),

  addBag: () =>
    set((s) => {
      if (s.bags.length >= MAX_BAGS) return s;
      const face = faceOf(s.faceMode);
      const id = nid();
      const maxX = s.bags.reduce((m, b) => Math.max(m, b.x), 0);
      const x = s.bags.length ? maxX + face.w + 6 : 0;
      return {
        bags: [...s.bags, { id, x, z: 0, yaw: -6, source: null }],
        selectedId: id,
      };
    }),

  duplicate: (id) =>
    set((s) => {
      if (s.bags.length >= MAX_BAGS) return s;
      const bag = s.bags.find((b) => b.id === id);
      if (!bag) return s;
      const next = nid();
      const skins = s.skins[id] ? { ...s.skins, [next]: s.skins[id] } : s.skins;
      return {
        bags: [...s.bags, { ...bag, id: next, x: bag.x + faceOf(s.faceMode).w * 0.45, z: bag.z + 5, yaw: bag.yaw + 8 }],
        skins,
        selectedId: next,
      };
    }),

  remove: (id) =>
    set((s) => {
      const bags = s.bags.filter((b) => b.id !== id);
      const skins = { ...s.skins };
      delete skins[id];
      return {
        bags,
        skins,
        selectedId: s.selectedId === id ? (bags[0]?.id ?? "") : s.selectedId,
        draggingId: s.draggingId === id ? null : s.draggingId,
      };
    }),

  arrange: () =>
    set((s) => {
      const face = faceOf(s.faceMode);
      const n = s.bags.length;
      const mid = (n - 1) / 2;
      const gap = face.w + 6;
      return {
        bags: s.bags.map((b, i) => ({
          ...b,
          x: (i - mid) * gap,
          z: -Math.abs(i - mid) * 6,
          yaw: (i - mid) * -7,
        })),
      };
    }),

  moveBag: (id, x, z) =>
    set((s) => ({
      bags: s.bags.map((b) =>
        b.id === id ? { ...b, x: clamp(x, -150, 150), z: clamp(z, -110, 110) } : b,
      ),
    })),

  setYaw: (id, yaw) =>
    set((s) => ({
      bags: s.bags.map((b) => (b.id === id ? { ...b, yaw } : b)),
    })),

  setSource: (id, source) =>
    set((s) => ({
      bags: s.bags.map((b) => (b.id === id ? { ...b, source } : b)),
    })),

  setSkins: (incoming) =>
    set((s) => {
      const skins = { ...s.skins };
      for (const bag of s.bags) {
        const skin = incoming[bag.id];
        if (skin) skins[bag.id] = skin;
      }
      return { skins };
    }),

  setFaceMode: (faceMode) => set({ faceMode }),
  setFit: (fit) => set({ fit }),
  setCropWhite: (cropWhite) => set({ cropWhite }),
  setWindowOpen: (windowOpen) => set({ windowOpen }),
  setWindow: (patch) => set(patch),
  shake: () => set((s) => ({ shakeToken: s.shakeToken + 1 })),
  beginDrag: (id) => set({ draggingId: id, selectedId: id }),
  endDrag: () => set({ draggingId: null }),

  patchCamera: (partial, apply = true) =>
    set((s) => ({
      camera: {
        ...s.camera,
        ...partial,
        applyToken: apply ? s.camera.applyToken + 1 : s.camera.applyToken,
      },
    })),

  syncView: (partial) =>
    set((s) => ({
      camera: { ...s.camera, ...partial },
    })),

  look: (azimuth, polar, radiusMul = 1) => {
    const s = get();
    const face = faceOf(s.faceMode);
    const c = centroid(s.bags);
    const radius = Math.max(face.h * 2.55, spanOf(s.bags) + face.w * 1.35) * radiusMul;
    s.patchCamera({
      azimuth,
      polar,
      radius,
      targetX: c.x,
      targetY: face.h * 0.42,
      targetZ: c.z,
    });
  },

  setBg: (bg) => set({ bg }),
  setLight: (patch) => set(patch),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setExportSize: (exportSize) => set({ exportSize }),
  setExportTransparent: (exportTransparent) => set({ exportTransparent }),
  setStatus: (status) => {
    set({ status });
    if (!status) return;
    window.setTimeout(() => {
      if (get().status === status) set({ status: "" });
    }, 2800);
  },
}));
