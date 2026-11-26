import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ResultSearchClient from "./ResultSearchClient";

export const dynamic = "force-dynamic";

export default async function ResultPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/login?callbackUrl=/result");
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* Ambient Cyberpunk Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-block rounded-full border border-fuchsia-400/40 bg-fuchsia-950/50 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.25)]">
            Session 2026 • UDISE: 01011301201
          </span>
          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            GMS Warpora — Examination Result
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Search by student name to view and print the official 2026 marks
            sheet.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-8 text-center text-sm text-cyan-300">
              Loading result search...
            </div>
          }
        >
          <ResultSearchClient />
        </Suspense>
      </main>
    </div>
  );
}
