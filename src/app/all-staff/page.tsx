import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { sanityClient } from '@/lib/sanity';
import StaffTable, { type StaffRow } from './StaffTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllStaff(): Promise<StaffRow[]> {
  const query = `*[_type == "staffMasterData"] | order(staffCategory asc, designation asc, firstName asc) {
    _id,
    teacherCode,
    firstName,
    lastName,
    surname,
    staffCategory,
    designation,
    natureOfEmployment,
    "onDeployment": coalesce(onDeployment, false),
    originalPlaceOfPosting,
    dob,
    dateOfAppointment,
    dateOfJoiningSchool,
    panNumber,
    phone,
    email,
    remarks
  }`;

  return sanityClient.fetch<StaffRow[]>(query, {}, { cache: 'no-store' });
}

export default async function AllStaffPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/login?callbackUrl=/all-staff');
  }

  const staff = await getAllStaff();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-block rounded-full border border-cyan-400/40 bg-cyan-950/50 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            Staff Directory • Click Name to Edit or Delete
          </span>
          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            GMS Warpora — All Staff
          </h1>
        </div>

        <StaffTable initialStaff={staff} />
      </main>
    </div>
  );
}