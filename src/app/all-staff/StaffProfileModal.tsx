'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  updateStaffDetails,
  deleteStaffMember,
  type StaffUpdatePayload,
} from './actions';
import type { StaffRow } from './StaffTable';

interface StaffProfileModalProps {
  staff: StaffRow | null;
  onClose: () => void;
  onStaffUpdated: (updatedStaff: StaffRow) => void;
  onStaffDeleted: (deletedId: string, deletedName: string) => void;
}

const DESIGNATION_OPTIONS: StaffUpdatePayload['designation'][] = [
  'Teacher',
  'Head Teacher',
  'Aaya',
  'Cook',
  'Sweeper',
];

function formatDisplayDate(isoDate?: string) {
  if (!isoDate) return 'N/A';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function getFullUpperName(staff: {
  firstName?: string;
  lastName?: string;
  surname?: string;
}) {
  return [staff.firstName, staff.lastName, staff.surname]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();
}

export default function StaffProfileModal({
  staff,
  onClose,
  onStaffUpdated,
  onStaffDeleted,
}: StaffProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formState, setFormState] = useState<StaffUpdatePayload>({
    teacherCode: '',
    firstName: '',
    lastName: '',
    surname: '',
    staffCategory: 'Teaching',
    designation: 'Teacher',
    natureOfEmployment: 'Permanent',
    onDeployment: false,
    originalPlaceOfPosting: '',
    dob: '',
    dateOfAppointment: '',
    dateOfJoiningSchool: '',
    panNumber: '',
    phone: '',
    email: '',
    remarks: '',
  });

  useEffect(() => {
    if (!staff) return;
    setIsEditing(false);
    setShowDeletePrompt(false);
    setDeleteConfirmInput('');
    setErrorMsg(null);

    setFormState({
      teacherCode: staff.teacherCode || '',
      firstName: staff.firstName || '',
      lastName: staff.lastName || '',
      surname: staff.surname || '',
      staffCategory: (staff.staffCategory as StaffUpdatePayload['staffCategory']) || 'Teaching',
      designation: (staff.designation as StaffUpdatePayload['designation']) || 'Teacher',
      natureOfEmployment:
        (staff.natureOfEmployment as StaffUpdatePayload['natureOfEmployment']) || 'Permanent',
      onDeployment: Boolean(staff.onDeployment),
      originalPlaceOfPosting: staff.originalPlaceOfPosting || '',
      dob: staff.dob || '',
      dateOfAppointment: staff.dateOfAppointment || '',
      dateOfJoiningSchool: staff.dateOfJoiningSchool || '',
      panNumber: staff.panNumber || '',
      phone: staff.phone || '',
      email: staff.email || '',
      remarks: staff.remarks || '',
    });
  }, [staff]);

  if (!staff) return null;

  const fullUpperName = getFullUpperName(staff);
  const firstToken = (staff.firstName || '').trim().split(/\s+/)[0].toLowerCase();
  const expectedDeletePhrase = `delete ${firstToken}`;
  const isDeleteMatch = deleteConfirmInput.trim().toLowerCase() === expectedDeletePhrase;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      try {
        const res = await updateStaffDetails(staff._id, formState);
        onStaffUpdated({
          ...staff,
          ...res.updated,
        });
        setIsEditing(false);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to update staff record.');
      }
    });
  };

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeleteMatch) return;
    setErrorMsg(null);

    startTransition(async () => {
      try {
        await deleteStaffMember(staff._id, deleteConfirmInput);
        onStaffDeleted(staff._id, fullUpperName);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to delete staff member.');
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-cyan-500/40 bg-slate-900 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-6 py-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-cyan-400">
              {staff.teacherCode ? `CODE: ${staff.teacherCode} • ` : ''}
              {(staff.designation || 'STAFF').toUpperCase()}
            </span>
            <h2 className="text-xl font-extrabold uppercase text-slate-100">
              {fullUpperName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && !showDeletePrompt && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setIsEditing(true);
                  }}
                  className="cursor-pointer rounded-xl border border-cyan-400/75 bg-cyan-950/65 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)] transition hover:bg-cyan-900/85 hover:text-white"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setDeleteConfirmInput('');
                    setShowDeletePrompt(true);
                  }}
                  className="cursor-pointer rounded-xl border border-rose-500/75 bg-rose-950/65 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)] transition hover:bg-rose-900/85 hover:text-white"
                >
                  Delete
                </button>
              </>
            )}

            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              aria-label="Close staff modal"
              className="ml-1 cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-500/70 bg-rose-950/60 p-3 text-xs font-semibold text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* DELETE CONFIRMATION PROMPT ("delete <firstname>") */}
          {showDeletePrompt && (
            <div className="mb-6 rounded-2xl border-2 border-rose-500/75 bg-rose-950/35 p-5 shadow-[0_0_30px_rgba(244,63,94,0.22)]">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-300">
                Confirm Staff Deletion
              </h3>
              <form onSubmit={handleConfirmDelete} className="mt-3 space-y-4">
                <p className="text-xs leading-relaxed text-slate-200">
                  This will permanently delete{' '}
                  <strong className="uppercase text-white">{fullUpperName}</strong> from{' '}
                  <code className="text-fuchsia-300">staffMasterData</code>. To confirm, type{' '}
                  <span className="rounded border border-rose-500/50 bg-rose-950/80 px-2 py-0.5 font-mono font-bold text-rose-200">
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
                  className="w-full rounded-xl border border-rose-500/60 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40"
                />

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setShowDeletePrompt(false);
                      setDeleteConfirmInput('');
                      setErrorMsg(null);
                    }}
                    className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!isDeleteMatch || isPending}
                    className="cursor-pointer rounded-xl border border-rose-500/80 bg-rose-950/85 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.35)] transition hover:bg-rose-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isPending ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT FORM */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Teacher Code
                  </label>
                  <input
                    type="text"
                    value={formState.teacherCode}
                    onChange={(e) =>
                      setFormState({ ...formState, teacherCode: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.firstName}
                    onChange={(e) =>
                      setFormState({ ...formState, firstName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formState.lastName}
                    onChange={(e) =>
                      setFormState({ ...formState, lastName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Surname
                  </label>
                  <input
                    type="text"
                    value={formState.surname}
                    onChange={(e) =>
                      setFormState({ ...formState, surname: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Teaching / Non-Teaching
                  </label>
                  <select
                    value={formState.staffCategory}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        staffCategory: e.target.value as StaffUpdatePayload['staffCategory'],
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-400"
                  >
                    <option value="Teaching">Teaching</option>
                    <option value="Non-Teaching">Non-Teaching</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Designation
                  </label>
                  <select
                    value={formState.designation}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        designation: e.target.value as StaffUpdatePayload['designation'],
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-400"
                  >
                    {DESIGNATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Nature of Employment
                  </label>
                  <select
                    value={formState.natureOfEmployment}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        natureOfEmployment: e.target
                          .value as StaffUpdatePayload['natureOfEmployment'],
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-400"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/75 px-3.5 py-2">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold uppercase text-amber-200">
                    <input
                      type="checkbox"
                      checked={formState.onDeployment}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          onDeployment: e.target.checked,
                          originalPlaceOfPosting: e.target.checked
                            ? formState.originalPlaceOfPosting
                            : '',
                        })
                      }
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                    />
                    <span>On Deployment</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Original Place of Posting {formState.onDeployment ? '*' : '(Inactive)'}
                  </label>
                  <input
                    type="text"
                    disabled={!formState.onDeployment}
                    required={formState.onDeployment}
                    value={formState.originalPlaceOfPosting}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        originalPlaceOfPosting: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formState.dob}
                    onChange={(e) => setFormState({ ...formState, dob: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Date of Appointment
                  </label>
                  <input
                    type="date"
                    value={formState.dateOfAppointment}
                    onChange={(e) =>
                      setFormState({ ...formState, dateOfAppointment: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Date of Joining School
                  </label>
                  <input
                    type="date"
                    value={formState.dateOfJoiningSchool}
                    onChange={(e) =>
                      setFormState({ ...formState, dateOfJoiningSchool: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formState.panNumber}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        panNumber: e.target.value
                          .replace(/[^a-zA-Z0-9]/g, '')
                          .toUpperCase(),
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm uppercase text-slate-100 outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        phone: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={formState.remarks}
                    onChange={(e) =>
                      setFormState({ ...formState, remarks: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer rounded-xl border border-cyan-400/80 bg-cyan-950/80 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:bg-cyan-900 disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* READ-ONLY DETAILS VIEW */
            <div className="grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Full Name
                </span>
                <span className="mt-1 block text-sm font-bold uppercase text-slate-100">
                  {fullUpperName}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Teacher Code
                </span>
                <span className="mt-1 block font-mono text-sm text-cyan-300">
                  {staff.teacherCode || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Designation
                </span>
                <span className="mt-1 block text-sm font-bold uppercase text-fuchsia-300">
                  {staff.designation || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Staff Category
                </span>
                <span className="mt-1 block text-sm uppercase text-slate-200">
                  {staff.staffCategory || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Nature of Employment
                </span>
                <span className="mt-1 block text-sm uppercase text-slate-200">
                  {staff.natureOfEmployment || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Deployment Status
                </span>
                <span className="mt-1 block text-sm text-slate-200">
                  {staff.onDeployment
                    ? `DEPLOYED (From: ${staff.originalPlaceOfPosting || 'N/A'})`
                    : 'POSTED AT GMS WARPORA'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Date of Birth
                </span>
                <span className="mt-1 block font-mono text-sm text-slate-200">
                  {formatDisplayDate(staff.dob)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Date of Appointment
                </span>
                <span className="mt-1 block font-mono text-sm text-slate-200">
                  {formatDisplayDate(staff.dateOfAppointment)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Date of Joining This School
                </span>
                <span className="mt-1 block font-mono text-sm text-slate-200">
                  {formatDisplayDate(staff.dateOfJoiningSchool)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  PAN Number
                </span>
                <span className="mt-1 block font-mono text-sm uppercase text-emerald-300">
                  {staff.panNumber || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Phone Number
                </span>
                <span className="mt-1 block font-mono text-sm text-slate-200">
                  {staff.phone || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Email Address
                </span>
                <span className="mt-1 block text-sm text-slate-200">
                  {staff.email || 'N/A'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5 sm:col-span-2 lg:col-span-3">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Remarks
                </span>
                <span className="mt-1 block text-sm text-slate-200">
                  {staff.remarks || 'No remarks recorded'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}