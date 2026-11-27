'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';
import {
  searchStudentsByName,
  getPublicStudentAndResultByPen,
  type PublicStudentMatch,
  type Result2026Data,
} from './actions';

type ViewMode = 'result' | 'bonafide';

function formatDisplayDate(isoDate?: string) {
  if (!isoDate) return 'N/A';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatClassLabel(cls?: string) {
  if (!cls || cls === 'None') return 'N/A';
  if (cls === 'Pre-Primary') return 'Pre-Primary';
  return `Class ${cls}`;
}

function isClassSixOrHigher(studentClass?: string): boolean {
  if (!studentClass) return false;
  const numericClass = parseInt(studentClass.replace(/\D/g, ''), 10);
  return !isNaN(numericClass) && numericClass >= 6;
}

function getMarksheetSessionYear(currentSession?: string): string {
  const match = currentSession?.match(/\d{4}/);
  const baseYear = match ? parseInt(match[0], 10) : new Date().getFullYear();
  return String(baseYear - 1);
}

export default function ResultSearchClient({
  currentSession = '2026',
}: {
  currentSession?: string;
}) {
  const searchParams = useSearchParams();
  const initialPenParam = searchParams.get('pen') || '';
  const initialDocParam = searchParams.get('doc') === 'bonafide' ? 'bonafide' : 'result';

  const marksheetSession = getMarksheetSessionYear(currentSession);

  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<PublicStudentMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<PublicStudentMatch | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('result');
  const [resultData, setResultData] = useState<Result2026Data | null>(null);
  const [resultNotFound, setResultNotFound] = useState(false);

  const [isSearching, startSearchTransition] = useTransition();
  const [isLoadingSheet, startSheetTransition] = useTransition();

  const marksheetRef = useRef<HTMLDivElement>(null);
  const bonafideRef = useRef<HTMLDivElement>(null);

  const handlePrintMarksheet = useReactToPrint({
    contentRef: marksheetRef,
    documentTitle: selectedStudent
      ? `Marksheet_${marksheetSession}_${selectedStudent.pen}`
      : `Marksheet_${marksheetSession}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 12mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
      }
    `,
  });

  const handlePrintBonafide = useReactToPrint({
    contentRef: bonafideRef,
    documentTitle: selectedStudent
      ? `Bonafide_${currentSession}_${selectedStudent.pen}`
      : 'Bonafide_Certificate',
    pageStyle: `
      @page { size: A4 portrait; margin: 12mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
      }
    `,
  });

  // Auto-load student & document if accessed via QR code (?pen=...&doc=bonafide)
  useEffect(() => {
    if (!initialPenParam) return;
    startSheetTransition(async () => {
      const { student, result } = await getPublicStudentAndResultByPen(initialPenParam);
      if (student) {
        setSelectedStudent(student);
        setViewMode(initialDocParam);
        setResultData(result);
        setResultNotFound(!result);
      }
    });
  }, [initialPenParam, initialDocParam]);

  // Live debounced search as user types student name
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setMatches([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      startSearchTransition(async () => {
        const results = await searchStudentsByName(trimmed);
        setMatches(results);
        setHasSearched(true);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleViewResult = (student: PublicStudentMatch) => {
    setSelectedStudent(student);
    setViewMode('result');
    setResultData(null);
    setResultNotFound(false);

    startSheetTransition(async () => {
      const { result } = await getPublicStudentAndResultByPen(student.pen);
      setResultData(result);
      setResultNotFound(!result);
    });
  };

  const handleCreateBonafide = (student: PublicStudentMatch) => {
    setSelectedStudent(student);
    setViewMode('bonafide');
    setResultNotFound(false);
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Previous Class determines SST inclusion and 600 vs 500 max marks
  const examClass =
    selectedStudent?.prev_class && selectedStudent.prev_class !== 'None'
      ? selectedStudent.prev_class
      : selectedStudent?.class;
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
    <div className="space-y-8">
      {/* Search Box */}
      <div className="rounded-2xl border border-cyan-500/35 bg-slate-900/80 p-6 shadow-[0_0_30px_rgba(34,211,238,0.14)] backdrop-blur-md">
        <label
          htmlFor="student-name-search"
          className="block text-xs font-bold uppercase tracking-wider text-cyan-400"
        >
          Search Student by Name
        </label>

        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-cyan-400">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            id="student-name-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type student name (e.g., Aarav, Zoya, Adnan)..."
            className="w-full rounded-xl border border-cyan-500/40 bg-slate-950/90 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-100 placeholder-slate-500 shadow-[0_0_15px_rgba(34,211,238,0.12)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
          />

          {isSearching && (
            <span className="absolute inset-y-0 right-4 flex items-center">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
            </span>
          )}
        </div>

        {/* Matching Student Results List with View Result & Create Bonafide */}
        {matches.length > 0 && (
          <div className="mt-4 divide-y divide-slate-800 overflow-hidden rounded-xl border border-fuchsia-500/35 bg-slate-950/90">
            {matches.map((student) => {
              const isSelected = selectedStudent?._id === student._id;

              return (
                <div
                  key={student._id}
                  className={`flex flex-col justify-between gap-3 px-4 py-3.5 transition sm:flex-row sm:items-center ${
                    isSelected ? 'bg-slate-900/95' : 'hover:bg-cyan-500/[0.05]'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-100">{student.name}</p>
                      <span className="rounded-md border border-fuchsia-500/40 bg-fuchsia-950/60 px-2.5 py-0.5 text-[11px] font-bold text-fuchsia-300">
                        {formatClassLabel(student.class)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      S/O: {student.father_name || 'N/A'} • PEN:{' '}
                      <span className="font-mono text-cyan-300">{student.pen}</span>
                    </p>
                  </div>

                  {/* Action Buttons: View Result & Create Bonafide */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleViewResult(student)}
                      className={`cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        isSelected && viewMode === 'result'
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                          : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/70'
                      }`}
                    >
                      View Result →
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCreateBonafide(student)}
                      className={`cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        isSelected && viewMode === 'bonafide'
                          ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                          : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/70'
                      }`}
                    >
                      Create Bonafide
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasSearched && !isSearching && matches.length === 0 && (
          <p className="mt-4 text-center text-xs font-medium text-rose-300">
            No student found matching &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>

      {/* Loading Sheet Spinner */}
      {isLoadingSheet && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 py-14">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500/30 border-t-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.7)]" />
          <p className="text-sm font-medium text-fuchsia-300">Loading Document...</p>
        </div>
      )}

      {/* VIEW 1: MARKS SHEET */}
      {!isLoadingSheet && selectedStudent && viewMode === 'result' && (
        <>
          {resultNotFound ? (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/25 p-8 text-center">
              <p className="text-base font-bold text-rose-300">
                No Result {marksheetSession} record found for {selectedStudent.name} (PEN:{' '}
                {selectedStudent.pen})
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Please contact Government Middle School Warpora office if marks have not been
                published yet.
              </p>
            </div>
          ) : (
            resultData && (
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
                        <strong>Name:</strong> {selectedStudent.name}
                      </p>
                      <p>
                        <strong>Parentage:</strong> {selectedStudent.father_name || 'N/A'}
                      </p>
                      <p>
                        <strong>DOB:</strong> {formatDisplayDate(selectedStudent.dob)}
                      </p>
                      <p>
                        <strong>Class:</strong> {formatClassLabel(selectedStudent.prev_class)}
                      </p>
                      <p>
                        <strong>PEN:</strong> {selectedStudent.pen}
                      </p>
                      <p>
                        <strong>Session:</strong> {marksheetSession}
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
                          selectedStudent.pen
                        )}`}
                        size={104}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => handlePrintMarksheet()}
                    className="cursor-pointer rounded-xl border border-fuchsia-400/70 bg-fuchsia-950/70 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.35)] transition hover:bg-fuchsia-900/80"
                  >
                    Print Marks Sheet
                  </button>
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* VIEW 2: BONAFIDE CERTIFICATE */}
      {!isLoadingSheet && selectedStudent && viewMode === 'bonafide' && (
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
              {/* School Heading with UDISE & Email */}
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

              {/* Ref No & Date Row */}
              <div className="mb-6 flex justify-between text-sm font-semibold text-black">
                <p>
                  <strong>Ref No:</strong> GMSW/BON/{currentSession}/
                  {selectedStudent.admission_number || '001'}
                </p>
                <p>
                  <strong>Date:</strong> {todayFormatted}
                </p>
              </div>

              {/* Student Key Metadata Grid */}
              <div className="mb-6 grid grid-cols-2 gap-3 rounded border border-gray-300 bg-gray-50/70 p-3.5 text-sm text-black">
                <p>
                  <strong>Name:</strong> {selectedStudent.name}
                </p>
                <p>
                  <strong>Father&apos;s Name:</strong> {selectedStudent.father_name || 'N/A'}
                </p>
                <p>
                  <strong>Mother&apos;s Name:</strong> {selectedStudent.mother_name || 'N/A'}
                </p>
                <p>
                  <strong>DOB:</strong> {formatDisplayDate(selectedStudent.dob)}
                </p>
                <p>
                  <strong>Class:</strong> {formatClassLabel(selectedStudent.class)}
                </p>
                <p>
                  <strong>Admission No:</strong> {selectedStudent.admission_number || 'N/A'}
                </p>
                <p>
                  <strong>PEN:</strong> {selectedStudent.pen}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="uppercase">{selectedStudent.status || 'ACTIVE'}</span>
                </p>
              </div>

              {/* Certificate Body Text */}
              <div className="space-y-4 text-justify text-sm leading-7 text-black sm:text-base">
                <p>
                  This is to certify that{' '}
                  <strong className="uppercase underline decoration-dotted">
                    {selectedStudent.name}
                  </strong>
                  , {selectedStudent.gender === 'Female' ? 'daughter' : 'son'} of{' '}
                  <strong className="uppercase underline decoration-dotted">
                    {selectedStudent.father_name || '____________________'}
                  </strong>
                  , resident of{' '}
                  <strong className="underline decoration-dotted">
                    {selectedStudent.adress || 'Warpora'}
                  </strong>
                  , is a bonafide student of this institution for session {' '}
                  <strong>{currentSession}</strong>, studying in{' '}
                  <strong>{formatClassLabel(selectedStudent.class)}</strong> and with Permanent
                  Education Number (PEN) <strong>{selectedStudent.pen}</strong>.
                </p>

                <p>
                  As per the school admission register,{' '}
                  {selectedStudent.gender === 'Female' ? 'her' : 'his'} Date of Birth is{' '}
                  <strong className="underline decoration-dotted">
                    {formatDisplayDate(selectedStudent.dob)}
                  </strong>
                  . {selectedStudent.gender === 'Female' ? 'She' : 'He'} bears a good moral
                  character during {selectedStudent.gender === 'Female' ? 'her' : 'his'} stay in
                  this school.
                </p>
              </div>

              {/* Signature Block */}
              <hr className="mt-6 border-slate-400" />
              <div className="mt-20 flex justify-end pr-8">
                <span className="h-10 w-36" />
              </div>
              <div className="mt-1 flex justify-between px-8 font-semibold text-black">
                <p>Admission Incharge</p>
                <p>Headmaster</p>
              </div>

              {/* QR Code Verification */}
              <div className="mt-6 flex flex-col items-center text-center text-black">
                <p className="mb-1.5 text-xs font-medium">Scan to verify:</p>
                <QRCode
                  value={`https://upswarpora.vercel.app/result?pen=${encodeURIComponent(
                    selectedStudent.pen
                  )}&doc=bonafide`}
                  size={104}
                />
              </div>
            </div>
          </div>

          {/* Print Button */}
          <div className="mt-4 text-center">
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
  );
}