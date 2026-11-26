'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  bulkUpsertMasterStudents,
  checkStudentByPen,
  createMasterStudent,
  type ExistingStudentRecord,
  type NewStudentPayload,
} from './actions';

const CLASS_OPTIONS = [
  { label: 'Pre-Primary / Nursery', value: 'Pre-Primary' },
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

const PREV_CLASS_OPTIONS = [
  { label: 'None / Fresh Admission', value: 'None' },
  { label: 'Pre-Primary', value: 'Pre-Primary' },
  { label: 'Class 1', value: '1' },
  { label: 'Class 2', value: '2' },
  { label: 'Class 3', value: '3' },
  { label: 'Class 4', value: '4' },
  { label: 'Class 5', value: '5' },
  { label: 'Class 6', value: '6' },
  { label: 'Class 7', value: '7' },
  { label: 'Class 8', value: '8' },
];

const INITIAL_FORM: NewStudentPayload = {
  pen: '',
  name: '',
  father_name: '',
  mother_name: '',
  dob: '',
  class: 'Pre-Primary',
  gender: 'Male',
  aadhaar: '',
  bankAccount: '',
  bankName: '',
  bankBranch: '',
  ifscCode: '',
  adress: '',
  phone: '',
  bpl: false,
  aay: false,
  admission_number: '',
  admission_date: '',
  prev_class: 'None',
  status: 'active',
  remarks: '',
};

function formatDisplayDate(isoDate?: string) {
  if (!isoDate) return 'N/A';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatClassLabel(cls?: string) {
  if (!cls || cls === 'None') return 'N/A';
  if (cls === 'Pre-Primary') return 'Pre-Primary';
  if (cls === 'Pool') return 'Pool (8th Passed)';
  return `Class ${cls}`;
}

// Parse Excel serial numbers or DD-MM-YYYY / YYYY-MM-DD strings into YYYY-MM-DD
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
  if (['yes', 'true', '1', 'y'].includes(str)) return true;
  if (['no', 'false', '0', 'n'].includes(str)) return false;
  return undefined;
}

function mapSpreadsheetRowToPayload(
  rawRow: Record<string, unknown>
): Partial<NewStudentPayload> {
  // Normalize column headers (lowercase, strip spaces/underscores/punctuation)
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

  const rawDob =
    normalized['dob'] ?? normalized['dateofbirth'] ?? normalized['birthdate'];
  const rawAdmDate =
    normalized['admissiondate'] ?? normalized['admdate'] ?? normalized['doa'];

  return {
    pen: pick('pen', 'permanentidentificationnumber', 'permanenteducationnumber', 'studentpen'),
    name: pick('name', 'studentname', 'fullname'),
    father_name: pick('fathername', 'fathersname', 'father'),
    mother_name: pick('mothername', 'mothersname', 'mother'),
    dob: parseExcelDate(rawDob),
    class: pick('class', 'currentclass', 'grade'),
    gender: pick('gender', 'sex'),
    aadhaar: pick('aadhaar', 'aadhaarnumber', 'aadhar', 'aadharnumber'),
    bankAccount: pick('bankaccount', 'bankaccountnumber', 'accountnumber', 'accountno'),
    bankName: pick('bankname', 'bank'),
    bankBranch: pick('bankbranch', 'branch', 'branchname'),
    ifscCode: pick('ifsccode', 'ifsc'),
    adress: pick('adress', 'address', 'residentialaddress', 'residence'),
    phone: pick('phone', 'phonenumber', 'mobile', 'mobilenumber', 'contact'),
    bpl: parseExcelBoolean(normalized['bpl']),
    aay: parseExcelBoolean(normalized['aay']),
    admission_number: pick('admissionnumber', 'admissionno', 'admno'),
    admission_date: parseExcelDate(rawAdmDate),
    prev_class: pick('prevclass', 'previousclass'),
    status: pick('status', 'enrollmentstatus') as NewStudentPayload['status'] | undefined,
    remarks: pick('remarks', 'remark', 'notes'),
  };
}

export default function AddStudentClient() {
  const [form, setForm] = useState<NewStudentPayload>(INITIAL_FORM);
  const [duplicateStudent, setDuplicateStudent] =
    useState<ExistingStudentRecord | null>(null);
  const [isCheckingPen, setIsCheckingPen] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Bulk Add Modal State
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFileName, setBulkFileName] = useState<string>('');
  const [bulkRows, setBulkRows] = useState<Partial<NewStudentPayload>[]>([]);
  const [bulkParseError, setBulkParseError] = useState<string | null>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, startTransition] = useTransition();

  // Debounced live PEN check against Sanity masterData
  useEffect(() => {
    const trimmedPen = form.pen.trim();
    if (trimmedPen.length < 4) {
      setDuplicateStudent(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingPen(true);
      try {
        const found = await checkStudentByPen(trimmedPen);
        setDuplicateStudent(found);
      } finally {
        setIsCheckingPen(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form.pen]);

  const handleChange = <K extends keyof NewStudentPayload>(
    key: K,
    value: NewStudentPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await createMasterStudent(form);

      if (res.duplicate) {
        setDuplicateStudent(res.duplicate);
        setFeedback({
          type: 'error',
          message:
            res.error ||
            `Student with PEN ${res.duplicate.pen} is already registered.`,
        });
        return;
      }

      if (!res.success) {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to save student record.',
        });
        return;
      }

      const savedName = form.name.trim();
      const savedPen = form.pen.trim();
      setForm(INITIAL_FORM);
      setDuplicateStudent(null);
      setFeedback({
        type: 'success',
        message: `Student "${savedName}" (PEN: ${savedPen}) added to Master Data successfully!`,
      });
    });
  };

  const handleDownloadSampleTemplate = () => {
    const sampleData = [
      {
        PEN: '21098765432',
        'Student Name': 'Aarav Ahmad',
        "Father's Name": 'Tariq Ahmad',
        "Mother's Name": 'Shabnam Bano',
        'Date of Birth': '2015-05-14',
        'Current Class': '5',
        Gender: 'Male',
        'Aadhaar Number': '',
        'Bank Account': '0123040100001234',
        'Bank Name': 'J&K Bank',
        'Bank Branch': 'Warpora',
        'IFSC Code': 'JAKA0WARPOR',
        Address: 'Warpora, Kupwara',
        'Phone Number': '9906000000',
        BPL: 'No',
        AAY: 'No',
        'Admission No': '415',
        'Admission Date': '2021-03-10',
        'Previous Class': '4',
        'Enrollment Status': 'active',
        Remarks: '',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MasterData_Template');
    XLSX.writeFile(workbook, 'GMS_Warpora_Bulk_Student_Template.xlsx');
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
        .map(mapSpreadsheetRowToPayload)
        .filter((r) => Boolean(r.pen && r.name));

      if (mapped.length === 0) {
        setBulkParseError(
          'No valid rows found. Ensure your Excel file has "PEN" and "Student Name" (or "Name") columns.'
        );
        return;
      }

      setBulkRows(mapped);
    } catch {
      setBulkParseError('Could not read the Excel file. Please upload a valid .xlsx, .xls, or .csv file.');
    }
  };

  const handleBulkUploadSubmit = () => {
    if (bulkRows.length === 0) return;
    setIsBulkUploading(true);
    setBulkParseError(null);

    startTransition(async () => {
      try {
        const res = await bulkUpsertMasterStudents(bulkRows);
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
          message: `Bulk Excel sync complete: ${res.createdCount} added, ${res.updatedCount} updated${
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
            Batch Import &amp; Update
          </p>
          <p className="text-xs text-slate-400">
            Upload an Excel sheet to bulk-create new students or update existing records matching by PEN.
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
          <span>Bulk Add (Excel)</span>
        </button>
      </div>

      {/* Bulk Add Excel Modal */}
      {bulkModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-add-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-fuchsia-500/50 bg-slate-900 shadow-[0_0_50px_rgba(217,70,239,0.28)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
                  Excel Upsert Engine • Match by PEN
                </span>
                <h2 id="bulk-add-title" className="text-lg font-extrabold text-slate-100">
                  Bulk Add / Update Students via Excel
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

            {/* Modal Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-4">
                <div className="text-xs text-slate-300">
                  <p className="font-bold text-cyan-300">Need the exact column format?</p>
                  <p className="mt-0.5 text-slate-400">
                    Download the sample Excel template with all MasterData headers pre-configured.
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

              {/* File Drop / Picker */}
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
                    Loaded: {bulkFileName} ({bulkRows.length} valid student row(s) ready)
                  </p>
                )}
              </div>

              {bulkParseError && (
                <div className="rounded-xl border border-rose-500/70 bg-rose-950/60 p-3.5 text-xs font-semibold text-rose-200">
                  {bulkParseError}
                </div>
              )}

              {/* Preview Table */}
              {bulkRows.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Preview ({bulkRows.length} Students Ready to Sync)
                  </p>
                  <div className="max-h-60 overflow-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                      <thead className="bg-slate-900 font-bold uppercase text-cyan-300">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">PEN</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Father&apos;s Name</th>
                          <th className="px-3 py-2">Class</th>
                          <th className="px-3 py-2">Bank / IFSC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 text-slate-200">
                        {bulkRows.slice(0, 50).map((r, i) => (
                          <tr key={`${r.pen}-${i}`}>
                            <td className="px-3 py-2 font-mono text-slate-400">{i + 1}</td>
                            <td className="px-3 py-2 font-mono text-cyan-300">{r.pen}</td>
                            <td className="px-3 py-2 font-semibold">{r.name}</td>
                            <td className="px-3 py-2">{r.father_name || '-'}</td>
                            <td className="px-3 py-2">{r.class || 'Pre-Primary'}</td>
                            <td className="px-3 py-2 font-mono">
                              {r.bankName || '-'} {r.ifscCode ? `(${r.ifscCode})` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
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
              href="/all-students"
              className="shrink-0 rounded-xl border border-emerald-400/60 bg-emerald-900/60 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-100 transition hover:bg-emerald-800"
            >
              View in All Students →
            </Link>
          )}
        </div>
      )}

      {/* Duplicate PEN Warning Prompt with Existing Student Details */}
      {duplicateStudent && (
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
                  Duplicate PEN Detected — Student Already Exists
                </h2>
                <p className="text-xs text-amber-200/80">
                  PEN <span className="font-mono font-bold">{duplicateStudent.pen}</span> is already
                  registered in Master Data with the following details:
                </p>
              </div>
            </div>

            <Link
              href="/all-students"
              className="rounded-xl border border-amber-400/70 bg-amber-900/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-100 transition hover:bg-amber-800"
            >
              Open Registry →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Student Name
              </span>
              <span className="mt-0.5 block text-sm font-bold text-slate-100">
                {duplicateStudent.name}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Father&apos;s Name
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-slate-200">
                {duplicateStudent.father_name || 'N/A'}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Mother&apos;s Name
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-slate-200">
                {duplicateStudent.mother_name || 'N/A'}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Current Class
              </span>
              <span className="mt-0.5 block text-sm font-bold text-cyan-300">
                {formatClassLabel(duplicateStudent.class)}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Date of Birth
              </span>
              <span className="mt-0.5 block font-mono text-sm text-slate-200">
                {formatDisplayDate(duplicateStudent.dob)}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Admission No &amp; Date
              </span>
              <span className="mt-0.5 block font-mono text-sm text-slate-200">
                {duplicateStudent.admission_number || 'N/A'} (
                {formatDisplayDate(duplicateStudent.admission_date)})
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Gender / Phone
              </span>
              <span className="mt-0.5 block text-sm text-slate-200">
                {duplicateStudent.gender || 'N/A'} • {duplicateStudent.phone || 'No Phone'}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Enrollment Status
              </span>
              <span className="mt-0.5 block font-mono text-sm font-bold uppercase text-emerald-300">
                {duplicateStudent.status || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Single Student Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-cyan-500/35 bg-slate-900/80 p-6 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md sm:p-8"
      >
        {/* SECTION 1: PEN & CORE IDENTITY */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
              1. Student Identity &amp; PEN Check
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-300">
                <span>PEN (Permanent Education No) *</span>
                {isCheckingPen && (
                  <span className="font-mono text-[10px] text-amber-300">Checking...</span>
                )}
              </label>
              <input
                type="text"
                required
                value={form.pen}
                onChange={(e) => handleChange('pen', e.target.value)}
                placeholder="Enter 11-digit PEN"
                className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition focus:ring-2 ${
                  duplicateStudent
                    ? 'border-amber-400 focus:border-amber-400 focus:ring-amber-400/40'
                    : 'border-cyan-500/40 focus:border-cyan-400 focus:ring-cyan-400/40'
                }`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Full student name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Gender *
              </label>
              <select
                required
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Father&apos;s Name *
              </label>
              <input
                type="text"
                required
                value={form.father_name}
                onChange={(e) => handleChange('father_name', e.target.value)}
                placeholder="Father's full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Mother&apos;s Name *
              </label>
              <input
                type="text"
                required
                value={form.mother_name}
                onChange={(e) => handleChange('mother_name', e.target.value)}
                placeholder="Mother's full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={form.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC & ADMISSION DETAILS */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-fuchsia-400">
              2. Admission &amp; Academic Placement
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Current Class *
              </label>
              <select
                required
                value={form.class}
                onChange={(e) => handleChange('class', e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              >
                {CLASS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Previous Class
              </label>
              <select
                value={form.prev_class}
                onChange={(e) => handleChange('prev_class', e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              >
                {PREV_CLASS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Enrollment Status *
              </label>
              <select
                required
                value={form.status}
                onChange={(e) =>
                  handleChange(
                    'status',
                    e.target.value as NewStudentPayload['status']
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              >
                <option value="active">Active</option>
                <option value="struck off">Struck Off</option>
                <option value="left with DC">Left with DC</option>
                <option value="left without DC">Left without DC</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Admission Number *
              </label>
              <input
                type="text"
                required
                value={form.admission_number}
                onChange={(e) => handleChange('admission_number', e.target.value)}
                placeholder="e.g., 412"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Admission Date *
              </label>
              <input
                type="date"
                required
                value={form.admission_date}
                onChange={(e) => handleChange('admission_date', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BANKING DETAILS */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
              3. Student / Guardian Bank Details
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Bank Account Number
              </label>
              <input
                type="text"
                maxLength={18}
                value={form.bankAccount}
                onChange={(e) =>
                  handleChange('bankAccount', e.target.value.replace(/\D/g, ''))
                }
                placeholder="9 to 18 digits"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Bank Name
              </label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="e.g., J&K Bank, SBI"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Bank Branch
              </label>
              <input
                type="text"
                value={form.bankBranch}
                onChange={(e) => handleChange('bankBranch', e.target.value)}
                placeholder="Branch name / location"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                IFSC Code
              </label>
              <input
                type="text"
                maxLength={11}
                value={form.ifscCode}
                onChange={(e) =>
                  handleChange(
                    'ifscCode',
                    e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                  )
                }
                placeholder="e.g., JAKA0WARPOR"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm uppercase text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: IDENTIFICATION, CONTACT, WELFARE CATEGORIES & REMARKS */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
              4. Identification, Contact, Welfare &amp; Remarks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Aadhaar Number (12 Digits)
              </label>
              <input
                type="text"
                maxLength={12}
                value={form.aadhaar}
                onChange={(e) =>
                  handleChange('aadhaar', e.target.value.replace(/\D/g, ''))
                }
                placeholder="12-digit number (optional)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>

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

            <div className="flex flex-col justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <label className="flex cursor-pointer items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-200">
                <input
                  type="checkbox"
                  checked={form.bpl}
                  onChange={(e) => handleChange('bpl', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
                />
                <span>BPL (Below Poverty Line)</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-200">
                <input
                  type="checkbox"
                  checked={form.aay}
                  onChange={(e) => handleChange('aay', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-fuchsia-400 focus:ring-fuchsia-400"
                />
                <span>AAY (Antyodaya Anna Yojana)</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Residential Address
              </label>
              <textarea
                rows={2}
                value={form.adress}
                onChange={(e) => handleChange('adress', e.target.value)}
                placeholder="Village / Mohalla / Tehsil / District"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>

            <div>
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
              setDuplicateStudent(null);
              setFeedback(null);
            }}
            className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Clear Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting || Boolean(duplicateStudent)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/80 bg-cyan-950/80 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-900 hover:text-white hover:shadow-[0_0_32px_rgba(34,211,238,0.55)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300" />
                <span>Saving Student...</span>
              </>
            ) : duplicateStudent ? (
              <span>PEN Already Registered</span>
            ) : (
              <span>+ Add Student to Master Data</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}