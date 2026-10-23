import { i as __toESM } from "../_runtime.mjs";
import { l as require_jsx_runtime, u as require_react } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-5fXCBAvv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function Leaf() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "icon",
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M5 16.5C5 10 10 4.5 19 4c.2 6.5-2.2 12-8.2 14.2C8.2 19 6.2 18.2 5 16.5Z",
			fill: "currentColor"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M9 14c2-1.2 4.2-3.4 5.6-6.2",
			stroke: "var(--color-primary)",
			strokeWidth: "1.4"
		})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({
	Shell: () => Shell,
	component: () => Home
});
var StudioApp = (0, import_react.lazy)(() => import("./StudioApp-CBWX9o6Y.mjs"));
function Home() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {}),
		children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {})
	});
}
function Shell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "studio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "studio-bar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "studio-loading",
			children: "در حال چیدن استودیو…"
		})]
	});
}
//#endregion
export { Leaf as n, routes_exports as t };
