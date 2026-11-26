import * as XLSX from 'xlsx';
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN!, // Needs Editor/Write access
  useCdn: false,
});

// Helper: Safely parse numeric marks (returns undefined if blank or non-numeric like "AB")
function parseMark(val: any): number | undefined {
  if (val === null || val === undefined || String(val).trim() === '') {
    return undefined;
  }
  const num = Number(String(val).trim());
  return isNaN(num) ? undefined : num;
}

// Helper: Normalize object keys to lowercase so "English", "ENGLISH", or "english" all work
function normalizeRowKeys(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    normalized[key.trim().toLowerCase()] = row[key];
  }
  return normalized;
}

async function uploadResultsFromExcel(filePath: string) {
  try {
    console.log(`Reading Excel file from: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet);

    if (rawRows.length === 0) {
      console.log('No rows found in the Excel sheet.');
      return;
    }

    console.log(`Found ${rawRows.length} result records. Preparing transaction...`);

    const transaction = client.transaction();
    let validCount = 0;

    rawRows.forEach((rawRow, index) => {
      const row = normalizeRowKeys(rawRow);
      const pen = String(row.pen || '').trim();
      const name = String(row.name || '').trim();

      if (!pen || !name) {
        console.warn(`Skipping row ${index + 2}: Missing PEN or Student Name`);
        return;
      }

      const english = parseMark(row.english);
      const math = parseMark(row.math);
      const science = parseMark(row.science);
      const sst = parseMark(row.sst);
      const urdu = parseMark(row.urdu);
      const kashmiri = parseMark(row.kashmiri);

      // Collect entered subject marks to auto-calculate total & percentage if missing in Excel
      const subjectMarks = [english, math, science, sst, urdu, kashmiri].filter(
        (m): m is number => typeof m === 'number'
      );

      const calculatedTotal =
        subjectMarks.length > 0
          ? subjectMarks.reduce((sum, mark) => sum + mark, 0)
          : undefined;

      const total = parseMark(row.total) ?? calculatedTotal;

      // Assumes 100 max marks per entered subject if percentage isn't provided in Excel
      const calculatedPercentage =
        typeof total === 'number' && subjectMarks.length > 0
          ? Number(((total / (subjectMarks.length * 100)) * 100).toFixed(2))
          : undefined;

      const rawPct = parseMark(row.percentage);
      // Handle cases where Excel stores percentage as decimal (e.g., 0.855 instead of 85.5)
      const normalizedPct =
        typeof rawPct === 'number'
          ? rawPct <= 1 && rawPct > 0
            ? Number((rawPct * 100).toFixed(2))
            : Number(rawPct.toFixed(2))
          : calculatedPercentage;

      // Deterministic _id prevents duplicate result documents per student
      const docId = `result2026-${pen.replace(/[^a-zA-Z0-9_-]/g, '')}`;

      const resultDoc = {
        _id: docId,
        _type: 'result2026',
        pen,
        name,
        english,
        math,
        science,
        sst,
        urdu,
        kashmiri,
        total,
        percentage: normalizedPct,
      };

      transaction.createOrReplace(resultDoc);
      validCount++;
    });

    if (validCount === 0) {
      console.log('No valid records to upload.');
      return;
    }

    console.log(`Committing ${validCount} records to Sanity...`);
    const response = await transaction.commit();
    console.log(`Success! Uploaded/updated ${response.results.length} result2026 records.`);
  } catch (error) {
    console.error('Error uploading result2026 data:', error);
    process.exit(1);
  }
}

// Run script: npx tsx scripts/uploadResults2026.ts ./results2026.xlsx
const excelFilePath = process.argv[2] || path.resolve(process.cwd(), 'results2026.xlsx');
uploadResultsFromExcel(excelFilePath);