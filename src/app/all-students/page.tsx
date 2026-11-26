import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { sanityClient } from '@/lib/sanity';
import StudentsTable, { type StudentRow } from './StudentsTable';
import { logoutAction } from '../login/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllStudents(): Promise<StudentRow[]> {
  const query = `*[_type == "masterData"] | order(class asc, name asc) {
    _id,
    pen,
    name,
    father_name,
    mother_name,
    dob,
    class,
    gender,
    aadhaar,
    bankAccount,
    bankName,
    bankBranch,
    ifscCode,
    adress,
    phone,
    bpl,
    aay,
    admission_number,
    admission_date,
    prev_class,
    "status": coalesce(status, "active"),
    "promotionStatus": coalesce(promotionStatus, "none"),
    remarks
  }`;

  return sanityClient.fetch<StudentRow[]>(query, {}, { cache: 'no-store' });
}

export default async function AllStudentsPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/login?callbackUrl=/all-students');
  }

  const students = await getAllStudents();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="inline-block rounded-full border border-cyan-400/40 bg-cyan-950/50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              Authenticated Staff View — Click PEN or Name for Profile
            </span>
            <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              GMS Warpora — All Students
            </h1>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="cursor-pointer rounded-xl border border-rose-500/60 bg-rose-950/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)] transition hover:bg-rose-900/70 hover:text-white"
            >
              Logout
            </button>
          </form>
        </div>

        <StudentsTable initialStudents={students} />
      </main>
    </div>
  );
}