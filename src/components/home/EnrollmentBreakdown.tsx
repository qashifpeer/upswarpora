import Link from 'next/link';

export interface ClassStat {
  key: string;
  label: string;
  count: number;
}

interface EnrollmentBreakdownProps {
  classBreakdown: ClassStat[];
  maxClassCount: number;
}

export default function EnrollmentBreakdown({
  classBreakdown,
  maxClassCount,
}: EnrollmentBreakdownProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/75 p-6 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-md sm:p-8 lg:col-span-7">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
            Live Sanity Sync
          </span>
          <h2 className="mt-0.5 text-xl font-extrabold text-slate-100">
            Class-Wise Active Enrollment
          </h2>
        </div>
        <Link
          href="/all-students"
          className="rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:border-cyan-400"
        >
          View All →
        </Link>
      </div>

      <div className="mt-6 space-y-3.5">
        {classBreakdown.map((item) => {
          const widthPercent = Math.max(
            Math.round((item.count / maxClassCount) * 100),
            item.count > 0 ? 8 : 2
          );

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">{item.label}</span>
                <span className="font-mono font-bold text-cyan-300">
                  {item.count} {item.count === 1 ? 'Student' : 'Students'}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}