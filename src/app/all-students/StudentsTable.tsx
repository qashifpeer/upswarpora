'use client';

import { useState, useMemo, useTransition } from 'react';
import {
  promoteStudent,
  retainStudent,
  updateStudentStatus,
  resetAllPromotions,
  deleteStudent,
  type StudentStatus,
  type PromotionActionState,
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

const CLASS_ORDER: Record<string, number> = {
  'Pre-Primary': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  Pool: 9,
};

const CLASS_FILTER_OPTIONS = [
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

const STATUS_FILTER_OPTIONS: { label: string; value: 'ALL' | StudentStatus }[] = [
  { label: 'All Statuses', value: 'ALL' },
  ...STATUS_OPTIONS,
];

function getNextClassPreview(currentClass: string): string {
  const normalized = currentClass.trim();
  if (normalized === 'Pre-Primary') return '1';
  if (normalized === '8') return 'Pool';
  if (normalized === 'Pool') return 'Pool';
  const num = parseInt(normalized, 10);
  if (!isNaN(num) && num >= 1 && num <= 7) return String(num + 1);
  return normalized;
}

function formatClassBadge(cls: string) {
  if (cls === 'Pre-Primary') return 'Pre-Primary';
  if (cls === 'Pool') return 'Pool (8th Passed)';
  return `Class ${cls}`;
}

export default function StudentsTable({
  initialStudents,
  currentSession = '2026',
}: {
  initialStudents: StudentRow[];
  currentSession?: string;
}) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | StudentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isResettingAll, setIsResettingAll] = useState(false);

  // Active Student Modal State
  const [activeStudent, setActiveStudent] = useState<StudentRow | null>(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState<string>('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [, startTransition] = useTransition();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3200);
  };

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return [...students]
      .filter((s) => {
        const matchesClass = selectedClass === 'ALL' || s.class === selectedClass;
        const currentStatus = s.status || 'active';
        const matchesStatus = selectedStatus === 'ALL' || currentStatus === selectedStatus;
        const matchesSearch =
          !q ||
          s.name?.toLowerCase().includes(q) ||
          s.pen?.toLowerCase().includes(q) ||
          s.father_name?.toLowerCase().includes(q);

        return matchesClass && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const orderA = CLASS_ORDER[a.class] ?? 99;
        const orderB = CLASS_ORDER[b.class] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || '').localeCompare(b.name || '');
      });
  }, [students, selectedClass, selectedStatus, searchQuery]);

  const handlePromote = (student: StudentRow) => {
    const nextClass = getNextClassPreview(student.class);
    setPendingId(student._id);

    startTransition(async () => {
      try {
        await promoteStudent(student._id, student.class);
        setStudents((prev) =>
          prev.map((item) =>
            item._id === student._id
              ? {
                  ...item,
                  prev_class: student.class,
                  class: nextClass,
                  promotionStatus: 'promoted',
                }
              : item
          )
        );
        showToast(
          'success',
          nextClass === 'Pool'
            ? `${student.name} moved to Pool (8th Passed)`
            : `${student.name} promoted to Class ${nextClass}`
        );
      } catch (err: any) {
        showToast('error', err?.message || 'Promotion failed. Please try again.');
      } finally {
        setPendingId(null);
      }
    });
  };

  const handleRetain = (student: StudentRow) => {
    setPendingId(student._id);

    startTransition(async () => {
      try {
        await retainStudent(student._id, student.class);
        setStudents((prev) =>
          prev.map((item) =>
            item._id === student._id
              ? { ...item, prev_class: student.class, promotionStatus: 'retained' }
              : item
          )
        );
        showToast('success', `${student.name} retained in ${formatClassBadge(student.class)}`);
      } catch (err: any) {
        showToast('error', err?.message || 'Retain action failed. Please try again.');
      } finally {
        setPendingId(null);
      }
    });
  };

  const handleStatusChange = (student: StudentRow, newStatus: StudentStatus) => {
    const previousStatus = student.status || 'active';
    if (previousStatus === newStatus) return;

    setPendingId(student._id);

    startTransition(async () => {
      try {
        await updateStudentStatus(student._id, newStatus);
        setStudents((prev) =>
          prev.map((item) =>
            item._id === student._id ? { ...item, status: newStatus } : item
          )
        );
        showToast('success', `${student.name} marked as ${newStatus}`);
      } catch (err: any) {
        showToast('error', err?.message || 'Status update failed.');
      } finally {
        setPendingId(null);
      }
    });
  };

  const handleStartPromotionReset = () => {
    setIsResettingAll(true);

    startTransition(async () => {
      try {
        const res = await resetAllPromotions();
        setStudents((prev) =>
          prev.map((item) => ({ ...item, promotionStatus: 'none' }))
        );
        showToast(
          'success',
          res.resetCount > 0
            ? `Unlocked ${res.resetCount} student(s) for new promotion session`
            : 'All students are already unlocked for promotion'
        );
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to unlock promotion buttons.');
      } finally {
        setIsResettingAll(false);
      }
    });
  };

  const openDeleteModal = (student: StudentRow) => {
    setDeleteTarget(student);
    setDeleteConfirmInput('');
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteConfirmInput('');
    setDeleteError(null);
  };

  const expectedDeletePhrase = deleteTarget
    ? `delete ${deleteTarget.name.trim().split(/\s+/)[0].toLowerCase()}`
    : '';

  const isDeleteConfirmed =
    Boolean(deleteTarget) &&
    deleteConfirmInput.trim().toLowerCase() === expectedDeletePhrase;

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteTarget || !isDeleteConfirmed) return;

    setIsDeleting(true);
    setDeleteError(null);

    startTransition(async () => {
      try {
        await deleteStudent(deleteTarget._id, deleteConfirmInput);
        const deletedName = deleteTarget.name;
        setStudents((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        if (activeStudent?._id === deleteTarget._id) {
          setActiveStudent(null);
        }
        setDeleteTarget(null);
        setDeleteConfirmInput('');
        showToast('success', `Deleted student record: ${deletedName}`);
      } catch (err: any) {
        setDeleteError(err?.message || 'Failed to delete student.');
      } finally {
        setIsDeleting(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Student Profile / Edit / Result / Bonafide Modal */}
      <StudentProfileModal
        student={activeStudent}
        currentSession={currentSession}
        onClose={() => setActiveStudent(null)}
        onStudentUpdated={(updatedStudent) => {
          setStudents((prev) =>
            prev.map((item) => (item._id === updatedStudent._id ? updatedStudent : item))
          );
          setActiveStudent(updatedStudent);
          showToast('success', `Updated profile for ${updatedStudent.name}`);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
        >
          <div className="w-full max-w-md rounded-2xl border border-rose-500/60 bg-slate-900 p-6 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/50 bg-rose-950/70 text-rose-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
              <div>
                <h2 id="delete-modal-title" className="text-lg font-extrabold text-slate-100">
                  Delete Student Record
                </h2>
                <p className="font-mono text-xs text-rose-300">PEN: {deleteTarget.pen}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmDelete} className="mt-5 space-y-4">
              <p className="text-sm leading-relaxed text-slate-300">
                This will permanently remove{' '}
                <strong className="text-slate-100">{deleteTarget.name}</strong> from Sanity{' '}
                <code className="text-cyan-300">masterData</code>. To confirm, type{' '}
                <span className="rounded border border-rose-500/40 bg-rose-950/60 px-2 py-0.5 font-mono text-xs font-bold text-rose-200">
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

              {deleteError && (
                <p className="rounded-lg border border-rose-500/50 bg-rose-950/60 px-3 py-2 text-xs text-rose-200">
                  {deleteError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={closeDeleteModal}
                  className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isDeleteConfirmed || isDeleting}
                  className="cursor-pointer rounded-xl border border-rose-500/80 bg-rose-950/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.35)] transition hover:bg-rose-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
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
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold backdrop-blur-md transition-all ${
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

      {/* Control Bar: Search + Class & Status Filters + Start Promotion + Counter */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-md xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, PEN, father..."
              className="w-full rounded-xl border border-cyan-500/40 bg-slate-950 py-2 pl-9 pr-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
            />
            <svg
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-cyan-400/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="class-filter"
              className="text-xs font-bold uppercase tracking-wider text-cyan-400"
            >
              Class:
            </label>
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="min-w-[155px] cursor-pointer rounded-xl border border-cyan-500/40 bg-slate-950 px-3.5 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.15)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
            >
              {CLASS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-cyan-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-xs font-bold uppercase tracking-wider text-fuchsia-400"
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | StudentStatus)}
              className="min-w-[165px] cursor-pointer rounded-xl border border-fuchsia-500/40 bg-slate-950 px-3.5 py-2 text-sm font-medium text-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.15)] outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/50"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-fuchsia-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(selectedClass !== 'ALL' || selectedStatus !== 'ALL' || searchQuery !== '') && (
            <button
              type="button"
              onClick={() => {
                setSelectedClass('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Start Promotion Session Reset Button */}
          <button
            type="button"
            disabled={isResettingAll}
            onClick={handleStartPromotionReset}
            title="Unlock all Promoted / Retained buttons for a new academic session"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-400/80 bg-amber-950/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.3)] transition hover:bg-amber-900/80 hover:text-white hover:shadow-[0_0_25px_rgba(251,191,36,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResettingAll ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-300" />
            ) : (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            )}
            <span>Start Promotion</span>
          </button>

          {/* Student Counter */}
          <div className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-slate-950/90 px-4 py-2 text-xs font-semibold text-slate-300 shadow-[0_0_15px_rgba(34,211,238,0.12)]">
            <span>Showing</span>
            <span className="font-mono text-sm font-bold text-cyan-400">
              {filteredStudents.length}
            </span>
            <span>of</span>
            <span className="font-mono text-sm font-bold text-slate-200">{students.length}</span>
          </div>
        </div>
      </div>

      {/* Cyberpunk Neon Table */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-900/75 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md">
        <table className="min-w-full divide-y divide-cyan-500/20 text-left text-sm">
          <thead className="bg-slate-950/90 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <tr>
              <th className="w-16 px-5 py-4">S.No</th>
              <th className="px-5 py-4">PEN</th>
              <th className="px-5 py-4">Student Name</th>
              <th className="px-5 py-4">Class</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  No students match the selected filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const isLoading = pendingId === student._id;
                const isInPool = student.class === 'Pool';
                const currentStatus = student.status || 'active';
                const isInactive = currentStatus !== 'active';
                const promoState = student.promotionStatus || 'none';
                const isPromoted = promoState === 'promoted';
                const isRetained = promoState === 'retained';
                const isLockedByAction = isPromoted || isRetained;

                return (
                  <tr
                    key={student._id}
                    className={`transition-colors duration-150 ${
                      isInactive
                        ? 'bg-slate-950/50 opacity-75 hover:bg-rose-500/[0.04]'
                        : 'hover:bg-cyan-500/[0.06]'
                    }`}
                  >
                    {/* S.No */}
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Clickable PEN -> Opens Profile Modal */}
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setActiveStudent(student)}
                        title="Click to view profile, result, or bonafide"
                        className="cursor-pointer text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 transition hover:text-cyan-200 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]"
                      >
                        {student.pen}
                      </button>
                    </td>

                    {/* Clickable Student Name -> Opens Profile Modal */}
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold">
                      <button
                        type="button"
                        onClick={() => setActiveStudent(student)}
                        title="Click to view profile, result, or bonafide"
                        className="cursor-pointer text-left text-slate-100 underline decoration-slate-600 underline-offset-4 transition hover:text-cyan-300 hover:decoration-cyan-400"
                      >
                        {student.name}
                      </button>
                    </td>

                    {/* Current Class */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                          isInPool
                            ? 'border-emerald-400/50 bg-emerald-950/60 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                            : 'border-fuchsia-500/35 bg-fuchsia-950/40 text-fuchsia-300'
                        }`}
                      >
                        {formatClassBadge(student.class)}
                      </span>
                    </td>

                    {/* Status Selector */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <select
                        aria-label={`Enrollment status for ${student.name}`}
                        disabled={isLoading}
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(student, e.target.value as StudentStatus)
                        }
                        className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-bold tracking-wide outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          currentStatus === 'active'
                            ? 'border-emerald-400/60 bg-emerald-950/50 text-emerald-300 focus:border-emerald-300'
                            : 'border-rose-500/60 bg-rose-950/50 text-rose-300 focus:border-rose-400'
                        }`}
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
                    </td>

                    {/* Actions: Promote + Retain + Delete */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={isLoading || isInPool || isInactive || isLockedByAction}
                          onClick={() => handlePromote(student)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                            isPromoted
                              ? 'cursor-not-allowed border-emerald-400/80 bg-emerald-950/80 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.4)]'
                              : isInPool || isInactive || isRetained
                              ? 'cursor-not-allowed border-slate-700 bg-slate-900 text-slate-600'
                              : 'cursor-pointer border-cyan-400/75 bg-cyan-950/60 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.28)] hover:bg-cyan-900/80 hover:text-white hover:shadow-[0_0_22px_rgba(34,211,238,0.65)] disabled:opacity-50'
                          }`}
                        >
                          {isLoading && (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300" />
                          )}
                          <span>
                            {isPromoted ? 'Promoted' : isInPool ? 'In Pool' : 'Promote'}
                          </span>
                        </button>

                        <button
                          type="button"
                          disabled={isLoading || isInactive || isLockedByAction}
                          onClick={() => handleRetain(student)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                            isRetained
                              ? 'cursor-not-allowed border-amber-400/80 bg-amber-950/80 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.4)]'
                              : isInactive || isPromoted
                              ? 'cursor-not-allowed border-slate-700 bg-slate-900 text-slate-600'
                              : 'cursor-pointer border-fuchsia-400/75 bg-fuchsia-950/60 text-fuchsia-200 shadow-[0_0_14px_rgba(217,70,239,0.28)] hover:bg-fuchsia-900/80 hover:text-white hover:shadow-[0_0_22px_rgba(217,70,239,0.65)] disabled:opacity-50'
                          }`}
                        >
                          {isRetained ? 'Retained' : 'Retain'}
                        </button>

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => openDeleteModal(student)}
                          title={`Delete ${student.name}`}
                          aria-label={`Delete ${student.name}`}
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-500/60 bg-rose-950/50 p-1.5 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.22)] transition hover:border-rose-400 hover:bg-rose-900/80 hover:text-white hover:shadow-[0_0_18px_rgba(244,63,94,0.55)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
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