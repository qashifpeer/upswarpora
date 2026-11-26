'use client';

import { useState, useMemo, useTransition } from 'react';
import {
  deleteStudent,
  promoteStudent,
  retainStudent,
  resetAllPromotions,
  updateStudentStatus,
  type PromotionActionState,
  type StudentStatus,
} from './actions';
import StudentProfileModal from './StudentProfileModal';

export interface StudentRow {
  _id: string;
  pen: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  dob?: string;
  class: string;
  gender?: string;
  aadhaar?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  adress?: string;
  phone?: string;
  bpl?: boolean;
  aay?: boolean;
  admission_number?: string;
  admission_date?: string;
  prev_class?: string;
  status?: StudentStatus;
  promotionStatus?: PromotionActionState;
  remarks?: string;
}

const CLASS_OPTIONS = [
  { label: 'All Classes', value: 'ALL' },
  { label: 'Pre-Primary', value: 'Pre-Primary' },
  { label: 'Class 1', value: '1' },
  { label: 'Class 2', value: '2' },
  { label: 'Class 3', value: '3' },
  { label: 'Class 4', value: '4' },
  { label: 'Class 5', value: '5' },
  { label: 'Class 6', value: '6' },
  { label: 'Class 7', value: '7' },
  { label: 'Class 8', value: '8' },
  { label: 'Pool (8th Passed)', value: 'Pool' },
];

const STATUS_OPTIONS: { label: string; value: StudentStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Struck Off', value: 'struck off' },
  { label: 'Left with DC', value: 'left with DC' },
  { label: 'Left without DC', value: 'left without DC' },
];

function getNeonStatusStyle(status: StudentStatus) {
  switch (status) {
    case 'active':
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-400/70 shadow-[0_0_12px_rgba(52,211,153,0.28)] focus:ring-emerald-400';
    case 'struck off':
      return 'bg-rose-950/70 text-rose-300 border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.28)] focus:ring-rose-500';
    case 'left with DC':
      return 'bg-amber-950/70 text-amber-300 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.28)] focus:ring-amber-400';
    case 'left without DC':
      return 'bg-fuchsia-950/70 text-fuchsia-300 border-fuchsia-500/70 shadow-[0_0_12px_rgba(217,70,239,0.28)] focus:ring-fuchsia-500';
  }
}

function formatClassBadge(cls: string) {
  if (cls === 'Pre-Primary') return 'Pre-Primary';
  if (cls === 'Pool') return 'Pool';
  return `Class ${cls}`;
}

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || '';
}

export default function StudentsTable({ initialStudents }: { initialStudents: StudentRow[] }) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeStudent, setActiveStudent] = useState<StudentRow | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isResettingPromotions, setIsResettingPromotions] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [studentToDelete, setStudentToDelete] = useState<StudentRow | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3000);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const currentStatus = student.status || 'active';
      const matchesClass = selectedClass === 'ALL' || student.class === selectedClass;
      const matchesStatus = selectedStatus === 'ALL' || currentStatus === selectedStatus;
      return matchesClass && matchesStatus;
    });
  }, [students, selectedClass, selectedStatus]);

  const handleStatusChange = (studentId: string, newStatus: StudentStatus) => {
    const previousStudents = [...students];

    setStudents((prev) =>
      prev.map((s) => (s._id === studentId ? { ...s, status: newStatus } : s))
    );
    setUpdatingId(studentId);
    setToast(null);

    startTransition(async () => {
      try {
        await updateStudentStatus(studentId, newStatus);
        showToast('success', `Status updated → ${newStatus.toUpperCase()}`);
      } catch {
        setStudents(previousStudents);
        showToast('error', 'Sync failed. Reverted status.');
      } finally {
        setUpdatingId(null);
      }
    });
  };

  const handlePromoteStudent = (student: StudentRow) => {
    const state = student.promotionStatus || 'none';
    if (state !== 'none' || student.class === 'Pool') return;

    setActionLoadingId(student._id);
    setToast(null);

    startTransition(async () => {
      try {
        const res = await promoteStudent(student._id, student.class);

        setStudents((prev) =>
          prev.map((s) =>
            s._id === student._id
              ? {
                  ...s,
                  class: res.class,
                  prev_class: res.prev_class,
                  promotionStatus: 'promoted',
                }
              : s
          )
        );

        const targetLabel =
          res.class === 'Pool' ? 'Pool (8th Passed)' : `Class ${res.class}`;
        showToast('success', `${student.name} promoted → ${targetLabel}`);
      } catch (err: any) {
        showToast('error', err?.message || 'Promotion failed.');
      } finally {
        setActionLoadingId(null);
      }
    });
  };

  const handleRetainStudent = (student: StudentRow) => {
    const state = student.promotionStatus || 'none';
    if (state !== 'none' || student.class === 'Pool') return;

    setActionLoadingId(student._id);
    setToast(null);

    startTransition(async () => {
      try {
        const res = await retainStudent(student._id, student.class);

        setStudents((prev) =>
          prev.map((s) =>
            s._id === student._id
              ? {
                  ...s,
                  class: res.class,
                  prev_class: res.prev_class,
                  promotionStatus: 'retained',
                }
              : s
          )
        );

        showToast(
          'success',
          `${student.name} retained in ${formatClassBadge(res.class)}`
        );
      } catch (err: any) {
        showToast('error', err?.message || 'Retain action failed.');
      } finally {
        setActionLoadingId(null);
      }
    });
  };

  const handleStartPromotion = () => {
    setIsResettingPromotions(true);
    setToast(null);

    startTransition(async () => {
      try {
        const res = await resetAllPromotions();
        setStudents((prev) => prev.map((s) => ({ ...s, promotionStatus: 'none' })));
        showToast(
          'success',
          res.resetCount > 0
            ? `Unfroze ${res.resetCount} student(s) — Promote & Retain unlocked.`
            : 'All Promote & Retain options are unlocked and ready.'
        );
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to reset promotion flags.');
      } finally {
        setIsResettingPromotions(false);
      }
    });
  };

  const openDeletePrompt = (student: StudentRow) => {
    setStudentToDelete(student);
    setDeleteConfirmInput('');
  };

  const closeDeletePrompt = () => {
    if (isDeleting) return;
    setStudentToDelete(null);
    setDeleteConfirmInput('');
  };

  const expectedDeletePhrase = studentToDelete
    ? `delete ${getFirstName(studentToDelete.name).toLowerCase()}`
    : '';

  const isDeleteMatch =
    Boolean(studentToDelete) &&
    deleteConfirmInput.trim().toLowerCase() === expectedDeletePhrase;

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToDelete || !isDeleteMatch) return;

    const target = studentToDelete;
    setIsDeleting(true);
    setToast(null);

    startTransition(async () => {
      try {
        await deleteStudent(target._id, deleteConfirmInput);
        setStudents((prev) => prev.filter((s) => s._id !== target._id));
        if (activeStudent?._id === target._id) {
          setActiveStudent(null);
        }
        setStudentToDelete(null);
        setDeleteConfirmInput('');
        showToast('success', `Deleted student "${target.name}" (PEN: ${target.pen})`);
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to delete student.');
      } finally {
        setIsDeleting(false);
      }
    });
  };

  const frozenCount = useMemo(
    () =>
      students.filter(
        (s) => s.promotionStatus === 'promoted' || s.promotionStatus === 'retained'
      ).length,
    [students]
  );

  return (
    <div className="space-y-6">
      {/* Profile Modal */}
      <StudentProfileModal
        student={activeStudent}
        onClose={() => setActiveStudent(null)}
        onStudentUpdated={(updatedStudent) => {
          setStudents((prev) =>
            prev.map((s) => (s._id === updatedStudent._id ? updatedStudent : s))
          );
          setActiveStudent(updatedStudent);
          showToast('success', `Updated details for ${updatedStudent.name}`);
        }}
      />

      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-student-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
        >
          <div className="w-full max-w-md rounded-2xl border border-rose-500/60 bg-slate-900 p-6 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="inline-block rounded-full border border-rose-500/50 bg-rose-950/70 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-rose-300">
                  Permanent Deletion
                </span>
                <h2
                  id="delete-student-title"
                  className="mt-1.5 text-lg font-extrabold text-slate-100"
                >
                  Delete {studentToDelete.name}?
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDeletePrompt}
                disabled={isDeleting}
                aria-label="Close delete confirmation"
                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleConfirmDelete} className="mt-4 space-y-4">
              <p className="text-xs leading-relaxed text-slate-300">
                This will permanently remove{' '}
                <strong className="text-slate-100">{studentToDelete.name}</strong> (PEN:{' '}
                <span className="font-mono text-cyan-300">{studentToDelete.pen}</span>) from{' '}
                <code className="text-fuchsia-300">masterData</code>. To confirm, type{' '}
                <span className="rounded border border-rose-500/50 bg-rose-950/70 px-2 py-0.5 font-mono font-bold text-rose-200">
                  {expectedDeletePhrase}
                </span>{' '}
                below:
              </p>

              <input
                type="text"
                autoFocus
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={expectedDeletePhrase}
                className="w-full rounded-xl border border-rose-500/50 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDeletePrompt}
                  disabled={isDeleting}
                  className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isDeleteMatch || isDeleting}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-rose-500/80 bg-rose-950/80 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.35)] transition hover:bg-rose-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-400/30 border-t-rose-200" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Neon Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold backdrop-blur-md transition-all ${
            toast.type === 'success'
              ? 'border-cyan-400/80 bg-slate-950/95 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.55)]'
              : 'border-rose-500/80 bg-slate-950/95 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.55)]'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]'
                : 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,1)]'
            }`}
          />
          {toast.message}
        </div>
      )}

      {/* Top Filter & Promotion Control Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-md lg:flex-row lg:items-end">
        <div className="flex flex-wrap items-center gap-4">
          {/* Class Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="class-filter"
              className="text-xs font-bold uppercase tracking-wider text-cyan-400"
            >
              Filter by Class
            </label>
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="min-w-[170px] cursor-pointer rounded-xl border border-cyan-500/40 bg-slate-950 px-3.5 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.15)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
            >
              {CLASS_OPTIONS.map((cls) => (
                <option key={cls.value} value={cls.value} className="bg-slate-950 text-cyan-100">
                  {cls.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-filter"
              className="text-xs font-bold uppercase tracking-wider text-fuchsia-400"
            >
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="min-w-[190px] cursor-pointer rounded-xl border border-fuchsia-500/40 bg-slate-950 px-3.5 py-2 text-sm font-medium text-fuchsia-100 shadow-[0_0_12px_rgba(217,70,239,0.15)] outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/50"
            >
              <option value="ALL" className="bg-slate-950 text-fuchsia-100">
                All Statuses
              </option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-fuchsia-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(selectedClass !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSelectedClass('ALL');
                setSelectedStatus('ALL');
              }}
              className="mt-5 cursor-pointer rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Right Side: Start Promotion Button + Count Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isResettingPromotions}
            onClick={handleStartPromotion}
            title="Unfreeze all Promoted / Retained rows"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-400/75 bg-amber-950/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.28)] transition hover:bg-amber-900/80 hover:text-white hover:shadow-[0_0_24px_rgba(251,191,36,0.5)] disabled:cursor-wait disabled:opacity-60"
          >
            {isResettingPromotions ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-300" />
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            )}
            <span>
              Start Promotion{frozenCount > 0 ? ` (${frozenCount} Frozen)` : ''}
            </span>
          </button>

          <div className="rounded-xl border border-cyan-400/30 bg-slate-950/90 px-4 py-2 text-xs font-semibold text-slate-300 shadow-[0_0_15px_rgba(34,211,238,0.12)]">
            Showing{' '}
            <span className="font-mono text-sm font-bold text-cyan-400">
              {filteredStudents.length}
            </span>{' '}
            of <span className="font-mono text-slate-200">{students.length}</span>
          </div>
        </div>
      </div>

      {/* Neon Table */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-900/75 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md">
        <table className="min-w-full divide-y divide-cyan-500/20 text-left text-sm">
          <thead className="bg-slate-950/90 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <tr>
              <th className="w-20 px-6 py-4">S.No</th>
              <th className="px-6 py-4">PEN</th>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Class</th>
              <th className="w-56 px-6 py-4">Promote / Retain</th>
              <th className="w-60 px-6 py-4">Status</th>
              <th className="w-20 px-4 py-4 text-center">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  No students match the selected Class and Status filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const currentStatus: StudentStatus = student.status || 'active';
                const promotionState: PromotionActionState =
                  student.promotionStatus || 'none';
                const isRowUpdating = updatingId === student._id && isPending;
                const isRowActionLoading = actionLoadingId === student._id && isPending;
                const isInPool = student.class === 'Pool';

                return (
                  <tr
                    key={student._id}
                    className="transition-colors duration-150 hover:bg-cyan-500/[0.06]"
                  >
                    <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Clickable PEN */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => setActiveStudent(student)}
                        title="Open Student Profile"
                        className="cursor-pointer font-mono font-semibold text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 transition hover:text-cyan-200 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]"
                      >
                        {student.pen}
                      </button>
                    </td>

                    {/* Clickable Student Name */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => setActiveStudent(student)}
                        title="Open Student Profile"
                        className="cursor-pointer text-left font-semibold text-slate-100 transition hover:text-fuchsia-300 hover:underline hover:decoration-fuchsia-400/60 hover:underline-offset-4"
                      >
                        {student.name}
                      </button>
                    </td>

                    {/* Class Badge */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <span
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                          isInPool
                            ? 'border-amber-400/50 bg-amber-950/50 text-amber-300'
                            : 'border-fuchsia-500/30 bg-fuchsia-950/40 text-fuchsia-300'
                        }`}
                      >
                        {formatClassBadge(student.class)}
                      </span>
                    </td>

                    {/* Promote / Retain / Frozen State Column */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      {promotionState === 'promoted' ? (
                        <button
                          type="button"
                          disabled
                          title="Frozen as Promoted until Start Promotion is clicked"
                          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-emerald-400/70 bg-emerald-950/70 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-300 opacity-90 shadow-[0_0_12px_rgba(52,211,153,0.28)]"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Promoted</span>
                        </button>
                      ) : promotionState === 'retained' ? (
                        <button
                          type="button"
                          disabled
                          title="Frozen as Retained until Start Promotion is clicked"
                          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-amber-400/70 bg-amber-950/70 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300 opacity-90 shadow-[0_0_12px_rgba(251,191,36,0.28)]"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                          <span>Retained</span>
                        </button>
                      ) : isInPool ? (
                        <span className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                          In Pool
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isRowActionLoading}
                            onClick={() => handlePromoteStudent(student)}
                            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-cyan-400/70 bg-cyan-950/60 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.22)] transition hover:bg-cyan-900/80 hover:text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.45)] disabled:cursor-wait disabled:opacity-60"
                          >
                            {isRowActionLoading ? '...' : 'Promote'}
                          </button>
                          <button
                            type="button"
                            disabled={isRowActionLoading}
                            onClick={() => handleRetainStudent(student)}
                            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-amber-400/70 bg-amber-950/60 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.22)] transition hover:bg-amber-900/80 hover:text-white hover:shadow-[0_0_18px_rgba(251,191,36,0.45)] disabled:cursor-wait disabled:opacity-60"
                          >
                            {isRowActionLoading ? '...' : 'Retain'}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <select
                          aria-label={`Status for ${student.name}`}
                          value={currentStatus}
                          disabled={isRowUpdating}
                          onChange={(e) =>
                            handleStatusChange(student._id, e.target.value as StudentStatus)
                          }
                          className={`w-full cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wide outline-none transition focus:ring-2 disabled:cursor-wait disabled:opacity-60 ${getNeonStatusStyle(
                            currentStatus
                          )}`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-slate-950 text-slate-100"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {isRowUpdating && (
                          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        )}
                      </div>
                    </td>

                    {/* Delete Icon Button */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => openDeletePrompt(student)}
                        title={`Delete ${student.name}`}
                        aria-label={`Delete ${student.name}`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-rose-500/40 bg-rose-950/40 p-2 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.18)] transition hover:border-rose-400 hover:bg-rose-900/70 hover:text-white hover:shadow-[0_0_16px_rgba(244,63,94,0.45)]"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
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