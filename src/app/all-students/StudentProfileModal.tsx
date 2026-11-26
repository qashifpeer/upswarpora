'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';
import {
  updateStudentDetails,
  getStudentResultByPen,
  type StudentStatus,
  type Result2026Data,
} from './actions';
import type { StudentRow } from './StudentsTable';

interface StudentProfileModalProps {
  student: StudentRow | null;
  onClose: () => void;
  onStudentUpdated: (updatedStudent: StudentRow) => void;
}

type ModalTab = 'profile' | 'result' | 'bonafide';

const CLASS_LIST = [
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

const PREV_CLASS_LIST = [
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

function isClassSixOrHigher(studentClass?: string): boolean {
  if (!studentClass) return false;
  const numericClass = parseInt(studentClass.replace(/\D/g, ''), 10);
  return !isNaN(numericClass) && numericClass >= 6;
}

export default function StudentProfileModal({
  student,
  onClose,
  onStudentUpdated,
}: StudentProfileModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    pen: '',
    name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    class: '1',
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
    status: 'active' as StudentStatus,
    remarks: '',
  });

  const [resultData, setResultData] = useState<Result2026Data | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, startSaveTransition] = useTransition();

  const marksheetRef = useRef<HTMLDivElement>(null);
  const bonafideRef = useRef<HTMLDivElement>(null);

  const handlePrintMarksheet = useReactToPrint({
    contentRef: marksheetRef,
    documentTitle: student ? `Marksheet_2026_${student.pen}` : 'Marksheet_2026',
    pageStyle: `
      @page { size: A4 portrait; margin: 12mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
      }
    `,
  });

  const handlePrintBonafide = useReactToPrint({
    contentRef: bonafideRef,
    documentTitle: student ? `Bonafide_${student.pen}` : 'Bonafide_Certificate',
    pageStyle: `
      @page { size: A4 portrait; margin: 12mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
      }
    `,
  });

  useEffect(() => {
    if (!student) return;
    setActiveTab('profile');
    setIsEditing(false);
    setFormError(null);
    setResultData(null);
    setResultError(null);

    setFormState({
      pen: student.pen || '',
      name: student.name || '',
      father_name: student.father_name || '',
      mother_name: student.mother_name || '',
      dob: student.dob || '',
      class: student.class || '1',
      gender: student.gender || 'Male',
      aadhaar: student.aadhaar || '',
      bankAccount: student.bankAccount || '',
      bankName: student.bankName || '',
      bankBranch: student.bankBranch || '',
      ifscCode: student.ifscCode || '',
      adress: student.adress || '',
      phone: student.phone || '',
      bpl: Boolean(student.bpl),
      aay: Boolean(student.aay),
      admission_number: student.admission_number || '',
      admission_date: student.admission_date || '',
      prev_class: student.prev_class || 'None',
      status: student.status || 'active',
      remarks: student.remarks || '',
    });
  }, [student]);

  useEffect(() => {
    if (!student || activeTab !== 'result') return;

    let cancelled = false;
    setResultLoading(true);
    setResultError(null);

    getStudentResultByPen(student.pen)
      .then((res) => {
        if (!cancelled) setResultData(res);
      })
      .catch(() => {
        if (!cancelled) setResultError('Failed to fetch 2026 result data.');
      })
      .finally(() => {
        if (!cancelled) setResultLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [student, activeTab]);

  if (!student) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startSaveTransition(async () => {
      try {
        const res = await updateStudentDetails(student._id, formState);
        onStudentUpdated({
          ...student,
          ...res.updated,
        });
        setIsEditing(false);
      } catch (err: any) {
        setFormError(err?.message || 'Could not update student details.');
      }
    });
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const examClass =
    student.prev_class && student.prev_class !== 'None'
      ? student.prev_class
      : student.class;
  const includeSST = isClassSixOrHigher(examClass);
  const maxTotalMarks = includeSST ? 600 : 500;

  const subjects = resultData
    ? [
        { key: 'english', label: 'English', marks: resultData.english },
        { key: 'urdu', label: 'Urdu', marks: resultData.urdu },
        { key: 'math', label: 'Math', marks: resultData.math },
        { key: 'science', label: 'Science', marks: resultData.science },
        ...(includeSST ? [{ key: 'sst', label: 'SST', marks: resultData.sst }] : []),
        { key: 'kashmiri', label: 'Kashmiri', marks: resultData.kashmiri },
      ]
    : [];

  const computedObtainedTotal = subjects.reduce(
    (sum, sub) => sum + (typeof sub.marks === 'number' ? sub.marks : 0),
    0
  );

  const displayedTotal = subjects.some((s) => typeof s.marks === 'number')
    ? computedObtainedTotal
    : resultData?.total;

  const displayedPercentage =
    typeof displayedTotal === 'number'
      ? Number(((displayedTotal / maxTotalMarks) * 100).toFixed(2))
      : resultData?.percentage;

  const watermarkSvg = `url("data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
      <text x='0' y='150' transform='rotate(-45 100 100)'
        fill='rgba(0,0,0,0.05)' font-size='26' font-family='Arial'>
        GMS WARPORA
      </text>
    </svg>
  `)}")`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-cyan-500/40 bg-slate-900 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-6 py-4">
          <div>
            <span className="font-mono text-xs font-bold text-cyan-400">
              PEN: {student.pen} • {formatClassLabel(student.class)}
            </span>
            <h2 className="text-xl font-extrabold text-slate-100">{student.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`cursor-pointer rounded-lg px-3 py-1.5 uppercase tracking-wider transition ${
                  activeTab === 'profile'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Profile &amp; Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('result')}
                className={`cursor-pointer rounded-lg px-3 py-1.5 uppercase tracking-wider transition ${
                  activeTab === 'result'
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Result 2026
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bonafide')}
                className={`cursor-pointer rounded-lg px-3 py-1.5 uppercase tracking-wider transition ${
                  activeTab === 'bonafide'
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bonafide
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="ml-2 cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
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
          {/* TAB 1: PROFILE & EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
                  {isEditing ? 'Edit Student Master Record' : 'Complete Student Details'}
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer rounded-xl border border-cyan-400/70 bg-cyan-950/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)] transition hover:bg-cyan-900/80"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-500/70 bg-rose-950/60 p-3 text-xs font-semibold text-rose-200">
                  {formError}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        PEN *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.pen}
                        onChange={(e) => setFormState({ ...formState, pen: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Gender
                      </label>
                      <select
                        value={formState.gender}
                        onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Father&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={formState.father_name}
                        onChange={(e) =>
                          setFormState({ ...formState, father_name: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Mother&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={formState.mother_name}
                        onChange={(e) =>
                          setFormState({ ...formState, mother_name: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
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
                        Current Class
                      </label>
                      <select
                        value={formState.class}
                        onChange={(e) => setFormState({ ...formState, class: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      >
                        {CLASS_LIST.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Previous Class
                      </label>
                      <select
                        value={formState.prev_class}
                        onChange={(e) =>
                          setFormState({ ...formState, prev_class: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      >
                        {PREV_CLASS_LIST.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Enrollment Status
                      </label>
                      <select
                        value={formState.status}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            status: e.target.value as StudentStatus,
                          })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      >
                        <option value="active">Active</option>
                        <option value="struck off">Struck Off</option>
                        <option value="left with DC">Left with DC</option>
                        <option value="left without DC">Left without DC</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Admission Number
                      </label>
                      <input
                        type="text"
                        value={formState.admission_number}
                        onChange={(e) =>
                          setFormState({ ...formState, admission_number: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Admission Date
                      </label>
                      <input
                        type="date"
                        value={formState.admission_date}
                        onChange={(e) =>
                          setFormState({ ...formState, admission_date: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
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
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={formState.aadhaar}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            aadhaar: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        maxLength={18}
                        value={formState.bankAccount}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            bankAccount: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={formState.bankName}
                        onChange={(e) =>
                          setFormState({ ...formState, bankName: e.target.value })
                        }
                        placeholder="e.g., J&K Bank, SBI"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Bank Branch
                      </label>
                      <input
                        type="text"
                        value={formState.bankBranch}
                        onChange={(e) =>
                          setFormState({ ...formState, bankBranch: e.target.value })
                        }
                        placeholder="Branch name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        value={formState.ifscCode}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            ifscCode: e.target.value
                              .replace(/[^a-zA-Z0-9]/g, '')
                              .toUpperCase(),
                          })
                        }
                        placeholder="e.g., JAKA0WARPOR"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm uppercase text-slate-100 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex flex-col justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-200">
                        <input
                          type="checkbox"
                          checked={formState.bpl}
                          onChange={(e) =>
                            setFormState({ ...formState, bpl: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                        />
                        <span>BPL (Below Poverty Line)</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-200">
                        <input
                          type="checkbox"
                          checked={formState.aay}
                          onChange={(e) =>
                            setFormState({ ...formState, aay: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                        />
                        <span>AAY (Antyodaya Anna Yojana)</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Address
                      </label>
                      <textarea
                        rows={2}
                        value={formState.adress}
                        onChange={(e) =>
                          setFormState({ ...formState, adress: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                        Remarks
                      </label>
                      <textarea
                        rows={2}
                        value={formState.remarks}
                        onChange={(e) =>
                          setFormState({ ...formState, remarks: e.target.value })
                        }
                        placeholder="Notes or remarks"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="cursor-pointer rounded-xl border border-cyan-400/80 bg-cyan-950/80 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:bg-cyan-900 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Read-Only Profile Cards Grid */
                <div className="grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">PEN</span>
                    <span className="mt-1 block font-mono text-sm font-bold text-cyan-300">
                      {student.pen}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Student Name
                    </span>
                    <span className="mt-1 block text-sm font-bold text-slate-100">
                      {student.name}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Gender
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.gender || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Father&apos;s Name
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.father_name || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Mother&apos;s Name
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.mother_name || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Date of Birth
                    </span>
                    <span className="mt-1 block font-mono text-sm text-slate-200">
                      {formatDisplayDate(student.dob)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Current Class
                    </span>
                    <span className="mt-1 block text-sm font-bold text-fuchsia-300">
                      {formatClassLabel(student.class)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Previous Class
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {formatClassLabel(student.prev_class)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Enrollment Status
                    </span>
                    <span className="mt-1 block font-mono text-sm font-bold uppercase text-emerald-300">
                      {student.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Admission No &amp; Date
                    </span>
                    <span className="mt-1 block font-mono text-sm text-slate-200">
                      {student.admission_number || 'N/A'} (
                      {formatDisplayDate(student.admission_date)})
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Phone Number
                    </span>
                    <span className="mt-1 block font-mono text-sm text-slate-200">
                      {student.phone || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Aadhaar Number
                    </span>
                    <span className="mt-1 block font-mono text-sm text-slate-200">
                      {student.aadhaar || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-amber-500/25 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-amber-400">
                      Bank Account Number
                    </span>
                    <span className="mt-1 block font-mono text-sm text-slate-200">
                      {student.bankAccount || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-amber-500/25 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-amber-400">
                      Bank Name
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.bankName || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-amber-500/25 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-amber-400">
                      Bank Branch &amp; IFSC
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.bankBranch || 'N/A'}{' '}
                      {student.ifscCode ? (
                        <span className="font-mono text-cyan-300">({student.ifscCode})</span>
                      ) : (
                        ''
                      )}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Welfare Categories
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      BPL: <strong>{student.bpl ? 'Yes' : 'No'}</strong> • AAY:{' '}
                      <strong>{student.aay ? 'Yes' : 'No'}</strong>
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5 sm:col-span-2">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Residential Address
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.adress || 'N/A'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5 sm:col-span-3">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Remarks
                    </span>
                    <span className="mt-1 block text-sm text-slate-200">
                      {student.remarks || 'No remarks recorded'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESULT 2026 MARKS SHEET */}
          {activeTab === 'result' && (
            <div>
              {resultLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500/30 border-t-fuchsia-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                    Fetching 2026 Marks Sheet...
                  </p>
                </div>
              ) : resultError ? (
                <p className="py-10 text-center text-sm text-rose-300">{resultError}</p>
              ) : !resultData ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No Result 2026 record found for PEN {student.pen}.
                </p>
              ) : (
                <div className="mx-auto max-w-3xl space-y-4">
                  <div ref={marksheetRef}>
                    <div
                      className="rounded-lg border border-gray-300 bg-white p-6 text-black shadow-md"
                      style={{
                        backgroundImage: watermarkSvg,
                        backgroundRepeat: 'repeat',
                        backgroundPosition: '0 0',
                      }}
                    >
                      <div className="mb-6 border-b border-gray-300 pb-4 text-center">
                        <h1 className="text-2xl font-bold text-black">
                          Government Middle School Warpora
                        </h1>
                        <p className="mt-1 text-xs font-semibold text-gray-700 sm:text-sm">
                          UDISE: 01011301201 &nbsp;|&nbsp; Email: upswarpora@gmail.com
                        </p>
                        <p className="mt-2 text-lg font-bold uppercase tracking-wide text-black">
                          Marks Sheet
                        </p>
                      </div>

                      <div className="mb-6 grid grid-cols-2 gap-3 text-sm text-black sm:text-base">
                        <p>
                          <strong>Name:</strong> {student.name}
                        </p>
                        <p>
                          <strong>Parentage:</strong> {student.father_name || 'N/A'}
                        </p>
                        <p>
                          <strong>DOB:</strong> {formatDisplayDate(student.dob)}
                        </p>
                        <p>
                          <strong>Class:</strong> {formatClassLabel(student.prev_class)}
                        </p>
                        <p>
                          <strong>PEN:</strong> {student.pen}
                        </p>
                        <p>
                          <strong>Session:</strong> 2026
                        </p>
                      </div>

                      <table className="mb-6 w-full border border-gray-400 text-left text-black">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border border-gray-400 px-4 py-2 font-bold text-black">
                              Subject
                            </th>
                            <th className="border border-gray-400 px-4 py-2 font-bold text-black">
                              Max Marks
                            </th>
                            <th className="border border-gray-400 px-4 py-2 font-bold text-black">
                              Marks Obtained
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((sub) => (
                            <tr key={sub.key}>
                              <td className="border border-gray-400 px-4 py-2 text-black">
                                {sub.label}
                              </td>
                              <td className="border border-gray-400 px-4 py-2 text-black">100</td>
                              <td className="border border-gray-400 px-4 py-2 font-medium text-black">
                                {typeof sub.marks === 'number' ? sub.marks : 'AB'}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td className="border border-gray-400 px-4 py-2" />
                            <td className="border border-gray-400 px-4 py-2 font-bold text-black">
                              Result
                            </td>
                            <td className="border border-gray-400 px-4 py-2 font-bold text-black">
                              Pass
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="flex flex-wrap justify-between gap-2 font-semibold text-black">
                        <p>Max Marks: {maxTotalMarks}</p>
                        <p>Grand Total: {displayedTotal ?? 'N/A'}</p>
                        <p>
                          Percentage:{' '}
                          {typeof displayedPercentage === 'number'
                            ? `${displayedPercentage}%`
                            : 'N/A'}
                        </p>
                      </div>

                      <hr className="mt-4 border-slate-400" />
                      <div className="mt-20 flex justify-end pr-8">
                        <span className="h-10 w-36" />
                      </div>
                      <div className="mt-1 flex justify-between px-8 font-semibold text-black">
                        <p>Examination Incharge</p>
                        <p>Headmaster</p>
                      </div>

                      <div className="mt-6 flex flex-col items-center text-center text-black">
                        <p className="mb-1.5 text-xs font-medium">Scan to verify:</p>
                        <QRCode
                          value={`https://upswarpora.vercel.app/result?pen=${encodeURIComponent(
                            student.pen
                          )}`}
                          size={104}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => handlePrintMarksheet()}
                      className="cursor-pointer rounded-xl border border-fuchsia-400/70 bg-fuchsia-950/70 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.35)] transition hover:bg-fuchsia-900/80"
                    >
                      Print Marks Sheet
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BONAFIDE CERTIFICATE */}
          {activeTab === 'bonafide' && (
            <div className="mx-auto max-w-3xl space-y-4">
              <div ref={bonafideRef}>
                <div
                  className="rounded-lg border border-gray-300 bg-white p-6 text-black shadow-md"
                  style={{
                    backgroundImage: watermarkSvg,
                    backgroundRepeat: 'repeat',
                    backgroundPosition: '0 0',
                  }}
                >
                  <div className="mb-6 border-b border-gray-300 pb-4 text-center">
                    <h1 className="text-2xl font-bold text-black">
                      Government Middle School Warpora
                    </h1>
                    <p className="mt-1 text-xs font-semibold text-gray-700 sm:text-sm">
                      UDISE: 01011301201 &nbsp;|&nbsp; Email: upswarpora@gmail.com
                    </p>
                    <p className="mt-2 text-lg font-bold uppercase tracking-wide text-black">
                      Bonafide Certificate
                    </p>
                  </div>

                  <div className="mb-6 flex justify-between text-sm font-semibold text-black">
                    <p>
                      <strong>Ref No:</strong> GMSW/BON/{new Date().getFullYear()}/
                      {student.admission_number || '001'}
                    </p>
                    <p>
                      <strong>Date:</strong> {todayFormatted}
                    </p>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-3 rounded border border-gray-300 bg-gray-50/70 p-3.5 text-sm text-black">
                    <p>
                      <strong>Name:</strong> {student.name}
                    </p>
                    <p>
                      <strong>Father&apos;s Name:</strong> {student.father_name || 'N/A'}
                    </p>
                    <p>
                      <strong>Mother&apos;s Name:</strong> {student.mother_name || 'N/A'}
                    </p>
                    <p>
                      <strong>DOB:</strong> {formatDisplayDate(student.dob)}
                    </p>
                    <p>
                      <strong>Class:</strong> {formatClassLabel(student.class)}
                    </p>
                    <p>
                      <strong>Admission No:</strong> {student.admission_number || 'N/A'}
                    </p>
                    <p>
                      <strong>PEN:</strong> {student.pen}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className="uppercase">{student.status || 'ACTIVE'}</span>
                    </p>
                  </div>

                  <div className="space-y-4 text-justify text-sm leading-7 text-black sm:text-base">
                    <p>
                      This is to certify that{' '}
                      <strong className="uppercase underline decoration-dotted">
                        {student.name}
                      </strong>
                      , {student.gender === 'Female' ? 'daughter' : 'son'} of{' '}
                      <strong className="uppercase underline decoration-dotted">
                        {student.father_name || '____________________'}
                      </strong>{' '}
                      and{' '}
                      <strong className="uppercase underline decoration-dotted">
                        {student.mother_name || '____________________'}
                      </strong>
                      , resident of{' '}
                      <strong className="underline decoration-dotted">
                        {student.adress || 'Warpora'}
                      </strong>
                      , is a bonafide student of this institution currently studying in{' '}
                      <strong>{formatClassLabel(student.class)}</strong> under Admission Number{' '}
                      <strong>{student.admission_number || 'N/A'}</strong> (dated{' '}
                      <strong>{formatDisplayDate(student.admission_date)}</strong>) and Permanent
                      Education Number (PEN) <strong>{student.pen}</strong>.
                    </p>

                    <p>
                      As per the school admission register,{' '}
                      {student.gender === 'Female' ? 'her' : 'his'} Date of Birth is{' '}
                      <strong className="underline decoration-dotted">
                        {formatDisplayDate(student.dob)}
                      </strong>
                      . {student.gender === 'Female' ? 'She' : 'He'} bears a good moral character
                      during {student.gender === 'Female' ? 'her' : 'his'} stay in this school.
                    </p>
                  </div>

                  <hr className="mt-6 border-slate-400" />
                  <div className="mt-20 flex justify-end pr-8">
                    <span className="h-10 w-36" />
                  </div>
                  <div className="mt-1 flex justify-between px-8 font-semibold text-black">
                    <p>Admission Incharge</p>
                    <p>Headmaster</p>
                  </div>

                  <div className="mt-6 flex flex-col items-center text-center text-black">
                    <p className="mb-1.5 text-xs font-medium">Scan to verify:</p>
                    <QRCode
                      value={`https://upswarpora.vercel.app/result?pen=${encodeURIComponent(
                        student.pen
                      )}&doc=bonafide`}
                      size={104}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handlePrintBonafide()}
                  className="cursor-pointer rounded-xl border border-emerald-400/70 bg-emerald-950/70 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.35)] transition hover:bg-emerald-900/80"
                >
                  Print Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}