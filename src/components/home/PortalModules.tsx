import Link from 'next/link';

interface ModuleCardItem {
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: 'cyan' | 'fuchsia' | 'emerald' | 'amber';
  icon: React.ReactNode;
}

const MODULES: ModuleCardItem[] = [
  {
    title: 'Master Student Registry',
    description:
      'Manage PEN records, update enrollment statuses, edit student profiles, and generate QR-verified Bonafide certificates.',
    href: '/all-students',
    cta: 'Open Registry',
    accent: 'cyan',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Result 2026 & Marksheets',
    description:
      'Instant PEN-based marksheet lookup and A4 printable result cards with subject-wise totals and QR verification.',
    href: '/result',
    cta: 'View Results',
    accent: 'fuchsia',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'PM-POSHAN Mid-Day Meal',
    description:
      'Daily meal attendance entry, rice consumption tracking in kg, ingredient rate calculations, and A4 monthly reports.',
    href: '/mid-day-meal',
    cta: 'Open MDM Tracker',
    accent: 'emerald',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
  },
  {
    title: 'Staff Admin Portal',
    description:
      'Authenticated access for school nodal officers and teaching staff to modify master records and issue certificates.',
    href: '/login',
    cta: 'Staff Sign In',
    accent: 'amber',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const ACCENT_STYLES = {
  cyan: {
    card: 'border-cyan-500/35 shadow-[0_0_25px_rgba(34,211,238,0.08)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.28)]',
    icon: 'border-cyan-400/50 bg-cyan-950/70 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]',
    title: 'group-hover:text-cyan-300',
    cta: 'text-cyan-400',
  },
  fuchsia: {
    card: 'border-fuchsia-500/35 shadow-[0_0_25px_rgba(217,70,239,0.08)] hover:border-fuchsia-400 hover:shadow-[0_0_35px_rgba(217,70,239,0.28)]',
    icon: 'border-fuchsia-400/50 bg-fuchsia-950/70 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.25)]',
    title: 'group-hover:text-fuchsia-300',
    cta: 'text-fuchsia-400',
  },
  emerald: {
    card: 'border-emerald-500/35 shadow-[0_0_25px_rgba(52,211,153,0.08)] hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(52,211,153,0.28)]',
    icon: 'border-emerald-400/50 bg-emerald-950/70 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]',
    title: 'group-hover:text-emerald-300',
    cta: 'text-emerald-400',
  },
  amber: {
    card: 'border-amber-500/35 shadow-[0_0_25px_rgba(251,191,36,0.08)] hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.28)]',
    icon: 'border-amber-400/50 bg-amber-950/70 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]',
    title: 'group-hover:text-amber-300',
    cta: 'text-amber-400',
  },
};

export default function PortalModules() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Core Services
          </span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
            School Administration &amp; Student Modules
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Click any module below to launch its workspace
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((mod) => {
          const styles = ACCENT_STYLES[mod.accent];

          return (
            <Link
              key={mod.href}
              href={mod.href}
              className={`group relative flex flex-col justify-between rounded-2xl border bg-slate-900/75 p-6 transition duration-200 hover:-translate-y-1 ${styles.card}`}
            >
              <div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${styles.icon}`}
                >
                  {mod.icon}
                </div>
                <h3 className={`mt-5 text-lg font-bold text-slate-100 ${styles.title}`}>
                  {mod.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{mod.description}</p>
              </div>
              <span
                className={`mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${styles.cta}`}
              >
                {mod.cta}{' '}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}