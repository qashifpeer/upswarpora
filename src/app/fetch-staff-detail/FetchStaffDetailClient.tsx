'use client';

import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import type { StaffMasterDetail } from './actions';

interface StaffFieldOption {
  key: keyof StaffMasterDetail;
  label: string;
}

// All fields defined in staffMasterData schema
const STAFF_MASTER_FIELDS: StaffFieldOption[] = [
  { key: 'teacherCode', label: 'Teacher Code' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'surname', label: 'Surname' },
  { key: 'staffCategory', label: 'Teaching / Non-Teaching' },
  { key: 'designation', label: 'Designation' },
  { key: 'natureOfEmployment', label: 'Nature of Employment' },
  { key: 'onDeployment', label: 'On Deployment' },
  { key: 'originalPlaceOfPosting', label: 'Original Place of Posting' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'dateOfAppointment', label: 'Date of Appointment' },
  { key: 'dateOfJoiningSchool', label: 'Date of Joining This School' },
  { key: 'panNumber', label: 'PAN Number' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'email', label: 'Email Address' },
  { key: 'remarks', label: 'Remarks' },
];

const CATEGORY_FILTER_OPTIONS = [
  { label: 'All Staff', value: 'ALL' },
  { label: 'Teaching Staff', value: 'Teaching' },
  { label: 'Non-Teaching Staff', value: 'Non-Teaching' },
];

const DESIGNATION_FILTER_OPTIONS = [
  { label: 'All Designations', value: 'ALL' },
  { label: 'Head Teacher', value: 'Head Teacher' },
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Aaya', value: 'Aaya' },
  { label: 'Cook', value: 'Cook' },
  { label: 'Sweeper', value: 'Sweeper' },
];

const DEFAULT_SELECTED_FIELDS: (keyof StaffMasterDetail)[] = [
  'teacherCode',
  'firstName',
  'lastName',
  'designation',
  'natureOfEmployment',
  'phone',
];

function formatDate(isoDate?: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatStaffCellValue(
  staff: StaffMasterDetail,
  key: keyof StaffMasterDetail
): string {
  const raw = staff[key];

  if (key === 'onDeployment') {
    return raw ? 'Yes' : 'No';
  }

  if (key === 'originalPlaceOfPosting') {
    if (!staff.onDeployment) return 'N/A (Not Deployed)';
    return raw && String(raw).trim() !== '' ? String(raw) : '-';
  }

  if (raw === undefined || raw === null || raw === '') return '-';

  if (
    key === 'dob' ||
    key === 'dateOfAppointment' ||
    key === 'dateOfJoiningSchool'
  ) {
    return formatDate(String(raw));
  }

  if (key === 'panNumber') {
    return String(raw).toUpperCase();
  }

  return String(raw);
}

export default function FetchStaffDetailClient({
  initialStaff,
}: {
  initialStaff: StaffMasterDetail[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('ALL');
  const [selectedFields, setSelectedFields] =
    useState<(keyof StaffMasterDetail)[]>(DEFAULT_SELECTED_FIELDS);

  const filteredStaff = useMemo(() => {
    return initialStaff.filter((member) => {
      const matchesCategory =
        selectedCategory === 'ALL' || member.staffCategory === selectedCategory;
      const matchesDesignation =
        selectedDesignation === 'ALL' || member.designation === selectedDesignation;
      return matchesCategory && matchesDesignation;
    });
  }, [initialStaff, selectedCategory, selectedDesignation]);

  const toggleField = (fieldKey: keyof StaffMasterDetail) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((k) => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const activeColumns = STAFF_MASTER_FIELDS.filter((f) =>
    selectedFields.includes(f.key)
  );

  const handleDownloadExcel = () => {
    if (filteredStaff.length === 0 || activeColumns.length === 0) return;

    const exportRows = filteredStaff.map((member, idx) => {
      const row: Record<string, string | number> = {
        'S.No': idx + 1,
      };
      for (const col of activeColumns) {
        row[col.label] = formatStaffCellValue(member, col.key);
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    const sheetSuffix =
      selectedCategory === 'ALL'
        ? 'All_Staff'
        : selectedCategory.replace(/[^a-zA-Z0-9]/g, '_');

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetSuffix);
    XLSX.writeFile(workbook, `GMS_Warpora_${sheetSuffix}_Details.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Staff Filters + Download Excel */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/35 bg-slate-900/80 p-5 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-md lg:flex-row lg:items-end">
        <div className="flex flex-wrap items-end gap-4">
          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="staff-category-select"
              className="text-xs font-bold uppercase tracking-wider text-cyan-400"
            >
              Staff Category
            </label>
            <select
              id="staff-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-w-[190px] cursor-pointer rounded-xl border border-cyan-500/50 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.16)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
            >
              {CATEGORY_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-cyan-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Designation Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="staff-designation-select"
              className="text-xs font-bold uppercase tracking-wider text-fuchsia-400"
            >
              Designation
            </label>
            <select
              id="staff-designation-select"
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="min-w-[190px] cursor-pointer rounded-xl border border-fuchsia-500/50 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.16)] outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/50"
            >
              {DESIGNATION_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-fuchsia-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(selectedCategory !== 'ALL' || selectedDesignation !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedDesignation('ALL');
              }}
              className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Reset Filters
            </button>
          )}

          <div className="rounded-xl border border-fuchsia-500/35 bg-slate-950/90 px-4 py-2.5 text-xs font-semibold text-slate-300">
            Staff Matched:{' '}
            <span className="font-mono text-sm font-bold text-fuchsia-300">
              {filteredStaff.length}
            </span>{' '}
            of <span className="font-mono text-slate-200">{initialStaff.length}</span>
          </div>
        </div>

        {/* Download Excel Button */}
        <button
          type="button"
          disabled={filteredStaff.length === 0 || activeColumns.length === 0}
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

      {/* Interactive staffMasterData Field Pills */}
      <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/75 p-5 shadow-[0_0_25px_rgba(217,70,239,0.1)] backdrop-blur-md">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
              Select StaffMasterData Fields ({activeColumns.length} Selected)
            </span>
            <p className="text-[11px] text-slate-400">
              Click pills below to add or remove columns from the table and Excel export
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedFields(STAFF_MASTER_FIELDS.map((f) => f.key))}
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
          {STAFF_MASTER_FIELDS.map((field) => {
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

      {/* Dynamic Staff Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-900/75 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-md">
        {activeColumns.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-amber-300">
            Select at least one field pill above to display columns in the table.
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No staff records match the selected filters.
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
              {filteredStaff.map((member, index) => (
                <tr
                  key={member._id}
                  className="transition-colors duration-150 hover:bg-cyan-500/[0.06]"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  {activeColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-5 py-3.5 text-slate-200 ${
                        col.key === 'teacherCode' ||
                        col.key === 'panNumber' ||
                        col.key === 'phone'
                          ? 'font-mono text-cyan-200'
                          : col.key === 'firstName'
                          ? 'font-semibold text-slate-100'
                          : ''
                      }`}
                    >
                      {formatStaffCellValue(member, col.key)}
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