'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  bulkUpsertMasterStaff,
  checkExistingStaff,
  createMasterStaff,
  type ExistingStaffRecord,
  type NewStaffPayload,
} from './actions';

const DESIGNATION_OPTIONS: NewStaffPayload['designation'][] = [
  'Teacher',
  'Head Teacher',
  'Aaya',
  'Cook',
  'Sweeper',
];

const INITIAL_FORM: NewStaffPayload = {
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
};

function parseExcelDate(val: unknown): string {
  if (val === undefined || val === null || val === '') return '';
  if (typeof val === 'number') {
    const parsed = XLSX.SSF.parse_date_code(val);
    if (parsed && parsed.y && parsed.m && parsed.d) {
      const mm = String(parsed.m).padStart(2, '0');
      const dd = String(parsed.d).padStart(2, '0');
      return `${parsed.y}-${mm}-${dd}`;
    }
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const dmy = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  return '';
}

function parseExcelBoolean(val: unknown): boolean | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'boolean') return val;
  const str = String(val).trim().toLowerCase();
  if (['yes', 'true', '1', 'y', 'deployed'].includes(str)) return true;
  if (['no', 'false', '0', 'n'].includes(str)) return false;
  return undefined;
}

function mapSpreadsheetRowToStaffPayload(
  rawRow: Record<string, unknown>
): Partial<NewStaffPayload> {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rawRow)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    normalized[cleanKey] = value;
  }

  const pick = (...keys: string[]): string | undefined => {
    for (const k of keys) {
      const v = normalized[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
    return undefined;
  };

  return {
    teacherCode: pick('teachercode', 'code', 'cpis', 'employeeid', 'staffcode'),
    firstName: pick('firstname', 'name', 'staffname'),
    lastName: pick('lastname', 'middlename'),
    surname: pick('surname', 'familyname'),
    staffCategory: pick('teachingnonteaching', 'staffcategory', 'category') as
      | NewStaffPayload['staffCategory']
      | undefined,
    designation: pick('designation', 'post', 'role') as
      | NewStaffPayload['designation']
      | undefined,
    natureOfEmployment: pick('natureofemployment', 'employmentnature', 'employmenttype') as
      | NewStaffPayload['natureOfEmployment']
      | undefined,
    onDeployment: parseExcelBoolean(
      normalized['whetherondeployment'] ?? normalized['ondeployment'] ?? normalized['deployed']
    ),
    originalPlaceOfPosting: pick(
      'originalplaceofposting',
      'originalposting',
      'parentschool'
    ),
    dob: parseExcelDate(normalized['dob'] ?? normalized['dateofbirth']),
    dateOfAppointment: parseExcelDate(
      normalized['dateofappointment'] ?? normalized['appointmentdate']
    ),
    dateOfJoiningSchool: parseExcelDate(
      normalized['dateofjoiningthisschool'] ??
        normalized['dateofjoining'] ??
        normalized['joiningdate']
    ),
    panNumber: pick('pannumber', 'pan'),
    phone: pick('phonenumber', 'phone', 'mobile', 'mobilenumber'),
    email: pick('email', 'emailaddress'),
    remarks: pick('remarks', 'remark', 'notes'),
  };
}

export default function AddStaffClient() {
  const [form, setForm] = useState<NewStaffPayload>(INITIAL_FORM);
  const [duplicateStaff, setDuplicateStaff] = useState<ExistingStaffRecord | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Bulk Add Modal State
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFileName, setBulkFileName] = useState<string>('');
  const [bulkRows, setBulkRows] = useState<Partial<NewStaffPayload>[]>([]);
  const [bulkParseError, setBulkParseError] = useState<string | null>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, startTransition] = useTransition();

  // Live duplicate check on Teacher Code or PAN Number
  useEffect(() => {
    const code = form.teacherCode?.trim() || '';
    const pan = form.panNumber?.trim() || '';

    if (code.length < 3 && pan.length < 10) {
      setDuplicateStaff(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingDuplicate(true);
      try {
        const found = await checkExistingStaff({
          teacherCode: code.length >= 3 ? code : undefined,
          panNumber: pan.length === 10 ? pan : undefined,
        });
        setDuplicateStaff(found);
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form.teacherCode, form.panNumber]);

  const handleChange = <K extends keyof NewStaffPayload>(
    key: K,
    value: NewStaffPayload[K]
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'onDeployment' && !value) {
        updated.originalPlaceOfPosting = '';
      }
      return updated;
    });
    if (feedback) setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await createMasterStaff(form);

      if (res.duplicate) {
        setDuplicateStaff(res.duplicate);
        setFeedback({
          type: 'error',
          message: res.error || 'Duplicate staff record detected.',
        });
        return;
      }

      if (!res.success) {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to save staff record.',
        });
        return;
      }

      const fullName = [form.firstName, form.lastName, form.surname]
        .filter(Boolean)
        .join(' ');
      setForm(INITIAL_FORM);
      setDuplicateStaff(null);
      setFeedback({
        type: 'success',
        message: `Staff member "${fullName}" added to Staff Master Data successfully!`,
      });
    });
  };

  const handleDownloadSampleTemplate = () => {
    const sampleData = [
      {
        'Teacher Code': 'TCH-101',
        'First Name': 'Mohammad',
        'Last Name': 'Tariq',
        Surname: 'Dar',
        'Teaching / Non-Teaching': 'Teaching',
        Designation: 'Teacher',
        'Nature of Employment': 'Permanent',
        'Whether on Deployment': 'No',
        'Original Place of Posting': '',
        'Date of Birth': '1986-04-12',
        'Date of Appointment': '2012-07-01',
        'Date of Joining This School': '2021-05-15',
        'PAN Number': 'ABCDE1234F',
        'Phone Number': '9906000001',
        'Email Address': 'tariq.teacher@example.com',
        Remarks: '',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StaffMasterData_Template');
    XLSX.writeFile(workbook, 'GMS_Warpora_Bulk_Staff_Template.xlsx');
  };

  const handleExcelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setBulkParseError(null);
    setBulkRows([]);

    if (!file) {
      setBulkFileName('');
      return;
    }

    setBulkFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        setBulkParseError('The selected Excel file has no worksheets.');
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: '',
      });

      if (rawJson.length === 0) {
        setBulkParseError('No data rows found in the first worksheet.');
        return;
      }

      const mapped = rawJson
        .map(mapSpreadsheetRowToStaffPayload)
        .filter((r) => Boolean(r.firstName));

      if (mapped.length === 0) {
        setBulkParseError(
          'No valid rows found. Ensure your Excel file has a "First Name" column.'
        );
        return;
      }

      setBulkRows(mapped);
    } catch {
      setBulkParseError(
        'Could not read the Excel file. Please upload a valid .xlsx, .xls, or .csv file.'
      );
    }
  };

  const handleBulkUploadSubmit = () => {
    if (bulkRows.length === 0) return;
    setIsBulkUploading(true);
    setBulkParseError(null);

    startTransition(async () => {
      try {
        const res = await bulkUpsertMasterStaff(bulkRows);
        if (!res.success) {
          setBulkParseError(res.error || 'Bulk upload failed.');
          return;
        }

        setBulkModalOpen(false);
        setBulkRows([]);
        setBulkFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';

        setFeedback({
          type: 'success',
          message: `Bulk Staff Excel sync complete: ${res.createdCount} added, ${res.updatedCount} updated${
            res.skippedCount > 0 ? `, ${res.skippedCount} skipped` : ''
          }.`,
        });
      } catch (err: any) {
        setBulkParseError(err?.message || 'Bulk upload failed.');
      } finally {
        setIsBulkUploading(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Strip with Bulk Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-fuchsia-500/35 bg-slate-900/80 p-4 shadow-[0_0_25px_rgba(217,70,239,0.12)] backdrop-blur-md">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-fuchsia-300">
            Batch Staff Import &amp; Update
          </p>
          <p className="text-xs text-slate-400">
            Upload an Excel file to bulk-add staff or update existing records matching by Teacher Code or PAN.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setBulkParseError(null);
            setBulkModalOpen(true);
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-fuchsia-400/80 bg-fuchsia-950/70 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.32)] transition hover:bg-fuchsia-900 hover:text-white hover:shadow-[0_0_28px_rgba(217,70,239,0.55)]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Bulk Add Staff (Excel)</span>
        </button>
      </div>

      {/* Bulk Add Excel Modal */}
      {bulkModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-staff-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-fuchsia-500/50 bg-slate-900 shadow-[0_0_50px_rgba(217,70,239,0.28)]">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
                  Excel Upsert Engine • Match by Teacher Code / PAN
                </span>
                <h2 id="bulk-staff-title" className="text-lg font-extrabold text-slate-100">
                  Bulk Add / Update Staff via Excel
                </h2>
              </div>

              <button
                type="button"
                disabled={isBulkUploading}
                onClick={() => setBulkModalOpen(false)}
                aria-label="Close bulk upload modal"
                className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-4">
                <div className="text-xs text-slate-300">
                  <p className="font-bold text-cyan-300">Need the exact column format?</p>
                  <p className="mt-0.5 text-slate-400">
                    Download the sample Excel template with all StaffMasterData headers pre-configured.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="cursor-pointer rounded-xl border border-cyan-400/70 bg-cyan-950/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-900/80"
                >
                  Download Template (.xlsx)
                </button>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Excel File (.xlsx, .xls, .csv)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelFileChange}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-fuchsia-400/60 bg-slate-950 p-4 text-xs text-slate-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-fuchsia-950 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-fuchsia-200 hover:border-fuchsia-400"
                />
                {bulkFileName && (
                  <p className="mt-2 font-mono text-xs text-emerald-300">
                    Loaded: {bulkFileName} ({bulkRows.length} valid staff row(s) ready)
                  </p>
                )}
              </div>

              {bulkParseError && (
                <div className="rounded-xl border border-rose-500/70 bg-rose-950/60 p-3.5 text-xs font-semibold text-rose-200">
                  {bulkParseError}
                </div>
              )}

              {bulkRows.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Preview ({bulkRows.length} Staff Members Ready to Sync)
                  </p>
                  <div className="max-h-60 overflow-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                      <thead className="bg-slate-900 font-bold uppercase text-cyan-300">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Code</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Designation</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">PAN / Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 text-slate-200">
                        {bulkRows.slice(0, 50).map((r, i) => (
                          <tr key={`${r.firstName}-${i}`}>
                            <td className="px-3 py-2 font-mono text-slate-400">{i + 1}</td>
                            <td className="px-3 py-2 font-mono text-cyan-300">
                              {r.teacherCode || '-'}
                            </td>
                            <td className="px-3 py-2 font-semibold">
                              {[r.firstName, r.lastName, r.surname].filter(Boolean).join(' ')}
                            </td>
                            <td className="px-3 py-2">{r.designation || 'Teacher'}</td>
                            <td className="px-3 py-2">{r.staffCategory || 'Teaching'}</td>
                            <td className="px-3 py-2 font-mono">
                              {r.panNumber || '-'} • {r.phone || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/90 px-6 py-4">
              <button
                type="button"
                disabled={isBulkUploading}
                onClick={() => setBulkModalOpen(false)}
                className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={bulkRows.length === 0 || isBulkUploading}
                onClick={handleBulkUploadSubmit}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-400/80 bg-emerald-950/80 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.35)] transition hover:bg-emerald-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isBulkUploading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-200" />
                    <span>Syncing {bulkRows.length} Records...</span>
                  </>
                ) : (
                  <span>Upload &amp; Update All ({bulkRows.length})</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 text-sm font-semibold sm:flex-row sm:items-center ${
            feedback.type === 'success'
              ? 'border-emerald-400/70 bg-emerald-950/60 text-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.25)]'
              : 'border-rose-500/70 bg-rose-950/60 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
          }`}
        >
          <span>{feedback.message}</span>
          {feedback.type === 'success' && (
            <Link
              href="/fetch-staff-detail"
              className="shrink-0 rounded-xl border border-emerald-400/60 bg-emerald-900/60 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-100 transition hover:bg-emerald-800"
            >
              View in Staff Details →
            </Link>
          )}
        </div>
      )}

      {/* Duplicate Staff Warning Card */}
      {duplicateStaff && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-amber-400/80 bg-amber-950/50 p-6 shadow-[0_0_30px_rgba(251,191,36,0.25)] backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/30 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/70 bg-amber-900/70 font-mono text-sm font-extrabold text-amber-200">
                !
              </span>
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                  Duplicate Staff Record Detected
                </h2>
                <p className="text-xs text-amber-200/80">
                  A matching Teacher Code or PAN Number already exists in Staff Master Data:
                </p>
              </div>
            </div>

            <Link
              href="/fetch-staff-detail"
              className="rounded-xl border border-amber-400/70 bg-amber-900/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-100 transition hover:bg-amber-800"
            >
              Open Staff Registry →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Name</span>
              <span className="mt-0.5 block text-sm font-bold text-slate-100">
                {[duplicateStaff.firstName, duplicateStaff.lastName, duplicateStaff.surname]
                  .filter(Boolean)
                  .join(' ')}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Teacher Code
              </span>
              <span className="mt-0.5 block font-mono text-sm text-cyan-300">
                {duplicateStaff.teacherCode || 'N/A'}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Designation
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-slate-200">
                {duplicateStaff.designation || 'N/A'} ({duplicateStaff.staffCategory || 'N/A'})
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                PAN / Phone
              </span>
              <span className="mt-0.5 block font-mono text-sm text-slate-200">
                {duplicateStaff.panNumber || 'N/A'} • {duplicateStaff.phone || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Single Staff Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-cyan-500/35 bg-slate-900/80 p-6 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md sm:p-8"
      >
        {/* SECTION 1: IDENTITY & NAME */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
              1. Staff Identity &amp; Full Name
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Teacher Code (Optional) */}
            <div>
              <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-300">
                <span>Teacher Code (Optional)</span>
                {isCheckingDuplicate && (
                  <span className="font-mono text-[10px] text-amber-300">Checking...</span>
                )}
              </label>
              <input
                type="text"
                value={form.teacherCode}
                onChange={(e) => handleChange('teacherCode', e.target.value)}
                placeholder="Optional CPIS / Code"
                className="w-full rounded-xl border border-cyan-500/40 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            {/* First Name * */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                First Name *
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Required"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Middle / Last name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            {/* Surname */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Surname
              </label>
              <input
                type="text"
                value={form.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                placeholder="Family surname"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DESIGNATION, EMPLOYMENT & DEPLOYMENT */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-fuchsia-400">
              2. Designation, Employment &amp; Deployment
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Teaching / Non-Teaching */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Teaching / Non-Teaching *
              </label>
              <select
                required
                value={form.staffCategory}
                onChange={(e) =>
                  handleChange(
                    'staffCategory',
                    e.target.value as NewStaffPayload['staffCategory']
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              >
                <option value="Teaching">Teaching</option>
                <option value="Non-Teaching">Non-Teaching</option>
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Designation *
              </label>
              <select
                required
                value={form.designation}
                onChange={(e) =>
                  handleChange(
                    'designation',
                    e.target.value as NewStaffPayload['designation']
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              >
                {DESIGNATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Nature of Employment */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Nature of Employment *
              </label>
              <select
                required
                value={form.natureOfEmployment}
                onChange={(e) =>
                  handleChange(
                    'natureOfEmployment',
                    e.target.value as NewStaffPayload['natureOfEmployment']
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              >
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            {/* Whether on Deployment Toggle */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/75 px-4 py-3">
              <label className="flex cursor-pointer items-center gap-3 text-xs font-bold uppercase tracking-wider text-amber-200">
                <input
                  type="checkbox"
                  checked={form.onDeployment}
                  onChange={(e) => handleChange('onDeployment', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-400 focus:ring-amber-400"
                />
                <span>Whether on Deployment</span>
              </label>
            </div>

            {/* Conditional Original Place of Posting */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Original Place of Posting {form.onDeployment ? '*' : '(Inactive)'}
              </label>
              <input
                type="text"
                disabled={!form.onDeployment}
                required={form.onDeployment}
                value={form.originalPlaceOfPosting}
                onChange={(e) => handleChange('originalPlaceOfPosting', e.target.value)}
                placeholder={
                  form.onDeployment
                    ? 'Enter parent school / office name'
                    : 'Enable "Whether on Deployment" to activate'
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/40 disabled:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SERVICE DATES */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
              3. Important Service Dates
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Date of Appointment
              </label>
              <input
                type="date"
                value={form.dateOfAppointment}
                onChange={(e) => handleChange('dateOfAppointment', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Date of Joining This School
              </label>
              <input
                type="date"
                value={form.dateOfJoiningSchool}
                onChange={(e) => handleChange('dateOfJoiningSchool', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PAN, CONTACT & REMARKS */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
              4. Tax ID, Contact &amp; Remarks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* PAN Number */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                PAN Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={form.panNumber}
                onChange={(e) =>
                  handleChange(
                    'panNumber',
                    e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                  )
                }
                placeholder="ABCDE1234F"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm uppercase text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Phone Number (10 Digits)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  handleChange('phone', e.target.value.replace(/\D/g, ''))
                }
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="staff@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Remarks
              </label>
              <textarea
                rows={2}
                value={form.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Additional notes or remarks (optional)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>
          </div>
        </div>

        {/* Submit & Reset Actions */}
        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-800 pt-6">
          <button
            type="button"
            onClick={() => {
              setForm(INITIAL_FORM);
              setDuplicateStaff(null);
              setFeedback(null);
            }}
            className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Clear Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting || Boolean(duplicateStaff)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/80 bg-cyan-950/80 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-900 hover:text-white hover:shadow-[0_0_32px_rgba(34,211,238,0.55)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300" />
                <span>Saving Staff...</span>
              </>
            ) : duplicateStaff ? (
              <span>Staff Already Registered</span>
            ) : (
              <span>+ Add Staff to Master Data</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}