import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { fetchStudentsByClass } from './actions';
import FetchDetailClient from './FetchDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FetchDetailPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/login?callbackUrl=/fetch-detail');
  }

  // Load Class 8 initially to match default dropdown selection
  const initialStudents = await fetchStudentsByClass('8');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* Ambient Cyberpunk Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-block rounded-full border border-cyan-400/40 bg-cyan-950/50 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            Custom Field Extractor • UDISE: 01011301201
          </span>
          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            GMS Warpora — Fetch Student Details
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Choose a class (8th down to KG), toggle the required masterData field pills, and export directly to Excel.
          </p>
        </div>

        <FetchDetailClient initialStudents={initialStudents} />
      </main>
    </div>
  );
}