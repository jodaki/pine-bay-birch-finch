import { useState } from "react";
import {
  Camera,
  Copy,
  Download,
  ImagePlus,
  LayoutGrid,
  Plus,
  RotateCcw,
  SunMedium,
  Trash2,
  Vibrate,
  Boxes,
} from "lucide-react";
import {
  BACKGROUNDS,
  EXPORTS,
  FACE_PRINT,
  FACE_PRODUCT,
  MAX_BAGS,
  faNum,
  faceOf,
  type ExportSize,
} from "@/lib/studio/constants";
import { takePhoto } from "@/lib/studio/capture";
import { useStudio } from "@/lib/studio/store";

type Tab = "bags" | "art" | "camera" | "studio";

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
}) {
  return (
    <label className="field">
      <span className="field-label">
        <span>{label}</span>
        <span className="field-value">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

async function readFile(file: File) {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return data;
}

export function Panel() {
  const [tab, setTab] = useState<Tab>("art");
  const [over, setOver] = useState(false);
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

  async function applyFile(file: File | undefined) {
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
    const ok = takePhoto({ w: size.w, h: size.h, transparent: exportTransparent });
    useStudio.getState().setStatus(ok ? "پی‌ان‌جی ذخیره شد" : "صحنه هنوز آماده نیست");
  }

  return (
    <aside className="studio-panel">
      <div className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected={tab === "bags"} onClick={() => setTab("bags")}>
          <Boxes className="icon" />
          بسته‌ها
        </button>
        <button className="tab" role="tab" aria-selected={tab === "art"} onClick={() => setTab("art")}>
          <ImagePlus className="icon" />
          طرح
        </button>
        <button className="tab" role="tab" aria-selected={tab === "camera"} onClick={() => setTab("camera")}>
          <Camera className="icon" />
          دوربین
        </button>
        <button className="tab" role="tab" aria-selected={tab === "studio"} onClick={() => setTab("studio")}>
          <SunMedium className="icon" />
          استودیو
        </button>
      </div>
      <div className="panel-body" role="tabpanel">
        {tab === "bags" ? (
          <>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => useStudio.getState().addBag()} disabled={bags.length >= MAX_BAGS}>
                <Plus className="icon" />
                بسته تازه
              </button>
              <button className="btn" onClick={() => useStudio.getState().arrange()} disabled={bags.length < 2}>
                <LayoutGrid className="icon" />
                چیدمان
              </button>
            </div>
            <p className="note">تا {faNum(MAX_BAGS)} بسته. بستهٔ انتخاب‌شده را روی کف استودیو بکشید.</p>
            <div className="bag-list">
              {bags.map((bag, i) => (
                <div key={bag.id} className={bag.id === selectedId ? "bag-row is-on" : "bag-row"}>
                  <button className="bag-pick" onClick={() => useStudio.getState().select(bag.id)} aria-pressed={bag.id === selectedId}>
                    {skins[bag.id]?.front ? (
                      <img className="bag-thumb" alt="" src={skins[bag.id]?.front} />
                    ) : (
                      <span className="bag-thumb" />
                    )}
                    <span className="bag-meta">
                      <b>بسته {faNum(i + 1)}</b>
                      <span>{bag.source ? "طرح سفارشی" : "طرح اوشان"}</span>
                    </span>
                  </button>
                  <button className="icon-btn" aria-label="کپی بسته" onClick={() => useStudio.getState().duplicate(bag.id)} disabled={bags.length >= MAX_BAGS}>
                    <Copy className="icon" />
                  </button>
                  <button className="icon-btn danger" aria-label="حذف بسته" onClick={() => useStudio.getState().remove(bag.id)}>
                    <Trash2 className="icon" />
                  </button>
                </div>
              ))}
              {bags.length === 0 ? <p className="note">استودیو خالی است. یک بسته بگذارید.</p> : null}
            </div>
            {selected ? (
              <Slider
                label="چرخش بسته"
                min={-180}
                max={180}
                step={1}
                value={selected.yaw}
                onChange={(yaw) => useStudio.getState().setYaw(selected.id, yaw)}
                format={(n) => `${faNum(Math.round(n))}°`}
              />
            ) : null}
          </>
        ) : null}

        {tab === "art" ? (
          <>
            <label
              className={over ? "drop over" : "drop"}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                void applyFile(e.dataTransfer.files[0]);
              }}
            >
              <ImagePlus className="icon" />
              <strong>بارگذاری طرح چاپ</strong>
              <p>فایل ۳۴×۲۸ سانتی‌متر، PNG یا JPG. روی بستهٔ انتخاب‌شده می‌نشیند و جای طرح سبز را می‌گیرد.</p>
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  void applyFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <div className="chips">
              <button className="chip" aria-pressed={faceMode === "product"} onClick={() => useStudio.getState().setFaceMode("product")}>
                نسبت اوشان {faNum(FACE_PRODUCT.w, 1)}×{faNum(FACE_PRODUCT.h, 0)}
              </button>
              <button className="chip" aria-pressed={faceMode === "print"} onClick={() => useStudio.getState().setFaceMode("print")}>
                طرح {faNum(FACE_PRINT.h, 0)}×{faNum(FACE_PRINT.w, 0)}
              </button>
            </div>
            <p className="note">
              سطح روبرو الان {faNum(face.w, 1)} پهنا در {faNum(face.h, 0)} بلندا، سانتی‌متر. حالت «طرح ۳۴×۲۸» بسته را دقیقاً هم‌اندازهٔ فایل چاپ می‌کند (۲۸ پهنا × ۳۴ بلندا).
            </p>
            <div className="chips">
              <button className="chip" aria-pressed={fit === "cover"} onClick={() => useStudio.getState().setFit("cover")}>
                پوشش کامل
              </button>
              <button className="chip" aria-pressed={fit === "contain"} onClick={() => useStudio.getState().setFit("contain")}>
                نمایش کامل
              </button>
            </div>
            <label className="check">
              <input type="checkbox" checked={cropWhite} onChange={(e) => useStudio.getState().setCropWhite(e.target.checked)} />
              حذف زمینهٔ سفید دور عکس
            </label>
            <label className="check">
              <input type="checkbox" checked={windowOpen} onChange={(e) => useStudio.getState().setWindowOpen(e.target.checked)} />
              پنجرهٔ شفاف و لوبیای متحرک داخل بسته
            </label>
            {windowOpen ? (
              <>
                <Slider label="لبهٔ چپ پنجره" min={0.16} max={0.55} step={0.005} value={u0} onChange={(n) => useStudio.getState().setWindow({ u0: Math.min(n, u1 - 0.12) })} format={(n) => faNum(n * 100, 0) + "٪"} />
                <Slider label="لبهٔ راست پنجره" min={0.6} max={1} step={0.005} value={u1} onChange={(n) => useStudio.getState().setWindow({ u1: Math.max(n, u0 + 0.12) })} format={(n) => faNum(n * 100, 0) + "٪"} />
                <Slider label="پایین پنجره" min={0} max={0.2} step={0.005} value={v0} onChange={(n) => useStudio.getState().setWindow({ v0: Math.min(n, v1 - 0.12) })} format={(n) => faNum(n * 100, 0) + "٪"} />
                <Slider label="بالای پنجره" min={0.24} max={0.7} step={0.005} value={v1} onChange={(n) => useStudio.getState().setWindow({ v1: Math.max(n, v0 + 0.12) })} format={(n) => faNum(n * 100, 0) + "٪"} />
              </>
            ) : null}
            <button
              className="btn"
              disabled={!selected?.source}
              onClick={() => {
                if (selected) useStudio.getState().setSource(selected.id, null);
              }}
            >
              <RotateCcw className="icon" />
              بازگشت به طرح اوشان
            </button>
          </>
        ) : null}

        {tab === "camera" ? (
          <>
            <div className="chips">
              <button className="chip" onClick={() => useStudio.getState().look(0, 80, 1)}>روبرو</button>
              <button className="chip" onClick={() => useStudio.getState().look(32, 66, 1.04)}>سه‌رخ</button>
              <button className="chip" onClick={() => useStudio.getState().look(86, 76, 1.08)}>پهلو</button>
              <button className="chip" onClick={() => useStudio.getState().look(18, 24, 1.12)}>بالا</button>
            </div>
            <Slider label="چرخش افقی" min={-180} max={180} step={1} value={camera.azimuth} onChange={(azimuth) => useStudio.getState().patchCamera({ azimuth })} format={(n) => `${faNum(Math.round(n))}°`} />
            <Slider label="زاویهٔ عمودی" min={18} max={84} step={1} value={camera.polar} onChange={(polar) => useStudio.getState().patchCamera({ polar })} format={(n) => `${faNum(Math.round(n))}°`} />
            <Slider label="فاصله" min={48} max={200} step={1} value={camera.radius} onChange={(radius) => useStudio.getState().patchCamera({ radius })} format={(n) => faNum(Math.round(n))} />
            <Slider label="ارتفاع نگاه" min={4} max={32} step={0.5} value={camera.targetY} onChange={(targetY) => useStudio.getState().patchCamera({ targetY })} format={(n) => faNum(n, 1)} />
            <label className="check">
              <input type="checkbox" checked={autoRotate} onChange={(e) => useStudio.getState().setAutoRotate(e.target.checked)} />
              چرخش آرام صفحه
            </label>
            <button className="btn" onClick={() => useStudio.getState().look(camera.azimuth, camera.polar, 1)}>
              قاب‌گرفتن همهٔ بسته‌ها
            </button>
          </>
        ) : null}

        {tab === "studio" ? (
          <>
            <div className="swatches">
              {BACKGROUNDS.map((item) => (
                <button
                  key={item.id}
                  className="swatch"
                  style={{ background: item.color }}
                  aria-label={item.label}
                  aria-pressed={bg === item.color}
                  onClick={() => useStudio.getState().setBg(item.color)}
                />
              ))}
            </div>
            <label className="color-row">
              <input type="color" value={bg} onChange={(e) => useStudio.getState().setBg(e.target.value)} aria-label="رنگ دلخواه پس‌زمینه" />
              <span>پس‌زمینهٔ یکپارچهٔ استودیو</span>
            </label>
            <Slider label="جهت نور" min={-180} max={180} step={1} value={lightAzimuth} onChange={(lightAzimuth) => useStudio.getState().setLight({ lightAzimuth })} format={(n) => `${faNum(Math.round(n))}°`} />
            <Slider label="ارتفاع نور" min={18} max={80} step={1} value={lightElevation} onChange={(lightElevation) => useStudio.getState().setLight({ lightElevation })} format={(n) => `${faNum(Math.round(n))}°`} />
            <Slider label="شدت نور اصلی" min={0.4} max={5} step={0.05} value={lightKey} onChange={(lightKey) => useStudio.getState().setLight({ lightKey })} format={(n) => faNum(n, 1)} />
            <Slider label="نور پرکننده" min={0} max={2} step={0.05} value={lightFill} onChange={(lightFill) => useStudio.getState().setLight({ lightFill })} format={(n) => faNum(n, 2)} />
            <Slider label="نور لبه‌ای" min={0} max={2.4} step={0.05} value={lightRim} onChange={(lightRim) => useStudio.getState().setLight({ lightRim })} format={(n) => faNum(n, 2)} />
            <div className="chips">
              {(Object.keys(EXPORTS) as ExportSize[]).map((id) => (
                <button key={id} className="chip" aria-pressed={exportSize === id} onClick={() => useStudio.getState().setExportSize(id)}>
                  {EXPORTS[id].label} {faNum(EXPORTS[id].w)}×{faNum(EXPORTS[id].h)}
                </button>
              ))}
            </div>
            <label className="check">
              <input type="checkbox" checked={exportTransparent} onChange={(e) => useStudio.getState().setExportTransparent(e.target.checked)} />
              PNG با پس‌زمینهٔ شفاف
            </label>
            <button className="btn btn-primary" onClick={shoot}>
              <Download className="icon" />
              دریافت PNG
            </button>
          </>
        ) : null}
        <p className="status">{status}</p>
      </div>
    </aside>
  );
}

export function shootFromBar() {
  const { exportSize, exportTransparent, setStatus } = useStudio.getState();
  const size = EXPORTS[exportSize];
  const ok = takePhoto({ w: size.w, h: size.h, transparent: exportTransparent });
  setStatus(ok ? "پی‌ان‌جی ذخیره شد" : "صحنه هنوز آماده نیست");
}

export function ShakeButton() {
  return (
    <button className="btn" onClick={() => useStudio.getState().shake()}>
      <Vibrate className="icon" />
      تکان
    </button>
  );
}
