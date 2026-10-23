import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Leaf } from "@/components/studio/Mark";

const StudioApp = lazy(() => import("@/components/studio/StudioApp"));

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <Suspense fallback={<Shell />}>{ready ? <StudioApp /> : <Shell />}</Suspense>;
}

export function Shell() {
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
      </header>
      <div className="studio-loading">در حال چیدن استودیو…</div>
    </main>
  );
}

