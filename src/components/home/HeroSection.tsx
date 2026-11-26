import Link from 'next/link';

interface HeroSectionProps {
  totalActive: number;
  girlsCount: number;
  boysCount: number;
}

export default function HeroSection({
  totalActive,
  girlsCount,
  boysCount,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/35 bg-slate-900/75 p-8 shadow-[0_0_50px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-12 lg:p-16">
      <div className="absolute inset-x-12 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Left Copy & CTA Buttons */}
        <div className="space-y-6 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-950/60 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              UDISE: 01011301201
            </span>
            <span className="rounded-full border border-fuchsia-500/40 bg-fuchsia-950/50 px-3.5 py-1 text-xs font-semibold tracking-wide text-fuchsia-300">
              Department of School Education • J&amp;K
            </span>
          </div>

          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-100 to-fuchsia-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Government Middle School Warpora
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Digital academic portal and student information system for GMS Warpora, District
            Kupwara. Access verified student registries, 2026 annual marks sheets, bonafide
            certificates, and daily PM-POSHAN meal logs in one unified workspace.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/all-students"
              className="inline-flex items-center gap-2.5 rounded-xl border border-cyan-400/80 bg-cyan-950/80 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-900 hover:text-white hover:shadow-[0_0_32px_rgba(34,211,238,0.55)]"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Student Directory</span>
            </Link>

            <Link
              href="/result"
              className="inline-flex items-center gap-2.5 rounded-xl border border-fuchsia-400/80 bg-fuchsia-950/70 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-fuchsia-200 shadow-[0_0_24px_rgba(217,70,239,0.3)] transition hover:bg-fuchsia-900/80 hover:text-white hover:shadow-[0_0_32px_rgba(217,70,239,0.55)]"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Check Result 2026</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-emerald-400/70 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(52,211,153,0.3)]"
            >
              <span>Staff Login →</span>
            </Link>
          </div>
        </div>

        {/* Right Live Institutional Snapshot Card */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-fuchsia-500/35 bg-slate-950/85 p-6 shadow-[0_0_30px_rgba(217,70,239,0.16)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
                Live School Snapshot
              </span>
              <span className="rounded-md border border-emerald-500/40 bg-emerald-950/80 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                SESSION 2026
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Active Enrollment
                </p>
                <p className="mt-1 font-mono text-3xl font-extrabold text-cyan-300">
                  {totalActive}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-fuchsia-500/30 bg-slate-900/80 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Girls
                  </p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-fuchsia-300">
                    {girlsCount}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Boys
                  </p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-300">
                    {boysCount}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Grades Offered:</span>
                  <span className="font-semibold text-cyan-200">Pre-Primary – Class 8</span>
                </div>
                <div className="mt-1.5 flex justify-between">
                  <span className="text-slate-400">Official Email:</span>
                  <span className="font-mono text-fuchsia-300">upswarpora@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}