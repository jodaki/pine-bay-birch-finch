import { useEffect } from "react";
import { Download } from "lucide-react";
import { DEFAULT_LABEL, faceOf, type Win } from "@/lib/studio/constants";
import { prepareLabel } from "@/lib/studio/label";
import { useStudio } from "@/lib/studio/store";
import { Leaf } from "@/components/studio/Mark";
import { Panel, ShakeButton, shootFromBar } from "@/components/studio/Panel";
import { Stage } from "@/components/studio/Stage";
import { Component, type ReactNode } from "react";

class StageBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message || "صحنه ساخته نشد" };
  }

  render() {
    if (this.state.message) {
      return <div className="studio-loading">خطای صحنه: {this.state.message}</div>;
    }
    return this.props.children;
  }
}

export default function StudioApp() {
  const faceMode = useStudio((s) => s.faceMode);
  const fit = useStudio((s) => s.fit);
  const cropWhite = useStudio((s) => s.cropWhite);
  const windowOpen = useStudio((s) => s.windowOpen);
  const u0 = useStudio((s) => s.u0);
  const u1 = useStudio((s) => s.u1);
  const v0 = useStudio((s) => s.v0);
  const v1 = useStudio((s) => s.v1);
  const sourceSig = useStudio((s) => s.bags.map((b) => `${b.id}:${b.source ?? ""}`).join("|"));

  useEffect(() => {
    let dead = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const s = useStudio.getState();
        const face = faceOf(s.faceMode);
        const win: Win = { u0: s.u0, u1: s.u1, v0: s.v0, v1: s.v1 };
        const incoming: Record<string, { front: string; back: string; side: string }> = {};
        await Promise.all(
          s.bags.map(async (bag) => {
            const isDefault = !bag.source;
            try {
              incoming[bag.id] = await prepareLabel(bag.source ?? DEFAULT_LABEL, {
                face,
                cropWhite: isDefault ? true : s.cropWhite,
                fit: isDefault && s.faceMode === "print" ? "contain" : isDefault ? "cover" : s.fit,
                windowOpen: s.windowOpen,
                win,
              });
            } catch {
              /* keep the previous skin */
            }
          }),
        );
        if (!dead) {
          useStudio.getState().setSkins(incoming);
          (window as Window & { __studioReady?: boolean }).__studioReady = true;
        }
      })();
    }, 60);
    return () => {
      dead = true;
      window.clearTimeout(timer);
    };
  }, [faceMode, fit, cropWhite, windowOpen, u0, u1, v0, v1, sourceSig]);

  return (
    <main className="studio">
      <header className="studio-bar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Leaf />
          </span>
          <div>
            <div className="brand-name">استودیو اوشان</div>
            <div className="brand-sub">بسته‌بندی سه‌بعدی حبوبات</div>
          </div>
        </div>
        <div className="bar-spacer" />
        <div className="bar-actions">
          <ShakeButton />
          <button className="btn btn-primary" onClick={shootFromBar}>
            <Download className="icon" />
            PNG
          </button>
        </div>
      </header>
      <div className="studio-body">
        <StageBoundary>
          <Stage />
        </StageBoundary>
        <Panel />
      </div>
    </main>
  );
}
