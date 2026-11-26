export default function AcademicPillars() {
  return (
    <div className="flex flex-col justify-between gap-6 lg:col-span-5">
      {/* NEP 2020 & Holistic Learning Card */}
      <div className="rounded-3xl border border-fuchsia-500/30 bg-slate-900/75 p-6 shadow-[0_0_30px_rgba(217,70,239,0.1)] backdrop-blur-md sm:p-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-400">
          Academic Vision
        </span>
        <h2 className="mt-1 text-xl font-extrabold text-slate-100">
          NEP 2020 &amp; Holistic Learning
        </h2>

        <ul className="mt-5 space-y-4 text-sm text-slate-300">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-cyan-400/50 bg-cyan-950/70 font-mono text-xs font-bold text-cyan-300">
              01
            </span>
            <div>
              <p className="font-bold text-slate-100">Holistic Progress Card (HPC)</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Competency-based 360-degree student assessment aligned with PARAKH &amp; JKBOSE
                guidelines.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-fuchsia-400/50 bg-fuchsia-950/70 font-mono text-xs font-bold text-fuchsia-300">
              02
            </span>
            <div>
              <p className="font-bold text-slate-100">Multilingual Foundation</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Balanced curriculum covering English, Urdu, Kashmiri, Mathematics, Science, and
                Social Science.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-400/50 bg-emerald-950/70 font-mono text-xs font-bold text-emerald-300">
              03
            </span>
            <div>
              <p className="font-bold text-slate-100">QR-Verified Documentation</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Instant digital verification for student marksheets and bonafide certificates linked
                via PEN.
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* School Office & Verification Desk Card */}
      <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/75 p-6 shadow-[0_0_25px_rgba(52,211,153,0.1)] backdrop-blur-md">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-300">
          School Office &amp; Verification Desk
        </h3>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <p>
            <span className="text-slate-400">Institution:</span>{' '}
            <strong className="text-slate-100">Government Middle School Warpora</strong>
          </p>
          <p>
            <span className="text-slate-400">UDISE Code:</span>{' '}
            <span className="font-mono font-bold text-cyan-300">01011301201</span>
          </p>
          <p>
            <span className="text-slate-400">District:</span> Kupwara, Jammu &amp; Kashmir
          </p>
          <p>
            <span className="text-slate-400">Email:</span>{' '}
            <a
              href="mailto:upswarpora@gmail.com"
              className="font-mono text-fuchsia-300 underline decoration-fuchsia-500/40 underline-offset-4 hover:text-fuchsia-200"
            >
              upswarpora@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}