'use client';

import { useState, useEffect, useTransition } from 'react';
import * as XLSX from 'xlsx';
import { fetchStudentsByClass, type MasterStudentDetail } from './actions';

interface FieldOption {
  key: keyof MasterStudentDetail;
  label: string;
}

// All fields defined in masterData schema
const MASTER_DATA_FIELDS: FieldOption[] = [
  { key: 'pen', label: 'PEN' },
  { key: 'name', label: 'Student Name' },
  { key: 'father_name', label: "Father's Name" },
  { key: 'mother_name', label: "Mother's Name" },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'class', label: 'Current Class' },
  { key: 'gender', label: 'Gender' },
  { key: 'aadhaar', label: 'Aadhaar Number' },
  { key: 'bankAccount', label: 'Bank Account' },
  { key: 'bankName', label: 'Bank Name' },
  { key: 'bankBranch', label: 'Bank Branch' },
  { key: 'ifscCode', label: 'IFSC Code' },
  { key: 'adress', label: 'Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'bpl', label: 'BPL' },
  { key: 'aay', label: 'AAY' },
  { key: 'admission_number', label: 'Admission No' },
  { key: 'admission_date', label: 'Admission Date' },
  { key: 'prev_class', label: 'Previous Class' },
  { key: 'status', label: 'Enrollment Status' },
  { key: 'promotionStatus', label: 'Promotion Status' },
  { key: 'remarks', label: 'Remarks' },
];

// Ordered from Class 8 down to KG (Pre-Primary)
const CLASS_DROPDOWN_OPTIONS = [
  { label: 'Class 8', value: '8' },
  { label: 'Class 7', value: '7' },
  { label: 'Class 6', value: '6' },
  { label: 'Class 5', value: '5' },
  { label: 'Class 4', value: '4' },
  { label: 'Class 3', value: '3' },
  { label: 'Class 2', value: '2' },
  { label: 'Class 1', value: '1' },
  { label: 'KG (Pre-Primary)', value: 'Pre-Primary' },
  { label: 'All Classes', value: 'ALL' },
];

const DEFAULT_SELECTED_FIELDS: (keyof MasterStudentDetail)[] = [
  'pen',
  'name',
  'father_name',
  'class',
  'dob',
];

function formatDate(isoDate?: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatCellValue(
  student: MasterStudentDetail,
  key: keyof MasterStudentDetail
): string {
  const raw = student[key];

  if (raw === undefined || raw === null || raw === '') return '-';

  if (key === 'dob' || key === 'admission_date') {
    return formatDate(String(raw));
  }

  if (key === 'bpl' || key === 'aay') {
    return raw ? 'Yes' : 'No';
  }

  if (key === 'class' || key === 'prev_class') {
    if (raw === 'Pre-Primary') return 'KG (Pre-Primary)';
    if (raw === 'Pool') return 'Pool (8th Passed)';
    if (raw === 'None') return 'None';
    return `Class ${raw}`;
  }

  if (key === 'ifscCode') {
    return String(raw).toUpperCase();
  }

  if (key === 'status' || key === 'promotionStatus') {
    return String(raw).toUpperCase();
  }

  return String(raw);
}

export default function FetchDetailClient({
  initialStudents,
}: {
  initialStudents: MasterStudentDetail[];
}) {
  const [selectedClass, setSelectedClass] = useState<string>('8');
  const [students, setStudents] = useState<MasterStudentDetail[]>(initialStudents);
  const [selectedFields, setSelectedFields] =
    useState<(keyof MasterStudentDetail)[]>(DEFAULT_SELECTED_FIELDS);
  const [isPending, startTransition] = useTransition();

  // Fetch matching students whenever class dropdown changes
  useEffect(() => {
    startTransition(async () => {
      const data = await fetchStudentsByClass(selectedClass);
      setStudents(data);
    });
  }, [selectedClass]);

  const toggleField = (fieldKey: keyof MasterStudentDetail) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((k) => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const activeColumns = MASTER_DATA_FIELDS.filter((f) =>
    selectedFields.includes(f.key)
  );

  const handleDownloadExcel = () => {
    if (students.length === 0 || activeColumns.length === 0) return;

    const exportRows = students.map((student, idx) => {
      const row: Record<string, string | number> = {
        'S.No': idx + 1,
      };
      for (const col of activeColumns) {
        row[col.label] = formatCellValue(student, col.key);
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    const sheetName =
      selectedClass === 'ALL'
        ? 'All_Classes'
        : selectedClass === 'Pre-Primary'
        ? 'KG_PrePrimary'
        : `Class_${selectedClass}`;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `GMS_Warpora_${sheetName}_Details.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Class Dropdown + Download Excel */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/35 bg-slate-900/80 p-5 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-md sm:flex-row sm:items-end">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="fetch-class-select"
              className="text-xs font-bold uppercase tracking-wider text-cyan-400"
            >
              Select Class (8th to KG)
            </label>
            <select
              id="fetch-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="min-w-[200px] cursor-pointer rounded-xl border border-cyan-500/50 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.16)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
            >
              {CLASS_DROPDOWN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-cyan-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-fuchsia-500/35 bg-slate-950/90 px-4 py-2.5 text-xs font-semibold text-slate-300">
            Records Fetched:{' '}
            <span className="font-mono text-sm font-bold text-fuchsia-300">
              {isPending ? '...' : students.length}
            </span>
          </div>
        </div>

        {/* Download Excel Button */}
        <button
          type="button"
          disabled={isPending || students.length === 0 || activeColumns.length === 0}
          onClick={handleDownloadExcel}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-400/80 bg-emerald-950/70 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition hover:bg-emerald-900/85 hover:text-white hover:shadow-[0_0_28px_rgba(52,211,153,0.55)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download Excel (.xlsx)</span>
        </button>
      </div>

      {/* Interactive masterData Field Pills */}
      <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/75 p-5 shadow-[0_0_25px_rgba(217,70,239,0.1)] backdrop-blur-md">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
              Select MasterData Fields ({activeColumns.length} Selected)
            </span>
            <p className="text-[11px] text-slate-400">
              Click pills below to add or remove columns from the table and Excel export
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedFields(MASTER_DATA_FIELDS.map((f) => f.key))}
              className="cursor-pointer rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 transition hover:border-cyan-400"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setSelectedFields(DEFAULT_SELECTED_FIELDS)}
              className="cursor-pointer rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300 transition hover:border-fuchsia-400 hover:text-fuchsia-300"
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setSelectedFields([])}
              className="cursor-pointer rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-300 transition hover:border-rose-400"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {MASTER_DATA_FIELDS.map((field) => {
            const isSelected = selectedFields.includes(field.key);

            return (
              <button
                key={field.key}
                type="button"
                onClick={() => toggleField(field.key)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.35)]'
                    : 'border-slate-700/90 bg-slate-950/75 text-slate-400 hover:border-fuchsia-400/60 hover:text-fuchsia-200'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,1)]' : 'bg-slate-600'
                  }`}
                />
                <span>{field.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-900/75 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)]" />
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Fetching Student Details...
            </p>
          </div>
        ) : activeColumns.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-amber-300">
            Select at least one field pill above to display columns in the table.
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No students found in this class.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-cyan-500/20 text-left text-sm">
            <thead className="bg-slate-950/90 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <tr>
                <th className="w-16 px-5 py-4">S.No</th>
                {activeColumns.map((col) => (
                  <th key={col.key} className="whitespace-nowrap px-5 py-4">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {students.map((student, index) => (
                <tr
                  key={student._id}
                  className="transition-colors duration-150 hover:bg-cyan-500/[0.06]"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  {activeColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-5 py-3.5 text-slate-200 ${
                        col.key === 'pen' ||
                        col.key === 'aadhaar' ||
                        col.key === 'bankAccount' ||
                        col.key === 'ifscCode' ||
                        col.key === 'phone'
                          ? 'font-mono text-cyan-200'
                          : col.key === 'name'
                          ? 'font-semibold text-slate-100'
                          : ''
                      }`}
                    >
                      {formatCellValue(student, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}