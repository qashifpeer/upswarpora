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

// Helper: Normalize Excel class strings to match Sanity schema values
function normalizeClass(rawClass: any): string {
  if (!rawClass) return '';
  const str = String(rawClass).trim().toLowerCase();

  // Handle Pre-Primary variations
  if (['pre-primary', 'pre primary', 'nursery', 'lkg', 'ukg', 'pp', 'kg', 'balvatika'].includes(str)) {
    return 'Pre-Primary';
  }

  // Handle Roman numerals
  const romanMap: Record<string, string> = {
    i: '1',
    ii: '2',
    iii: '3',
    iv: '4',
    v: '5',
    vi: '6',
    vii: '7',
    viii: '8',
  };
  const cleanedRoman = str.replace(/^class\s*/i, '').trim();
  if (romanMap[cleanedRoman]) {
    return romanMap[cleanedRoman];
  }

  // Extract digits from "Class 4", "4th", "04", etc.
  const digitMatch = str.match(/(\d+)/);
  if (digitMatch) {
    return String(parseInt(digitMatch[1], 10)); // Converts "04" or "4th" -> "4"
  }

  return String(rawClass).trim();
}

// Helper: Strictly convert Excel serial numbers, JS Dates, or various string formats to YYYY-MM-DD
function formatExcelDate(excelDate: any): string | undefined {
  if (excelDate === null || excelDate === undefined || String(excelDate).trim() === '') {
    return undefined;
  }

  // 1. Handle Excel serial numbers (e.g., 44562)
  if (typeof excelDate === 'number') {
    const parsed = XLSX.SSF.parse_date_code(excelDate);
    if (!parsed) return undefined;
    const yyyy = parsed.y;
    const mm = String(parsed.m).padStart(2, '0');
    const dd = String(parsed.d).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // 2. Handle JS Date objects
  if (excelDate instanceof Date && !isNaN(excelDate.getTime())) {
    return excelDate.toISOString().split('T')[0];
  }

  const str = String(excelDate).trim();

  // 3. Handle DD-MM-YYYY, DD/MM/YYYY, or DD.MM.YYYY (with 1 or 2 digit day/month)
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const [, dd, mm, yyyy] = dmyMatch;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  // 4. Handle YYYY-MM-DD or YYYY/MM/DD (strips trailing timestamps like "2016-05-14 00:00:00")
  const ymdMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (ymdMatch) {
    const [, yyyy, mm, dd] = ymdMatch;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  console.warn(`Unrecognized date format skipped: "${str}"`);
  return undefined;
}

// Helper: Convert "Yes", "True", "1", "Y" to boolean
function parseBoolean(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (!val) return false;
  const normalized = String(val).trim().toLowerCase();
  return ['yes', 'true', '1', 'y'].includes(normalized);
}

async function uploadStudentsFromExcel(filePath: string) {
  try {
    console.log(`Reading Excel file from: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON array
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      console.log('No rows found in the Excel sheet.');
      return;
    }

    console.log(`Found ${rows.length} student records. Preparing transaction...`);

    const transaction = client.transaction();

    rows.forEach((row, index) => {
      const pen = String(row.pen || '').trim();
      const admissionNo = String(row.admission_number || '').trim();

      if (!pen || !row.name) {
        console.warn(`Skipping row ${index + 2}: Missing PEN or Student Name`);
        return;
      }

      // Deterministic _id prevents duplicate uploads if you re-run the script
      const docId = `student-${pen.replace(/[^a-zA-Z0-9_-]/g, '')}`;

      const studentDoc = {
        _id: docId,
        _type: 'masterData',
        pen: pen,
        name: String(row.name || '').trim(),
        father_name: String(row.father_name || '').trim(),
        mother_name: String(row.mother_name || '').trim(),
        dob: formatExcelDate(row.dob),
        class: normalizeClass(row.class),
        gender: String(row.gender || '').trim(),
        aadhaar: row.aadhaar ? String(row.aadhaar).replace(/\s+/g, '') : undefined,
        adress: row.adress ? String(row.adress).trim() : undefined,
        phone: row.phone ? String(row.phone).trim() : undefined,
        bpl: parseBoolean(row.bpl),
        aay: parseBoolean(row.aay),
        admission_number: admissionNo,
        admission_date: formatExcelDate(row.admission_date),
        prev_class: row.prev_class ? normalizeClass(row.prev_class) : undefined,
      };

      // createOrReplace updates existing records with the same PEN or creates new ones
      transaction.createOrReplace(studentDoc);
    });

    console.log('Committing batch upload to Sanity...');
    const result = await transaction.commit();
    console.log(`Success! Uploaded/updated ${result.results.length} records.`);
  } catch (error) {
    console.error('Error uploading student data:', error);
    process.exit(1);
  }
}

// Run script: npx tsx scripts/uploadStudents.ts ./students.xlsx
const excelFilePath = process.argv[2] || path.resolve(process.cwd(), 'students.xlsx');
uploadStudentsFromExcel(excelFilePath);