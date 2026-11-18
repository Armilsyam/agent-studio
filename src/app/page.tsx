"use client";

import dynamic from "next/dynamic";

const StudioDashboard = dynamic(
  () => import("@/components/StudioDashboard").then((mod) => mod.StudioDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-semibold tracking-wide">
            Memuat AI Agent Studio &amp; Remotion Engine...
          </span>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  return <StudioDashboard />;
}
