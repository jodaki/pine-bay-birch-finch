import { i as __toESM } from "../_runtime.mjs";
import { a as useFrame, i as Canvas, l as require_jsx_runtime, n as Environment, o as useThree, r as OrbitControls, t as Lightformer, u as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { n as Leaf } from "./routes-5fXCBAvv.mjs";
import { a as RotateCcw, c as ImagePlus, d as Camera, f as Boxes, i as SunMedium, l as Download, o as Plus, r as Trash2, s as LayoutGrid, t as Vibrate, u as Copy } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { F as SRGBColorSpace, G as Vector3, H as TextureLoader, M as Raycaster, O as Plane, P as RepeatWrapping, R as Sphere, T as Object3D, W as Vector2, c as CanvasTexture, h as Float32BufferAttribute, o as BufferAttribute, s as BufferGeometry, u as Color, w as MeshPhysicalMaterial, z as SphereGeometry } from "../_libs/monogrid__gainmap-js+three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudioApp-CBWX9o6Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Standing pouch matched to the product photo (width / height ≈ 0.43). */
var FACE_PRODUCT = {
	w: 15.5,
	h: 36,
	d: 7.4
};
/** Print file the user supplies: 28 cm wide × 34 cm tall. */
var FACE_PRINT = {
	w: 28,
	h: 34,
	d: 10
};
var DEFAULT_WIN = {
	u0: .292,
	u1: .978,
	v0: .018,
	v1: .385
};
function faceOf(mode) {
	return mode === "print" ? FACE_PRINT : FACE_PRODUCT;
}
function beanCount(face) {
	const area = face.w * .7 * face.h * .36;
	return Math.max(100, Math.min(200, Math.round(area * 1.2)));
}
var BACKGROUNDS = [
	{
		id: "paper",
		label: "کاغذ روشن",
		color: "#f3f0e7"
	},
	{
		id: "warm",
		label: "کرم گرم",
		color: "#e6d5c3"
	},
	{
		id: "gray",
		label: "خاکستری",
		color: "#cfcfcb"
	},
	{
		id: "char",
		label: "زغالی",
		color: "#232826"
	},
	{
		id: "forest",
		label: "جنگلی",
		color: "#1b3328"
	},
	{
		id: "navy",
		label: "سرمه‌ای",
		color: "#1a2430"
	}
];
var EXPORTS = {
	portrait: {
		w: 1600,
		h: 2e3,
		label: "عمودی"
	},
	square: {
		w: 1800,
		h: 1800,
		label: "مربع"
	},
	landscape: {
		w: 1920,
		h: 1080,
		label: "افقی"
	}
};
function faNum(n, digits = 0) {
	return n.toFixed(digits).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d);
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("تصویر باز نشد"));
		img.src = src;
	});
}
function isPaper(r, g, b) {
	const max = Math.max(r, g, b);
	return max > 242 && max - Math.min(r, g, b) < 18;
}
function cropPaper(img) {
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
	for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
		const i = (y * width + x) * 4;
		if (!isPaper(data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0)) {
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
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
function hex(r, g, b) {
	const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`;
}
function sample(canvas, x0, y0, x1, y1) {
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return {
		r: 90,
		g: 140,
		b: 30
	};
	const { data, width } = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let r = 0;
	let g = 0;
	let b = 0;
	let n = 0;
	const xStart = Math.max(0, Math.floor(x0));
	const yStart = Math.max(0, Math.floor(y0));
	const xEnd = Math.min(canvas.width, Math.floor(x1));
	const yEnd = Math.min(canvas.height, Math.floor(y1));
	for (let y = yStart; y < yEnd; y += 4) for (let x = xStart; x < xEnd; x += 3) {
		const i = (y * width + x) * 4;
		if ((data[i + 3] ?? 0) < 200) continue;
		r += data[i] ?? 0;
		g += data[i + 1] ?? 0;
		b += data[i + 2] ?? 0;
		n += 1;
	}
	if (!n) return {
		r: 90,
		g: 140,
		b: 30
	};
	return {
		r: r / n,
		g: g / n,
		b: b / n
	};
}
function roundedRectSDF(x, y, x0, y0, x1, y1, rad) {
	const hx = (x1 - x0) / 2;
	const hy = (y1 - y0) / 2;
	const dx = Math.abs(x - (x0 + x1) / 2) - (hx - rad);
	const dy = Math.abs(y - (y0 + y1) / 2) - (hy - rad);
	return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - rad;
}
function punchWindow(canvas, win) {
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return;
	const { width: w, height: h } = canvas;
	const img = ctx.getImageData(0, 0, w, h);
	const data = img.data;
	const x0 = win.u0 * w;
	const x1 = win.u1 * w;
	const y0 = (1 - win.v1) * h;
	const y1 = (1 - win.v0) * h;
	const rad = Math.min(w, h) * .02;
	const feather = 2.5;
	for (let y = Math.max(0, Math.floor(y0 - feather)); y < Math.min(h, Math.ceil(y1 + feather)); y += 1) for (let x = Math.max(0, Math.floor(x0 - feather)); x < Math.min(w, Math.ceil(x1 + feather)); x += 1) {
		const dist = roundedRectSDF(x + .5, y + .5, x0, y0, x1, y1, rad);
		if (dist > feather) continue;
		const i = (y * w + x) * 4;
		const keep = dist <= 0 ? 0 : dist / feather;
		data[i + 3] = Math.round((data[i + 3] ?? 255) * keep);
	}
	ctx.putImageData(img, 0, 0);
}
async function drawBack(side, face) {
	await document.fonts.ready;
	try {
		await document.fonts.load("700 64px Vazirmatn");
	} catch {}
	const w = 720;
	const h = Math.round(w * face.h / face.w);
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const ctx = c.getContext("2d");
	if (!ctx) return c.toDataURL("image/png");
	const n = Number.parseInt(side.slice(1), 16);
	ctx.fillStyle = hex(Math.round((n >> 16 & 255 || 40) * .45), Math.round((n >> 8 & 255 || 70) * .48), Math.round((n & 255 || 30) * .42));
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "rgba(244,241,232,0.35)";
	ctx.lineWidth = 3;
	ctx.strokeRect(36, 36, 648, h - 72);
	ctx.fillStyle = "#f4f1e8";
	ctx.textAlign = "center";
	ctx.direction = "rtl";
	ctx.font = "700 72px Vazirmatn, 'DejaVu Sans', sans-serif";
	ctx.fillText("اوشان", w / 2, h * .28);
	ctx.font = "500 34px Vazirmatn, 'DejaVu Sans', sans-serif";
	ctx.fillText("حبوبات و غلات", w / 2, h * .36);
	ctx.font = "600 24px Vazirmatn, 'DejaVu Sans', sans-serif";
	ctx.fillText("PULSES & GRAINS", w / 2, h * .42);
	ctx.font = "600 30px Vazirmatn, 'DejaVu Sans', sans-serif";
	ctx.fillText("وزن خالص ۹۰۰ گرم", w / 2, h * .58);
	ctx.font = "400 24px Vazirmatn, 'DejaVu Sans', sans-serif";
	ctx.fillStyle = "rgba(244,241,232,0.82)";
	ctx.fillText("در جای خشک و خنک نگهداری شود", w / 2, h * .72);
	return c.toDataURL("image/jpeg", .86);
}
async function prepareLabel(src, opts) {
	const img = await loadImage(src);
	const cropped = opts.cropWhite ? cropPaper(img) : img;
	const bw = cropped instanceof HTMLCanvasElement ? cropped.width : img.naturalWidth;
	const bh = cropped instanceof HTMLCanvasElement ? cropped.height : img.naturalHeight;
	const probe = document.createElement("canvas");
	probe.width = Math.max(1, bw);
	probe.height = Math.max(1, bh);
	probe.getContext("2d")?.drawImage(cropped, 0, 0, probe.width, probe.height);
	const edge = sample(probe, probe.width * .02, probe.height * .08, probe.width * .18, probe.height * .42);
	const side = hex(edge.r * .92, edge.g * .92, edge.b * .92);
	const tw = 900;
	const th = Math.max(1, Math.round(tw * opts.face.h / opts.face.w));
	const canvas = document.createElement("canvas");
	canvas.width = tw;
	canvas.height = th;
	const ctx = canvas.getContext("2d");
	if (!ctx) return {
		front: src,
		back: src,
		side
	};
	ctx.fillStyle = side;
	ctx.fillRect(0, 0, tw, th);
	const scale = opts.fit === "contain" ? Math.min(tw / bw, th / bh) : Math.max(tw / bw, th / bh);
	const dw = bw * scale;
	const dh = bh * scale;
	ctx.drawImage(cropped, (tw - dw) / 2, (th - dh) / 2, dw, dh);
	if (opts.windowOpen) punchWindow(canvas, opts.win);
	return {
		front: canvas.toDataURL("image/png"),
		back: await drawBack(side, opts.face),
		side
	};
}
var seq = 2;
function nid() {
	seq += 1;
	return `b${seq}`;
}
function clamp(n, a, b) {
	return Math.min(b, Math.max(a, n));
}
function centroid(bags) {
	if (!bags.length) return {
		x: 0,
		z: 0
	};
	let x = 0;
	let z = 0;
	for (const b of bags) {
		x += b.x;
		z += b.z;
	}
	return {
		x: x / bags.length,
		z: z / bags.length
	};
}
function spanOf(bags) {
	if (bags.length <= 1) return 0;
	let minX = Infinity;
	let maxX = -Infinity;
	for (const b of bags) {
		minX = Math.min(minX, b.x);
		maxX = Math.max(maxX, b.x);
	}
	return maxX - minX;
}
var face0 = faceOf("product");
var useStudio = create((set, get) => ({
	bags: [{
		id: "b1",
		x: 0,
		z: 0,
		yaw: 0,
		source: null
	}],
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
		targetY: face0.h * .42,
		targetZ: 0,
		applyToken: 1
	},
	bg: BACKGROUNDS[0].color,
	lightAzimuth: 36,
	lightElevation: 54,
	lightKey: 2.6,
	lightFill: .55,
	lightRim: .85,
	autoRotate: false,
	exportSize: "portrait",
	exportTransparent: false,
	status: "",
	select: (id) => set({ selectedId: id }),
	addBag: () => set((s) => {
		if (s.bags.length >= 6) return s;
		const face = faceOf(s.faceMode);
		const id = nid();
		const maxX = s.bags.reduce((m, b) => Math.max(m, b.x), 0);
		const x = s.bags.length ? maxX + face.w + 6 : 0;
		return {
			bags: [...s.bags, {
				id,
				x,
				z: 0,
				yaw: -6,
				source: null
			}],
			selectedId: id
		};
	}),
	duplicate: (id) => set((s) => {
		if (s.bags.length >= 6) return s;
		const bag = s.bags.find((b) => b.id === id);
		if (!bag) return s;
		const next = nid();
		const skins = s.skins[id] ? {
			...s.skins,
			[next]: s.skins[id]
		} : s.skins;
		return {
			bags: [...s.bags, {
				...bag,
				id: next,
				x: bag.x + faceOf(s.faceMode).w * .45,
				z: bag.z + 5,
				yaw: bag.yaw + 8
			}],
			skins,
			selectedId: next
		};
	}),
	remove: (id) => set((s) => {
		const bags = s.bags.filter((b) => b.id !== id);
		const skins = { ...s.skins };
		delete skins[id];
		return {
			bags,
			skins,
			selectedId: s.selectedId === id ? bags[0]?.id ?? "" : s.selectedId,
			draggingId: s.draggingId === id ? null : s.draggingId
		};
	}),
	arrange: () => set((s) => {
		const face = faceOf(s.faceMode);
		const mid = (s.bags.length - 1) / 2;
		const gap = face.w + 6;
		return { bags: s.bags.map((b, i) => ({
			...b,
			x: (i - mid) * gap,
			z: -Math.abs(i - mid) * 6,
			yaw: (i - mid) * -7
		})) };
	}),
	moveBag: (id, x, z) => set((s) => ({ bags: s.bags.map((b) => b.id === id ? {
		...b,
		x: clamp(x, -150, 150),
		z: clamp(z, -110, 110)
	} : b) })),
	setYaw: (id, yaw) => set((s) => ({ bags: s.bags.map((b) => b.id === id ? {
		...b,
		yaw
	} : b) })),
	setSource: (id, source) => set((s) => ({ bags: s.bags.map((b) => b.id === id ? {
		...b,
		source
	} : b) })),
	setSkins: (incoming) => set((s) => {
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
	beginDrag: (id) => set({
		draggingId: id,
		selectedId: id
	}),
	endDrag: () => set({ draggingId: null }),
	patchCamera: (partial, apply = true) => set((s) => ({ camera: {
		...s.camera,
		...partial,
		applyToken: apply ? s.camera.applyToken + 1 : s.camera.applyToken
	} })),
	syncView: (partial) => set((s) => ({ camera: {
		...s.camera,
		...partial
	} })),
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
			targetY: face.h * .42,
			targetZ: c.z
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
	}
}));
var shoot = null;
function registerCapture(fn) {
	shoot = fn;
	return () => {
		if (shoot === fn) shoot = null;
	};
}
function takePhoto(shot) {
	if (!shoot) return false;
	shoot(shot);
	return true;
}
function Slider({ label, min, max, step, value, onChange, format }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "field",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "field-label",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "field-value",
				children: format(value)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
async function readFile(file) {
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
function Panel() {
	const [tab, setTab] = (0, import_react.useState)("art");
	const [over, setOver] = (0, import_react.useState)(false);
	const bags = useStudio((s) => s.bags);
	const skins = useStudio((s) => s.skins);
	const selectedId = useStudio((s) => s.selectedId);
	const faceMode = useStudio((s) => s.faceMode);
	const fit = useStudio((s) => s.fit);
	const cropWhite = useStudio((s) => s.cropWhite);
	const windowOpen = useStudio((s) => s.windowOpen);
	const u0 = useStudio((s) => s.u0);
	const u1 = useStudio((s) => s.u1);
	const v0 = useStudio((s) => s.v0);
	const v1 = useStudio((s) => s.v1);
	const camera = useStudio((s) => s.camera);
	const bg = useStudio((s) => s.bg);
	const status = useStudio((s) => s.status);
	const autoRotate = useStudio((s) => s.autoRotate);
	const exportSize = useStudio((s) => s.exportSize);
	const exportTransparent = useStudio((s) => s.exportTransparent);
	const lightAzimuth = useStudio((s) => s.lightAzimuth);
	const lightElevation = useStudio((s) => s.lightElevation);
	const lightKey = useStudio((s) => s.lightKey);
	const lightFill = useStudio((s) => s.lightFill);
	const lightRim = useStudio((s) => s.lightRim);
	const selected = bags.find((b) => b.id === selectedId) ?? bags[0];
	const face = faceOf(faceMode);
	async function applyFile(file) {
		if (!file || !selected) return;
		if (!file.type.startsWith("image/")) {
			useStudio.getState().setStatus("فقط تصویر PNG یا JPG");
			return;
		}
		const data = await readFile(file);
		useStudio.getState().setSource(selected.id, data);
		useStudio.getState().setStatus("طرح روی بسته نشست");
	}
	function shoot() {
		const size = EXPORTS[exportSize];
		const ok = takePhoto({
			w: size.w,
			h: size.h,
			transparent: exportTransparent
		});
		useStudio.getState().setStatus(ok ? "پی‌ان‌جی ذخیره شد" : "صحنه هنوز آماده نیست");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "studio-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tabs",
			role: "tablist",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "tab",
					role: "tab",
					"aria-selected": tab === "bags",
					onClick: () => setTab("bags"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "icon" }), "بسته‌ها"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "tab",
					role: "tab",
					"aria-selected": tab === "art",
					onClick: () => setTab("art"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "icon" }), "طرح"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "tab",
					role: "tab",
					"aria-selected": tab === "camera",
					onClick: () => setTab("camera"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "icon" }), "دوربین"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "tab",
					role: "tab",
					"aria-selected": tab === "studio",
					onClick: () => setTab("studio"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, { className: "icon" }), "استودیو"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-body",
			role: "tabpanel",
			children: [
				tab === "bags" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "btn-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary",
							onClick: () => useStudio.getState().addBag(),
							disabled: bags.length >= 6,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "icon" }), "بسته تازه"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn",
							onClick: () => useStudio.getState().arrange(),
							disabled: bags.length < 2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "icon" }), "چیدمان"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "note",
						children: [
							"تا ",
							faNum(6),
							" بسته. بستهٔ انتخاب‌شده را روی کف استودیو بکشید."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bag-list",
						children: [bags.map((bag, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: bag.id === selectedId ? "bag-row is-on" : "bag-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bag-pick",
									onClick: () => useStudio.getState().select(bag.id),
									"aria-pressed": bag.id === selectedId,
									children: [skins[bag.id]?.front ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										className: "bag-thumb",
										alt: "",
										src: skins[bag.id]?.front
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bag-thumb" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "bag-meta",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["بسته ", faNum(i + 1)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bag.source ? "طرح سفارشی" : "طرح اوشان" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-btn",
									"aria-label": "کپی بسته",
									onClick: () => useStudio.getState().duplicate(bag.id),
									disabled: bags.length >= 6,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "icon" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-btn danger",
									"aria-label": "حذف بسته",
									onClick: () => useStudio.getState().remove(bag.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "icon" })
								})
							]
						}, bag.id)), bags.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "note",
							children: "استودیو خالی است. یک بسته بگذارید."
						}) : null]
					}),
					selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "چرخش بسته",
						min: -180,
						max: 180,
						step: 1,
						value: selected.yaw,
						onChange: (yaw) => useStudio.getState().setYaw(selected.id, yaw),
						format: (n) => `${faNum(Math.round(n))}°`
					}) : null
				] }) : null,
				tab === "art" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: over ? "drop over" : "drop",
						onDragOver: (e) => {
							e.preventDefault();
							setOver(true);
						},
						onDragLeave: () => setOver(false),
						onDrop: (e) => {
							e.preventDefault();
							setOver(false);
							applyFile(e.dataTransfer.files[0]);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "icon" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "بارگذاری طرح چاپ" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "فایل ۳۴×۲۸ سانتی‌متر، PNG یا JPG. روی بستهٔ انتخاب‌شده می‌نشیند و جای طرح سبز را می‌گیرد." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "sr-only",
								type: "file",
								accept: "image/png,image/jpeg,image/webp",
								onChange: (e) => {
									applyFile(e.target.files?.[0]);
									e.target.value = "";
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chips",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "chip",
							"aria-pressed": faceMode === "product",
							onClick: () => useStudio.getState().setFaceMode("product"),
							children: [
								"نسبت اوشان ",
								faNum(FACE_PRODUCT.w, 1),
								"×",
								faNum(FACE_PRODUCT.h, 0)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "chip",
							"aria-pressed": faceMode === "print",
							onClick: () => useStudio.getState().setFaceMode("print"),
							children: [
								"طرح ",
								faNum(FACE_PRINT.h, 0),
								"×",
								faNum(FACE_PRINT.w, 0)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "note",
						children: [
							"سطح روبرو الان ",
							faNum(face.w, 1),
							" پهنا در ",
							faNum(face.h, 0),
							" بلندا، سانتی‌متر. حالت «طرح ۳۴×۲۸» بسته را دقیقاً هم‌اندازهٔ فایل چاپ می‌کند (۲۸ پهنا × ۳۴ بلندا)."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chips",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							"aria-pressed": fit === "cover",
							onClick: () => useStudio.getState().setFit("cover"),
							children: "پوشش کامل"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							"aria-pressed": fit === "contain",
							onClick: () => useStudio.getState().setFit("contain"),
							children: "نمایش کامل"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "check",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: cropWhite,
							onChange: (e) => useStudio.getState().setCropWhite(e.target.checked)
						}), "حذف زمینهٔ سفید دور عکس"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "check",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: windowOpen,
							onChange: (e) => useStudio.getState().setWindowOpen(e.target.checked)
						}), "پنجرهٔ شفاف و لوبیای متحرک داخل بسته"]
					}),
					windowOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "لبهٔ چپ پنجره",
							min: .16,
							max: .55,
							step: .005,
							value: u0,
							onChange: (n) => useStudio.getState().setWindow({ u0: Math.min(n, u1 - .12) }),
							format: (n) => faNum(n * 100, 0) + "٪"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "لبهٔ راست پنجره",
							min: .6,
							max: 1,
							step: .005,
							value: u1,
							onChange: (n) => useStudio.getState().setWindow({ u1: Math.max(n, u0 + .12) }),
							format: (n) => faNum(n * 100, 0) + "٪"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "پایین پنجره",
							min: 0,
							max: .2,
							step: .005,
							value: v0,
							onChange: (n) => useStudio.getState().setWindow({ v0: Math.min(n, v1 - .12) }),
							format: (n) => faNum(n * 100, 0) + "٪"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "بالای پنجره",
							min: .24,
							max: .7,
							step: .005,
							value: v1,
							onChange: (n) => useStudio.getState().setWindow({ v1: Math.max(n, v0 + .12) }),
							format: (n) => faNum(n * 100, 0) + "٪"
						})
					] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn",
						disabled: !selected?.source,
						onClick: () => {
							if (selected) useStudio.getState().setSource(selected.id, null);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "icon" }), "بازگشت به طرح اوشان"]
					})
				] }) : null,
				tab === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chips",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "chip",
								onClick: () => useStudio.getState().look(0, 80, 1),
								children: "روبرو"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "chip",
								onClick: () => useStudio.getState().look(32, 66, 1.04),
								children: "سه‌رخ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "chip",
								onClick: () => useStudio.getState().look(86, 76, 1.08),
								children: "پهلو"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "chip",
								onClick: () => useStudio.getState().look(18, 24, 1.12),
								children: "بالا"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "چرخش افقی",
						min: -180,
						max: 180,
						step: 1,
						value: camera.azimuth,
						onChange: (azimuth) => useStudio.getState().patchCamera({ azimuth }),
						format: (n) => `${faNum(Math.round(n))}°`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "زاویهٔ عمودی",
						min: 18,
						max: 84,
						step: 1,
						value: camera.polar,
						onChange: (polar) => useStudio.getState().patchCamera({ polar }),
						format: (n) => `${faNum(Math.round(n))}°`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "فاصله",
						min: 48,
						max: 200,
						step: 1,
						value: camera.radius,
						onChange: (radius) => useStudio.getState().patchCamera({ radius }),
						format: (n) => faNum(Math.round(n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "ارتفاع نگاه",
						min: 4,
						max: 32,
						step: .5,
						value: camera.targetY,
						onChange: (targetY) => useStudio.getState().patchCamera({ targetY }),
						format: (n) => faNum(n, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "check",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: autoRotate,
							onChange: (e) => useStudio.getState().setAutoRotate(e.target.checked)
						}), "چرخش آرام صفحه"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						onClick: () => useStudio.getState().look(camera.azimuth, camera.polar, 1),
						children: "قاب‌گرفتن همهٔ بسته‌ها"
					})
				] }) : null,
				tab === "studio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "swatches",
						children: BACKGROUNDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "swatch",
							style: { background: item.color },
							"aria-label": item.label,
							"aria-pressed": bg === item.color,
							onClick: () => useStudio.getState().setBg(item.color)
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "color-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "color",
							value: bg,
							onChange: (e) => useStudio.getState().setBg(e.target.value),
							"aria-label": "رنگ دلخواه پس‌زمینه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "پس‌زمینهٔ یکپارچهٔ استودیو" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "جهت نور",
						min: -180,
						max: 180,
						step: 1,
						value: lightAzimuth,
						onChange: (lightAzimuth) => useStudio.getState().setLight({ lightAzimuth }),
						format: (n) => `${faNum(Math.round(n))}°`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "ارتفاع نور",
						min: 18,
						max: 80,
						step: 1,
						value: lightElevation,
						onChange: (lightElevation) => useStudio.getState().setLight({ lightElevation }),
						format: (n) => `${faNum(Math.round(n))}°`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "شدت نور اصلی",
						min: .4,
						max: 5,
						step: .05,
						value: lightKey,
						onChange: (lightKey) => useStudio.getState().setLight({ lightKey }),
						format: (n) => faNum(n, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "نور پرکننده",
						min: 0,
						max: 2,
						step: .05,
						value: lightFill,
						onChange: (lightFill) => useStudio.getState().setLight({ lightFill }),
						format: (n) => faNum(n, 2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "نور لبه‌ای",
						min: 0,
						max: 2.4,
						step: .05,
						value: lightRim,
						onChange: (lightRim) => useStudio.getState().setLight({ lightRim }),
						format: (n) => faNum(n, 2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chips",
						children: Object.keys(EXPORTS).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "chip",
							"aria-pressed": exportSize === id,
							onClick: () => useStudio.getState().setExportSize(id),
							children: [
								EXPORTS[id].label,
								" ",
								faNum(EXPORTS[id].w),
								"×",
								faNum(EXPORTS[id].h)
							]
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "check",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: exportTransparent,
							onChange: (e) => useStudio.getState().setExportTransparent(e.target.checked)
						}), "PNG با پس‌زمینهٔ شفاف"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary",
						onClick: shoot,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "icon" }), "دریافت PNG"]
					})
				] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "status",
					children: status
				})
			]
		})]
	});
}
function shootFromBar() {
	const { exportSize, exportTransparent, setStatus } = useStudio.getState();
	const size = EXPORTS[exportSize];
	setStatus(takePhoto({
		w: size.w,
		h: size.h,
		transparent: exportTransparent
	}) ? "پی‌ان‌جی ذخیره شد" : "صحنه هنوز آماده نیست");
}
function ShakeButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "btn",
		onClick: () => useStudio.getState().shake(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vibrate, { className: "icon" }), "تکان"]
	});
}
function smoothstep(e0, e1, x) {
	const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0 || 1)));
	return t * t * (3 - 2 * t);
}
function frontPoint(face, u, v) {
	const { w, h, d } = face;
	const seal = smoothstep(.9, 1, v);
	const width = w * (1 - .018 * v);
	let x = (u - .5) * width;
	const y = v * h;
	const xN = Math.sin(Math.PI * u);
	const side = .15 + .85 * Math.pow(Math.max(1e-4, xN), .48);
	let z = d * .5 * side * (1 - seal * .9);
	z += Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, v * 1.02)) * d * .15 * (1 - seal);
	const bulge = Math.exp(-((u - .64) ** 2) / .08) * Math.exp(-((v - .22) ** 2) / .018) * d * .16;
	z += bulge * (1 - seal);
	z += Math.sin(u * 24 + v * 5) * .05;
	z += Math.sin(u * Math.PI * 15) * .09 * seal;
	const k = smoothstep(.07, 0, v) * (u < .5 ? smoothstep(.14, 0, u) : smoothstep(.86, 1, u));
	x *= 1 - k * .5;
	z *= 1 - k * .28;
	return [
		x,
		y,
		z
	];
}
function backPoint(face, u, v) {
	const [x, y, z] = frontPoint(face, u, v);
	return [
		x,
		y,
		-Math.abs(z) * .9
	];
}
function sidePoint(face, t, v, edgeU, sign) {
	const pf = frontPoint(face, edgeU, v);
	const pb = backPoint(face, edgeU, v);
	const seal = smoothstep(.88, 1, v);
	const bow = Math.sin(t * Math.PI) * face.d * .07 * (1 - seal);
	return [
		pf[0] * (1 - t) + pb[0] * t + sign * bow,
		pf[1] * (1 - t) + pb[1] * t,
		pf[2] * (1 - t) + pb[2] * t
	];
}
function grid(segA, segB, sample, uv, flip) {
	const na = segA + 1;
	const pos = new Float32Array(na * (segB + 1) * 3);
	const uvs = new Float32Array(na * (segB + 1) * 2);
	for (let ib = 0; ib <= segB; ib += 1) for (let ia = 0; ia <= segA; ia += 1) {
		const p = sample(ia / segA, ib / segB);
		const i = ib * na + ia;
		pos[i * 3] = p[0];
		pos[i * 3 + 1] = p[1];
		pos[i * 3 + 2] = p[2];
		const t = uv(ia / segA, ib / segB);
		uvs[i * 2] = t[0];
		uvs[i * 2 + 1] = t[1];
	}
	const idx = [];
	for (let ib = 0; ib < segB; ib += 1) for (let ia = 0; ia < segA; ia += 1) {
		const a = ib * na + ia;
		const b = a + 1;
		const c = a + na;
		const d = c + 1;
		if (!flip) idx.push(a, b, c, b, d, c);
		else idx.push(a, c, b, b, c, d);
	}
	const g = new BufferGeometry();
	g.setAttribute("position", new BufferAttribute(pos, 3));
	g.setAttribute("uv", new BufferAttribute(uvs, 2));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}
var cache = /* @__PURE__ */ new Map();
function disposeGeos(g) {
	g.front.dispose();
	g.back.dispose();
	g.left.dispose();
	g.right.dispose();
	g.bottom.dispose();
	g.glass.dispose();
}
function getPouchGeos(face, win) {
	const key = [
		face.w,
		face.h,
		face.d,
		win.u0,
		win.u1,
		win.v0,
		win.v1
	].map((n) => n.toFixed(3)).join("|");
	const hit = cache.get(key);
	if (hit) return hit;
	const geos = {
		front: grid(32, 46, (u, v) => frontPoint(face, u, v), (u, v) => [u, v], false),
		back: grid(24, 36, (u, v) => backPoint(face, u, v), (u, v) => [1 - u, v], true),
		left: grid(5, 28, (t, v) => sidePoint(face, t, v, 0, -1), (t, v) => [t, v], false),
		right: grid(5, 28, (t, v) => sidePoint(face, t, v, 1, 1), (t, v) => [t, v], true),
		bottom: grid(24, 6, (u, t) => {
			const pf = frontPoint(face, u, 0);
			const pb = backPoint(face, u, 0);
			return [
				pf[0] * (1 - t) + pb[0] * t,
				0,
				pf[2] * (1 - t) + pb[2] * t
			];
		}, (u, t) => [u, t], false),
		glass: grid(18, 14, (a, b) => {
			const p = frontPoint(face, win.u0 + (win.u1 - win.u0) * a, win.v0 + (win.v1 - win.v0) * b);
			p[2] += .12;
			return p;
		}, (a, b) => [a, b], false)
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
var plasticNormal = null;
function getPlasticNormal() {
	if (plasticNormal) return plasticNormal;
	const size = 256;
	const height = new Float32Array(size * size);
	for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
		const u = x / size;
		const v = y / size;
		height[y * size + x] = Math.sin(u * 46 + v * 8) * .45 + Math.sin(u * 15 + v * 33) * .28 + Math.sin((u + v) * 30) * .18;
	}
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		plasticNormal = new CanvasTexture(canvas);
		return plasticNormal;
	}
	const img = ctx.createImageData(size, size);
	for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
		const l = height[y * size + (x + size - 1) % size] ?? 0;
		const r = height[y * size + (x + 1) % size] ?? 0;
		const d = height[(y + size - 1) % size * size + x] ?? 0;
		const u = height[(y + 1) % size * size + x] ?? 0;
		const nx = -(r - l) * 1.6;
		const ny = -(u - d) * 1.6;
		const nz = 1;
		const len = Math.hypot(nx, ny, nz) || 1;
		const i = (y * size + x) * 4;
		img.data[i] = nx / len * 127 + 128;
		img.data[i + 1] = ny / len * 127 + 128;
		img.data[i + 2] = nz / len * 127 + 128;
		img.data[i + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	plasticNormal = new CanvasTexture(canvas);
	plasticNormal.wrapS = RepeatWrapping;
	plasticNormal.wrapT = RepeatWrapping;
	plasticNormal.repeat.set(2.2, 2.6);
	plasticNormal.colorSpace = "";
	return plasticNormal;
}
var shadowTex = null;
function getShadowTexture() {
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
	shadowTex = new CanvasTexture(c);
	shadowTex.colorSpace = SRGBColorSpace;
	return shadowTex;
}
function createCove() {
	const segX = 48;
	const segZ = 36;
	const pos = [];
	const uv = [];
	const idx = [];
	for (let iz = 0; iz <= segZ; iz += 1) for (let ix = 0; ix <= segX; ix += 1) {
		const u = ix / segX;
		const v = iz / segZ;
		const x = -170 + 340 * u;
		let z = 130 + -220 * v;
		let y = 0;
		if (z < -6) {
			const t = Math.min(1, (-6 - z) / 58);
			const s = t * t * (3 - 2 * t);
			y = s * 110;
			z = -6 - Math.sin(s * Math.PI * .5) * 42;
		}
		pos.push(x, y, z);
		uv.push(u, v);
	}
	const na = 49;
	for (let iz = 0; iz < segZ; iz += 1) for (let ix = 0; ix < segX; ix += 1) {
		const a = iz * na + ix;
		idx.push(a, a + 1, a + na, a + 1, a + na + 1, a + na);
	}
	const g = new BufferGeometry();
	g.setAttribute("position", new Float32BufferAttribute(pos, 3));
	g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}
var PALETTE = [
	"#fff8ee",
	"#f4e2c6",
	"#ffeeda",
	"#efd0aa",
	"#fffaf4",
	"#e7c49a",
	"#f7d7b4"
].map((h) => new Color(h));
var CELL = 1.65;
var HEADS = /* @__PURE__ */ new Int32Array(128);
var NEXT = /* @__PURE__ */ new Int32Array(256);
var HX = /* @__PURE__ */ new Int32Array(256);
var HY = /* @__PURE__ */ new Int32Array(256);
var HZ = /* @__PURE__ */ new Int32Array(256);
function hash(ix, iy, iz) {
	return (ix * 73856093 ^ iy * 19349663 ^ iz * 83492791) & 127;
}
function rand(a, b) {
	return a + Math.random() * (b - a);
}
var beanGeo = null;
var beanMat = null;
function getBeanGeo() {
	if (beanGeo) return beanGeo;
	const g = new SphereGeometry(1, 16, 12);
	const pos = g.attributes.position;
	if (!pos) return g;
	for (let i = 0; i < pos.count; i += 1) {
		let x = pos.getX(i);
		let y = pos.getY(i);
		let z = pos.getZ(i);
		const k = x * x;
		x *= 1.08;
		y = y * .6 - k * .1;
		z = z * .8 + k * .06 * Math.sign(z || 1);
		pos.setXYZ(i, x, y, z);
	}
	g.computeVertexNormals();
	g.boundingSphere = new Sphere(new Vector3(0, 12, 1), 28);
	beanGeo = g;
	return g;
}
function beanTexture() {
	const c = document.createElement("canvas");
	c.width = 256;
	c.height = 256;
	const g = c.getContext("2d");
	if (!g) return new CanvasTexture(c);
	g.fillStyle = "#e7cfa6";
	g.fillRect(0, 0, 256, 256);
	const spots = [
		"#6d2c24",
		"#8a3d30",
		"#4a221c",
		"#a15a38",
		"#7a3418",
		"#5c241c"
	];
	for (let i = 0; i < 220; i += 1) {
		g.fillStyle = spots[i % spots.length] ?? "#6d2c24";
		g.globalAlpha = .35 + Math.random() * .55;
		const rw = 1.5 + Math.random() * 11;
		const rh = 1.2 + Math.random() * 8;
		g.beginPath();
		g.ellipse(Math.random() * 256, Math.random() * 256, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = .9;
	g.fillStyle = "#c4a074";
	g.beginPath();
	g.ellipse(168, 128, 16, 8, .4, 0, Math.PI * 2);
	g.fill();
	g.strokeStyle = "#8d6844";
	g.lineWidth = 2;
	g.stroke();
	const img = g.getImageData(0, 0, 256, 256);
	for (let i = 0; i < img.data.length; i += 4) {
		const n = (Math.random() - .5) * 12;
		img.data[i] = Math.max(0, Math.min(255, (img.data[i] ?? 0) + n));
		img.data[i + 1] = Math.max(0, Math.min(255, (img.data[i + 1] ?? 0) + n));
		img.data[i + 2] = Math.max(0, Math.min(255, (img.data[i + 2] ?? 0) + n * .6));
	}
	g.putImageData(img, 0, 0);
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 8;
	return tex;
}
function getBeanMat() {
	if (beanMat) return beanMat;
	beanMat = new MeshPhysicalMaterial({
		map: beanTexture(),
		roughness: .62,
		metalness: 0,
		sheen: .45,
		sheenColor: new Color("#f0d8b0"),
		sheenRoughness: .55,
		clearcoat: .08,
		clearcoatRoughness: .4,
		envMapIntensity: .45
	});
	return beanMat;
}
function createBeans(count, box) {
	const beans = [];
	const n = Math.min(count, 240);
	for (let i = 0; i < n; i += 1) {
		const split = i % 9 === 0;
		const s = .56 + Math.random() * .3;
		beans.push({
			x: rand(box.x0 + .3, box.x1 - .3),
			y: .6 + Math.random() * Math.max(1, box.y1 - .8),
			z: rand(box.z0 + .2, box.z1 - .2),
			vx: rand(-2, 2),
			vy: rand(-4, 2),
			vz: rand(-2, 2),
			rx: Math.random() * Math.PI * 2,
			ry: Math.random() * Math.PI * 2,
			rz: Math.random() * Math.PI * 2,
			wx: rand(-1, 1),
			wy: rand(-1, 1),
			wz: rand(-1, 1),
			r: .48 * s,
			sx: 1.22 * s,
			sy: (split ? .38 : .55) * s,
			sz: .84 * s,
			color: PALETTE[i % PALETTE.length] ?? PALETTE[0]
		});
	}
	separate(beans, 3);
	return beans;
}
function separate(beans, iters = 1) {
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
			for (let ox = -1; ox <= 1; ox += 1) for (let oy = -1; oy <= 1; oy += 1) for (let oz = -1; oz <= 1; oz += 1) {
				let j = HEADS[hash((HX[i] ?? 0) + ox, (HY[i] ?? 0) + oy, (HZ[i] ?? 0) + oz)] ?? -1;
				while (j !== -1) {
					if (j > i) pushApart(a, beans[j]);
					j = NEXT[j] ?? -1;
				}
			}
		}
	}
}
function pushApart(a, c) {
	if (!a || !c) return;
	const dx = c.x - a.x;
	const dy = c.y - a.y;
	const dz = c.z - a.z;
	const min = (a.r + c.r) * .96;
	const d2 = dx * dx + dy * dy + dz * dz;
	if (d2 >= min * min || d2 < 1e-8) return;
	const d = Math.sqrt(d2);
	const push = (min - d) * .5;
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
		const imp = rel * .28;
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
function stepBeans(beans, dt, time, ambient, box) {
	const n = beans.length;
	const ax = ambient ? Math.sin(time * .85) * 36 : 0;
	const az = ambient ? Math.cos(time * .67) * 18 : 0;
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
			b.vx *= -.2;
		} else if (b.x > box.x1 - b.r) {
			b.x = box.x1 - b.r;
			b.vx *= -.2;
		}
		if (b.z < box.z0 + b.r) {
			b.z = box.z0 + b.r;
			b.vz *= -.18;
		} else if (b.z > box.z1 - b.r) {
			b.z = box.z1 - b.r;
			b.vz *= -.18;
		}
		const floorY = b.r * .85 + Math.max(0, box.z1 - b.z) * .18;
		if (b.y < floorY) {
			b.y = floorY;
			if (b.vy < 0) b.vy *= -.16;
			b.vx *= .9;
			b.vz *= .9;
		}
		if (b.y > box.y1) {
			b.y = box.y1;
			b.vy *= -.15;
		}
		b.rx += (b.wx + b.vz * .15) * dt;
		b.ry += b.wy * dt;
		b.rz += (b.wz + b.vx * .12) * dt;
		b.wx *= .96;
		b.wy *= .96;
		b.wz *= .96;
	}
	separate(beans, 2);
}
function kickBeans(beans) {
	for (const b of beans) {
		b.vx += rand(-34, 34);
		b.vy += 16 + Math.random() * 34;
		b.vz += rand(-20, 20);
		b.wx = rand(-7, 7);
		b.wy = rand(-7, 7);
		b.wz = rand(-7, 7);
	}
}
var dummy = new Object3D();
function writeBeans(mesh, beans) {
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
var noopRaycast = () => {};
function useTex(url) {
	const ref = (0, import_react.useRef)(null);
	const [tex, setTex] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!url) {
			ref.current?.dispose();
			ref.current = null;
			setTex(null);
			return;
		}
		let live = true;
		new TextureLoader().load(url, (t) => {
			t.colorSpace = SRGBColorSpace;
			t.anisotropy = 8;
			t.needsUpdate = true;
			if (!live) {
				t.dispose();
				return;
			}
			ref.current?.dispose();
			ref.current = t;
			setTex(t);
		});
		return () => {
			live = false;
		};
	}, [url]);
	(0, import_react.useEffect)(() => () => {
		ref.current?.dispose();
		ref.current = null;
	}, []);
	return tex;
}
function plasticMat(opts) {
	return new MeshPhysicalMaterial({
		map: opts.map ?? null,
		color: opts.map ? "#ffffff" : opts.color,
		roughness: .42,
		metalness: 0,
		clearcoat: .72,
		clearcoatRoughness: .24,
		sheen: .28,
		sheenColor: new Color("#ffffff"),
		sheenRoughness: .55,
		envMapIntensity: .72,
		normalMap: opts.normal,
		normalScale: new Vector2(.28, .28),
		alphaTest: opts.alphaTest ?? 0,
		side: opts.side ?? 0
	});
}
function Beans({ count, box, shakeToken }) {
	const ref = (0, import_react.useRef)(null);
	const beans = (0, import_react.useRef)(null);
	const seen = (0, import_react.useRef)(shakeToken);
	const acc = (0, import_react.useRef)(0);
	const time = (0, import_react.useRef)(0);
	const boxRef = (0, import_react.useRef)(box);
	boxRef.current = box;
	const calm = (0, import_react.useRef)(false);
	if (!beans.current) beans.current = createBeans(count, box);
	(0, import_react.useEffect)(() => {
		calm.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		const mesh = ref.current;
		const list = beans.current;
		if (!mesh || !list) return;
		writeBeans(mesh, list);
		for (let i = 0; i < list.length; i += 1) {
			const color = list[i]?.color;
			if (color) mesh.setColorAt(i, color);
		}
		if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
	}, []);
	useFrame((_, delta) => {
		const list = beans.current;
		const mesh = ref.current;
		if (!list || !mesh) return;
		if (shakeToken !== seen.current) {
			seen.current = shakeToken;
			kickBeans(list);
		}
		acc.current += Math.min(delta, .05);
		let steps = 0;
		while (acc.current >= 1 / 60 && steps < 4) {
			stepBeans(list, 1 / 60, time.current, !calm.current, boxRef.current);
			acc.current -= 1 / 60;
			time.current += 1 / 60;
			steps += 1;
		}
		writeBeans(mesh, list);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		ref,
		args: [
			getBeanGeo(),
			getBeanMat(),
			count
		],
		dispose: null,
		castShadow: false,
		receiveShadow: true,
		frustumCulled: false
	});
}
function Pouch({ bag, skin, face, win, selected, windowOpen, shakeToken }) {
	const geos = (0, import_react.useMemo)(() => getPouchGeos(face, win), [face, win]);
	const normal = (0, import_react.useMemo)(() => getPlasticNormal(), []);
	const shadow = (0, import_react.useMemo)(() => getShadowTexture(), []);
	const frontTex = useTex(skin?.front);
	const backTex = useTex(skin?.back);
	const side = skin?.side ?? "#5c8f14";
	const count = beanCount(face);
	const cavity = (0, import_react.useMemo)(() => {
		return {
			x0: -face.w * .42,
			x1: face.w * .42,
			y1: face.h * Math.min(.52, win.v1 + .05),
			z0: -face.d * .28,
			z1: face.d * .55
		};
	}, [face, win]);
	const frontMat = (0, import_react.useMemo)(() => plasticMat({
		map: frontTex,
		color: side,
		normal,
		alphaTest: frontTex ? .4 : 0
	}), [
		frontTex,
		side,
		normal
	]);
	const backMat = (0, import_react.useMemo)(() => plasticMat({
		map: backTex,
		color: side,
		normal
	}), [
		backTex,
		side,
		normal
	]);
	const sideMat = (0, import_react.useMemo)(() => plasticMat({
		color: side,
		normal,
		side: 2
	}), [side, normal]);
	(0, import_react.useEffect)(() => () => frontMat.dispose(), [frontMat]);
	(0, import_react.useEffect)(() => () => backMat.dispose(), [backMat]);
	(0, import_react.useEffect)(() => () => sideMat.dispose(), [sideMat]);
	const winW = (win.u1 - win.u0) * face.w;
	const winH = (win.v1 - win.v0) * face.h;
	const cx = ((win.u0 + win.u1) / 2 - .5) * face.w;
	const cy = (win.v0 + win.v1) / 2 * face.h;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		userData: { bagId: bag.id },
		position: [
			bag.x,
			.02,
			bag.z
		],
		rotation: [
			0,
			bag.yaw * Math.PI / 180,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				geometry: geos.front,
				material: frontMat,
				castShadow: true,
				dispose: null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				geometry: geos.back,
				material: backMat,
				castShadow: true,
				dispose: null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				geometry: geos.left,
				material: sideMat,
				castShadow: true,
				dispose: null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				geometry: geos.right,
				material: sideMat,
				castShadow: true,
				dispose: null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				geometry: geos.bottom,
				material: sideMat,
				dispose: null
			}),
			windowOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					cx,
					cy,
					-face.d * .18
				],
				raycast: noopRaycast,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [winW * 1.2, winH * 1.25] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#141c12",
					roughness: 1
				})]
			}) : null,
			windowOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				geometry: geos.glass,
				dispose: null,
				renderOrder: 2,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshPhysicalMaterial", {
					color: "#ffffff",
					transparent: true,
					opacity: .16,
					roughness: .08,
					metalness: 0,
					clearcoat: 1,
					clearcoatRoughness: .15,
					envMapIntensity: 1.3,
					depthWrite: false
				})
			}) : null,
			windowOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beans, {
				count,
				box: cavity,
				shakeToken
			}, `${bag.id}-${face.w}-${face.h}-${count}`) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					.02,
					.3
				],
				scale: [
					face.w * .78,
					face.d * .95,
					1
				],
				raycast: noopRaycast,
				userData: { helper: true },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					map: shadow,
					transparent: true,
					depthWrite: false,
					toneMapped: false
				})]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					.04,
					0
				],
				raycast: noopRaycast,
				userData: { helper: true },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
					face.w * .62,
					face.w * .7,
					48
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#c5de78",
					transparent: true,
					opacity: .95,
					depthWrite: false,
					toneMapped: false
				})]
			}) : null
		]
	});
}
var pointer = new Vector2();
var raycaster = new Raycaster();
var hitPoint = new Vector3();
var floor = new Plane(new Vector3(0, 1, 0), 0);
function bagIdOf(obj) {
	let o = obj;
	while (o) {
		const id = o.userData?.bagId;
		if (typeof id === "string") return id;
		o = o.parent;
	}
	return null;
}
function ndc(ev, el) {
	const r = el.getBoundingClientRect();
	pointer.x = (ev.clientX - r.left) / Math.max(1, r.width) * 2 - 1;
	pointer.y = -((ev.clientY - r.top) / Math.max(1, r.height)) * 2 + 1;
}
function CameraBridge() {
	const controls = useThree((s) => s.controls);
	const camera = useThree((s) => s.camera);
	const applied = (0, import_react.useRef)(-1);
	useFrame(() => {
		const cam = useStudio.getState().camera;
		if (!controls || applied.current === cam.applyToken) return;
		applied.current = cam.applyToken;
		controls.target.set(cam.targetX, cam.targetY, cam.targetZ);
		const polar = cam.polar * Math.PI / 180;
		const az = cam.azimuth * Math.PI / 180;
		const sinP = Math.sin(polar);
		camera.position.set(cam.targetX + cam.radius * sinP * Math.sin(az), cam.targetY + cam.radius * Math.cos(polar), cam.targetZ + cam.radius * sinP * Math.cos(az));
		controls.update();
	});
	(0, import_react.useEffect)(() => {
		if (!controls) return;
		const onEnd = () => {
			const t = controls.target;
			const dx = camera.position.x - t.x;
			const dy = camera.position.y - t.y;
			const dz = camera.position.z - t.z;
			const radius = Math.hypot(dx, dy, dz) || 1;
			const polar = Math.acos(Math.min(1, Math.max(-1, dy / radius))) * 180 / Math.PI;
			let azimuth = Math.atan2(dx, dz) * 180 / Math.PI;
			if (azimuth > 180) azimuth -= 360;
			if (azimuth < -180) azimuth += 360;
			useStudio.getState().syncView({
				azimuth,
				polar,
				radius,
				targetX: t.x,
				targetY: t.y,
				targetZ: t.z
			});
		};
		controls.addEventListener("end", onEnd);
		return () => controls.removeEventListener("end", onEnd);
	}, [controls, camera]);
	return null;
}
function Interaction() {
	const { camera, gl, scene } = useThree();
	const grab = (0, import_react.useRef)({
		x: 0,
		z: 0,
		id: ""
	});
	(0, import_react.useEffect)(() => {
		const el = gl.domElement;
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			ndc(ev, el);
			raycaster.setFromCamera(pointer, camera);
			const hits = raycaster.intersectObjects(scene.children, true);
			let id = null;
			for (const h of hits) {
				if (h.object.userData?.helper) continue;
				id = bagIdOf(h.object);
				if (id) break;
			}
			if (!id) return;
			const bag = useStudio.getState().bags.find((b) => b.id === id);
			if (!bag) return;
			if (raycaster.ray.intersectPlane(floor, hitPoint)) grab.current = {
				x: bag.x - hitPoint.x,
				z: bag.z - hitPoint.z,
				id
			};
			else grab.current = {
				x: 0,
				z: 0,
				id
			};
			useStudio.getState().beginDrag(id);
			ev.stopPropagation();
		};
		const onMove = (ev) => {
			const s = useStudio.getState();
			if (!s.draggingId) return;
			ndc(ev, el);
			raycaster.setFromCamera(pointer, camera);
			if (!raycaster.ray.intersectPlane(floor, hitPoint)) return;
			s.moveBag(s.draggingId, hitPoint.x + grab.current.x, hitPoint.z + grab.current.z);
		};
		const onUp = () => {
			if (useStudio.getState().draggingId) useStudio.getState().endDrag();
		};
		el.addEventListener("pointerdown", onDown, true);
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		return () => {
			el.removeEventListener("pointerdown", onDown, true);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
	}, [
		camera,
		gl,
		scene
	]);
	return null;
}
function KeyLight() {
	const ref = (0, import_react.useRef)(null);
	const azimuth = useStudio((s) => s.lightAzimuth);
	const elevation = useStudio((s) => s.lightElevation);
	const intensity = useStudio((s) => s.lightKey);
	const position = (0, import_react.useMemo)(() => {
		const az = azimuth * Math.PI / 180;
		const el = elevation * Math.PI / 180;
		const dist = 140;
		return [
			dist * Math.cos(el) * Math.sin(az),
			Math.max(18, dist * Math.sin(el)),
			dist * Math.cos(el) * Math.cos(az)
		];
	}, [azimuth, elevation]);
	(0, import_react.useEffect)(() => {
		const light = ref.current;
		if (!light) return;
		light.target.position.set(0, 14, 0);
		light.parent?.add(light.target);
		light.target.updateMatrixWorld();
	}, [position]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
		ref,
		position,
		intensity,
		color: "#fff3e2",
		castShadow: true,
		"shadow-mapSize": [2048, 2048],
		"shadow-camera-near": 8,
		"shadow-camera-far": 320,
		"shadow-camera-left": -90,
		"shadow-camera-right": 90,
		"shadow-camera-top": 90,
		"shadow-camera-bottom": -90,
		"shadow-bias": -4e-4,
		"shadow-normalBias": .035
	});
}
function CoveMesh() {
	const geo = (0, import_react.useMemo)(() => createCove(), []);
	const bg = useStudio((s) => s.bg);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const mesh = ref.current;
		if (mesh) mesh.userData.cove = true;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		ref,
		geometry: geo,
		receiveShadow: true,
		userData: { cove: true },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: bg,
			roughness: .93,
			metalness: 0
		})
	});
}
function Shotter() {
	const gl = useThree((s) => s.gl);
	const scene = useThree((s) => s.scene);
	const camera = useThree((s) => s.camera);
	(0, import_react.useEffect)(() => {
		return registerCapture((shot) => {
			const size = new Vector2();
			gl.getSize(size);
			const pr = gl.getPixelRatio();
			const prevAspect = camera.aspect;
			const prevBg = scene.background;
			const prevAlpha = gl.getClearAlpha();
			const prevClear = gl.getClearColor(new Color());
			const hidden = [];
			scene.traverse((obj) => {
				if (shot.transparent && obj.userData?.cove && obj.visible) {
					obj.visible = false;
					hidden.push(obj);
				}
				if (obj.userData?.helper && obj.visible) {
					obj.visible = false;
					hidden.push(obj);
				}
			});
			if (shot.transparent) {
				scene.background = null;
				gl.setClearColor(0, 0);
			}
			gl.setPixelRatio(1);
			gl.setSize(shot.w, shot.h, false);
			camera.aspect = shot.w / shot.h;
			camera.updateProjectionMatrix();
			gl.render(scene, camera);
			const url = gl.domElement.toDataURL("image/png");
			for (const obj of hidden) obj.visible = true;
			scene.background = prevBg;
			gl.setClearColor(prevClear, prevAlpha);
			camera.aspect = prevAspect;
			camera.updateProjectionMatrix();
			gl.setPixelRatio(pr);
			gl.setSize(size.x, size.y, false);
			const a = document.createElement("a");
			a.href = url;
			a.download = `oshan-${Date.now()}.png`;
			a.click();
		});
	}, [
		gl,
		scene,
		camera
	]);
	return null;
}
function World() {
	const bags = useStudio((s) => s.bags);
	const skins = useStudio((s) => s.skins);
	const selectedId = useStudio((s) => s.selectedId);
	const faceMode = useStudio((s) => s.faceMode);
	const windowOpen = useStudio((s) => s.windowOpen);
	const u0 = useStudio((s) => s.u0);
	const u1 = useStudio((s) => s.u1);
	const v0 = useStudio((s) => s.v0);
	const v1 = useStudio((s) => s.v1);
	const shakeToken = useStudio((s) => s.shakeToken);
	const autoRotate = useStudio((s) => s.autoRotate);
	const dragging = useStudio((s) => s.draggingId);
	const bg = useStudio((s) => s.bg);
	const fill = useStudio((s) => s.lightFill);
	const rim = useStudio((s) => s.lightRim);
	const face = faceOf(faceMode);
	const win = {
		u0,
		u1,
		v0,
		v1
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: [bg]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraBridge, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shotter, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .2 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", {
			color: "#f7f4ec",
			groundColor: "#6a655c",
			intensity: .38
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyLight, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-48,
				28,
				36
			],
			intensity: fill,
			color: "#e7eef8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				12,
				36,
				-70
			],
			intensity: rim,
			color: "#fff6e8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoveMesh, {}),
		bags.map((bag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pouch, {
			bag,
			skin: skins[bag.id],
			face,
			win,
			selected: bag.id === selectedId,
			windowOpen,
			shakeToken
		}, bag.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Environment, {
				frames: 1,
				resolution: 128,
				environmentIntensity: .55,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
						form: "rect",
						intensity: 3.2,
						position: [
							0,
							6,
							2
						],
						scale: [
							10,
							4,
							1
						],
						color: "#fffaf4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
						form: "rect",
						intensity: 2.4,
						position: [
							5,
							3,
							4
						],
						scale: [
							4,
							6,
							1
						],
						color: "#ffffff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
						form: "rect",
						intensity: 1.1,
						position: [
							-6,
							2.5,
							2
						],
						scale: [
							3,
							4,
							1
						],
						color: "#e4ecff"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			makeDefault: true,
			enabled: !dragging,
			enableDamping: true,
			dampingFactor: .08,
			autoRotate: autoRotate && !dragging,
			autoRotateSpeed: .7,
			minPolarAngle: .18,
			maxPolarAngle: 1.42,
			minDistance: 42,
			maxDistance: 220
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interaction, {})
	] });
}
function Stage() {
	const bg = useStudio((s) => s.bg);
	const dragging = useStudio((s) => s.draggingId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: dragging ? "studio-view is-drag" : "studio-view",
		style: { background: bg },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			shadows: "soft",
			dpr: [1, 1.7],
			camera: {
				fov: 30,
				near: .4,
				far: 500,
				position: [
					42,
					52,
					96
				]
			},
			gl: {
				antialias: true,
				alpha: true,
				preserveDrawingBuffer: true,
				powerPreference: "high-performance"
			},
			onCreated: ({ gl }) => {
				gl.toneMapping = 4;
				gl.toneMappingExposure = 1.06;
				gl.outputColorSpace = SRGBColorSpace;
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "view-chip",
			children: "بسته را بکشید تا جابه‌جا شود · زمینه را بکشید تا دوربین بچرخد"
		})]
	});
}
var StageBoundary = class extends import_react.Component {
	state = { message: null };
	static getDerivedStateFromError(error) {
		return { message: error.message || "صحنه ساخته نشد" };
	}
	render() {
		if (this.state.message) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "studio-loading",
			children: ["خطای صحنه: ", this.state.message]
		});
		return this.props.children;
	}
};
function StudioApp() {
	const faceMode = useStudio((s) => s.faceMode);
	const fit = useStudio((s) => s.fit);
	const cropWhite = useStudio((s) => s.cropWhite);
	const windowOpen = useStudio((s) => s.windowOpen);
	const u0 = useStudio((s) => s.u0);
	const u1 = useStudio((s) => s.u1);
	const v0 = useStudio((s) => s.v0);
	const v1 = useStudio((s) => s.v1);
	const sourceSig = useStudio((s) => s.bags.map((b) => `${b.id}:${b.source ?? ""}`).join("|"));
	(0, import_react.useEffect)(() => {
		let dead = false;
		const timer = window.setTimeout(() => {
			(async () => {
				const s = useStudio.getState();
				const face = faceOf(s.faceMode);
				const win = {
					u0: s.u0,
					u1: s.u1,
					v0: s.v0,
					v1: s.v1
				};
				const incoming = {};
				await Promise.all(s.bags.map(async (bag) => {
					const isDefault = !bag.source;
					try {
						incoming[bag.id] = await prepareLabel(bag.source ?? "/pack/default-bag.jpg", {
							face,
							cropWhite: isDefault ? true : s.cropWhite,
							fit: isDefault && s.faceMode === "print" ? "contain" : isDefault ? "cover" : s.fit,
							windowOpen: s.windowOpen,
							win
						});
					} catch {}
				}));
				if (!dead) {
					useStudio.getState().setSkins(incoming);
					window.__studioReady = true;
				}
			})();
		}, 60);
		return () => {
			dead = true;
			window.clearTimeout(timer);
		};
	}, [
		faceMode,
		fit,
		cropWhite,
		windowOpen,
		u0,
		u1,
		v0,
		v1,
		sourceSig
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "studio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "studio-bar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-mark",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "brand-name",
						children: "استودیو اوشان"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "brand-sub",
						children: "بسته‌بندی سه‌بعدی حبوبات"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bar-spacer" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bar-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShakeButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary",
						onClick: shootFromBar,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "icon" }), "PNG"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "studio-body",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {})]
		})]
	});
}
//#endregion
export { StudioApp as default };
