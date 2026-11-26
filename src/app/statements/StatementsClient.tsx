'use client';

import { useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ActiveRollStudent } from './actions';

interface ClassRollRow {
  classKey: string;
  classLabel: string;
  boys: number;
  girls: number;
  total: number;
}

const ORDERED_CLASSES: { key: string; label: string; isKg?: boolean }[] = [
  { key: 'Pre-Primary', label: 'KG (Pre-Primary)', isKg: true },
  { key: '1', label: '1st' },
  { key: '2', label: '2nd' },
  { key: '3', label: '3rd' },
  { key: '4', label: '4th' },
  { key: '5', label: '5th' },
  { key: '6', label: '6th' },
  { key: '7', label: '7th' },
  { key: '8', label: '8th' },
];

export default function StatementsClient({
  students,
}: {
  students: ActiveRollStudent[];
}) {
  const [includeKg, setIncludeKg] = useState<boolean>(true);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const currentMonthYear = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: `Roll_Statement_${currentMonthYear.replace(/\s+/g, '_')}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 14mm; }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: #ffffff !important;
        }
      }
    `,
  });

  // Compute Boys, Girls, and Total per class
  const rollRows: ClassRollRow[] = useMemo(() => {
    const activeDefs = ORDERED_CLASSES.filter((c) => includeKg || !c.isKg);

    return activeDefs.map((clsDef) => {
      let boys = 0;
      let girls = 0;

      for (const s of students) {
        if ((s.class || '').trim() !== clsDef.key) continue;
        const g = (s.gender || '').trim().toLowerCase();
        if (g === 'male' || g === 'boy') {
          boys++;
        } else if (g === 'female' || g === 'girl') {
          girls++;
        }
      }

      return {
        classKey: clsDef.key,
        classLabel: clsDef.label,
        boys,
        girls,
        total: boys + girls,
      };
    });
  }, [students, includeKg]);

  const finalTotals = useMemo(() => {
    return rollRows.reduce(
      (acc, row) => ({
        boys: acc.boys + row.boys,
        girls: acc.girls + row.girls,
        total: acc.total + row.total,
      }),
      { boys: 0, girls: 0, total: 0 }
    );
  }, [rollRows]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const refNo = `GMSW/ROLL/${new Date().getFullYear()}/${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}`;

    // Header Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('OFFICE OF THE HEAD TEACHER', pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(13);
    doc.text('GOVT MIDDLE SCHOOL WARPORA', pageWidth / 2, 25, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(
      'UDISE: 01011301201  |  Zone: Kupwara  |  Email: upswarpora@gmail.com',
      pageWidth / 2,
      31,
      { align: 'center' }
    );

    // Subtitle Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(
      `ROLL STATEMENT FOR THE MONTH OF ${currentMonthYear.toUpperCase()}`,
      pageWidth / 2,
      40,
      { align: 'center' }
    );

    doc.setLineWidth(0.5);
    doc.line(14, 44, pageWidth - 14, 44);

    // Ref No & Date
    doc.setFontSize(10);
    doc.text(`Ref No: ${refNo}`, 14, 51);
    doc.text(`Date: ${todayFormatted}`, pageWidth - 14, 51, { align: 'right' });

    // Table Body & Final Total Footer
    const bodyRows = rollRows.map((row, idx) => [
      String(idx + 1),
      row.classLabel,
      String(row.boys),
      String(row.girls),
      String(row.total),
    ]);

    autoTable(doc, {
      startY: 56,
      head: [['S.No', 'Class', 'Boys', 'Girls', 'Total']],
      body: bodyRows,
      foot: [
        [
          { content: 'Final Total', colSpan: 2, styles: { halign: 'right' } },
          String(finalTotals.boys),
          String(finalTotals.girls),
          String(finalTotals.total),
        ],
      ],
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10.5,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
        cellPadding: 3,
        halign: 'center',
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { halign: 'left' },
        2: { cellWidth: 28 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28, fontStyle: 'bold' },
      },
    });

    // Signatures below table
    const finalY = (doc as any).lastAutoTable?.finalY || 160;
    const signY = finalY + 26;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('Admission / Roll Incharge', 20, signY);
    doc.text('Head Teacher', pageWidth - 20, signY, { align: 'right' });

    doc.save(`GMS_Warpora_Roll_Statement_${currentMonthYear.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Include KG Checkbox + Download PDF & Print Buttons */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/35 bg-slate-900/80 p-5 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-md sm:flex-row sm:items-center print:hidden">
        {/* Include KG Checkbox */}
        <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-fuchsia-500/40 bg-slate-950/85 px-4 py-2.5 transition hover:border-fuchsia-400">
          <input
            type="checkbox"
            checked={includeKg}
            onChange={(e) => setIncludeKg(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-900 text-fuchsia-400 focus:ring-fuchsia-400"
          />
          <span className="text-xs font-extrabold uppercase tracking-wider text-fuchsia-200">
            Include KG (Pre-Primary)
          </span>
        </label>

        {/* Action Buttons: Download PDF & Print */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-400/80 bg-emerald-950/70 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.3)] transition hover:bg-emerald-900 hover:text-white hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
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
            <span>Download Roll Statement (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrint()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/80 bg-cyan-950/75 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.3)] transition hover:bg-cyan-900 hover:text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.55)]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Printable Official Roll Statement Sheet */}
      <div className="mx-auto max-w-3xl">
        <div
          ref={printAreaRef}
          className="rounded-xl border border-gray-300 bg-white p-6 text-black shadow-lg sm:p-10"
        >
          {/* Official School & Statement Headings */}
          <div className="mb-6 border-b-2 border-black pb-4 text-center">
            <h1 className="text-xl font-bold uppercase tracking-wide text-black sm:text-2xl">
              Office of the Head Teacher
            </h1>
            <h2 className="mt-1 text-lg font-extrabold uppercase tracking-wider text-black sm:text-xl">
              Govt Middle School Warpora
            </h2>
            <p className="mt-1 text-xs font-semibold text-gray-700">
              UDISE: 01011301201 &nbsp;|&nbsp; Zone: Mawar &nbsp;|&nbsp; Email:
              upswarpora@gmail.com
            </p>
            <div className="mt-3 inline-block border border-black bg-gray-100 px-4 py-1.5">
              <p className="text-sm font-bold uppercase tracking-wide text-black sm:text-base">
                Roll Statement for the Month of {currentMonthYear}
              </p>
            </div>
          </div>

          {/* Ref No & Date Row */}
          <div className="mb-4 flex justify-between text-xs font-semibold text-black sm:text-sm">
            <p>
              <strong>Ref No:</strong> GMSW/ROLL/{new Date().getFullYear()}/
              {String(new Date().getMonth() + 1).padStart(2, '0')}
            </p>
            <p>
              <strong>Date:</strong> {todayFormatted}
            </p>
          </div>

          {/* Roll Statement Table */}
          <table className="w-full border-collapse border border-black text-center text-sm text-black sm:text-base">
            <thead>
              <tr className="bg-gray-100 font-bold">
                <th className="w-20 border border-black px-3 py-2.5">S.No</th>
                <th className="border border-black px-4 py-2.5 text-left">Class</th>
                <th className="w-28 border border-black px-3 py-2.5">Boys</th>
                <th className="w-28 border border-black px-3 py-2.5">Girls</th>
                <th className="w-28 border border-black px-3 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {rollRows.map((row, index) => (
                <tr key={row.classKey}>
                  <td className="border border-black px-3 py-2 font-medium">
                    {index + 1}
                  </td>
                  <td className="border border-black px-4 py-2 text-left font-semibold">
                    {row.classLabel}
                  </td>
                  <td className="border border-black px-3 py-2">{row.boys}</td>
                  <td className="border border-black px-3 py-2">{row.girls}</td>
                  <td className="border border-black px-3 py-2 font-semibold">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-extrabold">
                <td colSpan={2} className="border border-black px-4 py-2.5 text-right uppercase">
                  Final Total
                </td>
                <td className="border border-black px-3 py-2.5">{finalTotals.boys}</td>
                <td className="border border-black px-3 py-2.5">{finalTotals.girls}</td>
                <td className="border border-black px-3 py-2.5">{finalTotals.total}</td>
              </tr>
            </tfoot>
          </table>

          {/* Signature Footer */}
          <div className="mt-20 flex justify-end px-4 text-sm font-bold text-black sm:px-8">
            {/* <p>Admission / Roll Incharge</p> */}
            <p>Head Teacher</p>
          </div>
        </div>
      </div>
    </div>
  );
}