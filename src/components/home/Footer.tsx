import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-cyan-500/25 bg-slate-950/90 py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <p className="font-bold text-slate-200">
            Government Middle School Warpora • UDISE: 01011301201
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Department of School Education, Jammu &amp; Kashmir
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 font-semibold">
          <Link href="/all-students" className="transition hover:text-cyan-300">
            Students
          </Link>
          <Link href="/result" className="transition hover:text-fuchsia-300">
            Result 2026
          </Link>
          <Link href="/mid-day-meal" className="transition hover:text-emerald-300">
            Mid-Day Meal
          </Link>
          <Link href="/login" className="transition hover:text-amber-300">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}