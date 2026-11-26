'use client';

import { useState, useMemo } from 'react';
import StaffProfileModal, { getFullUpperName } from './StaffProfileModal';

export interface StaffRow {
  _id: string;
  teacherCode?: string;
  firstName: string;
  lastName?: string;
  surname?: string;
  staffCategory?: string;
  designation?: string;
  natureOfEmployment?: string;
  onDeployment?: boolean;
  originalPlaceOfPosting?: string;
  dob?: string;
  dateOfAppointment?: string;
  dateOfJoiningSchool?: string;
  panNumber?: string;
  phone?: string;
  email?: string;
  remarks?: string;
}

function formatDisplayDate(isoDate?: string) {
  if (!isoDate) return 'N/A';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export default function StaffTable({ initialStaff }: { initialStaff: StaffRow[] }) {
  const [staffList, setStaffList] = useState<StaffRow[]>(initialStaff);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activeStaff, setActiveStaff] = useState<StaffRow | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3000);
  };

  const filteredStaff = useMemo(() => {
    if (categoryFilter === 'ALL') return staffList;
    return staffList.filter((s) => s.staffCategory === categoryFilter);
  }, [staffList, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Staff Profile / Edit / Delete Modal */}
      <StaffProfileModal
        staff={activeStaff}
        onClose={() => setActiveStaff(null)}
        onStaffUpdated={(updated) => {
          setStaffList((prev) =>
            prev.map((item) => (item._id === updated._id ? updated : item))
          );
          setActiveStaff(updated);
          showToast('success', `Updated ${getFullUpperName(updated)}`);
        }}
        onStaffDeleted={(deletedId, deletedName) => {
          setStaffList((prev) => prev.filter((item) => item._id !== deletedId));
          setActiveStaff(null);
          showToast('success', `Deleted staff record: ${deletedName}`);
        }}
      />

      {/* Neon Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold backdrop-blur-md ${
            toast.type === 'success'
              ? 'border-cyan-400/80 bg-slate-950/95 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.55)]'
              : 'border-rose-500/80 bg-slate-950/95 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.55)]'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              toast.type === 'success' ? 'bg-cyan-400' : 'bg-rose-400'
            }`}
          />
          {toast.message}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="staff-cat-filter"
            className="text-xs font-bold uppercase tracking-wider text-cyan-400"
          >
            Category:
          </label>
          <select
            id="staff-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-w-[180px] cursor-pointer rounded-xl border border-cyan-500/40 bg-slate-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-100 outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Staff</option>
            <option value="Teaching">Teaching</option>
            <option value="Non-Teaching">Non-Teaching</option>
          </select>
        </div>

        <div className="rounded-xl border border-cyan-400/30 bg-slate-950/90 px-4 py-2 text-xs font-semibold text-slate-300">
          Total Staff:{' '}
          <span className="font-mono text-sm font-bold text-cyan-400">
            {filteredStaff.length}
          </span>
        </div>
      </div>

      {/* ALLCAPS Staff Table */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-900/75 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md">
        <table className="min-w-full divide-y divide-cyan-500/20 text-left text-sm">
          <thead className="bg-slate-950/90 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <tr>
              <th className="w-20 px-6 py-4">S.No</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Date of Birth</th>
              <th className="px-6 py-4">Designation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No staff members found.
                </td>
              </tr>
            ) : (
              filteredStaff.map((member, index) => {
                const upperFullName = getFullUpperName(member);
                const upperDesignation = (member.designation || 'N/A').toUpperCase();

                return (
                  <tr
                    key={member._id}
                    className="transition-colors duration-150 hover:bg-cyan-500/[0.06]"
                  >
                    <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Clickable Full Name in ALLCAPS */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => setActiveStaff(member)}
                        title="Click to view, edit, or delete staff record"
                        className="cursor-pointer text-left font-bold uppercase tracking-wide text-slate-100 underline decoration-cyan-500/40 underline-offset-4 transition hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.75)]"
                      >
                        {upperFullName}
                      </button>
                    </td>

                    {/* Date of Birth */}
                    <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs font-semibold text-slate-300">
                      {formatDisplayDate(member.dob)}
                    </td>

                    {/* Designation in ALLCAPS */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <span className="rounded-md border border-fuchsia-500/35 bg-fuchsia-950/45 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-fuchsia-300">
                        {upperDesignation}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}