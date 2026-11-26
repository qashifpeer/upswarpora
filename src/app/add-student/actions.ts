'use server';

import { revalidatePath } from 'next/cache';
import { sanityClient } from '@/lib/sanity';
import { isAuthenticated } from '@/lib/auth';

async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error('Unauthorized: Staff authentication required.');
  }
}

export interface ExistingStudentRecord {
  _id: string;
  pen: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  dob?: string;
  class?: string;
  gender?: string;
  phone?: string;
  adress?: string;
  admission_number?: string;
  admission_date?: string;
  prev_class?: string;
  status?: string;
}

export interface NewStudentPayload {
  pen: string;
  name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  class: string;
  gender: string;
  aadhaar?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  adress?: string;
  phone?: string;
  bpl: boolean;
  aay: boolean;
  admission_number: string;
  admission_date: string;
  prev_class?: string;
  status: 'active' | 'struck off' | 'left with DC' | 'left without DC';
  remarks?: string;
}

const VALID_CLASSES = new Set([
  'Pre-Primary',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  'Pool',
]);

const VALID_STATUSES = new Set([
  'active',
  'struck off',
  'left with DC',
  'left without DC',
]);

function normalizeClassValue(raw?: string): string {
  if (!raw) return 'Pre-Primary';
  const cleaned = raw.trim();
  if (/^(kg|pre-primary|nursery|lkg|ukg)$/i.test(cleaned)) return 'Pre-Primary';
  if (/^pool/i.test(cleaned)) return 'Pool';
  const digits = cleaned.replace(/^class\s*/i, '').trim();
  return VALID_CLASSES.has(digits) ? digits : 'Pre-Primary';
}

function normalizePrevClassValue(raw?: string): string {
  if (!raw || /^none$/i.test(raw.trim())) return 'None';
  const cleaned = raw.trim();
  if (/^(kg|pre-primary|nursery|lkg|ukg)$/i.test(cleaned)) return 'Pre-Primary';
  const digits = cleaned.replace(/^class\s*/i, '').trim();
  return ['1', '2', '3', '4', '5', '6', '7', '8'].includes(digits) ? digits : 'None';
}

function normalizeStatusValue(
  raw?: string
): 'active' | 'struck off' | 'left with DC' | 'left without DC' {
  if (!raw) return 'active';
  const lower = raw.trim().toLowerCase();
  if (lower === 'struck off') return 'struck off';
  if (lower === 'left with dc') return 'left with DC';
  if (lower === 'left without dc') return 'left without DC';
  return 'active';
}

function normalizeGenderValue(raw?: string): string {
  if (!raw) return 'Male';
  const lower = raw.trim().toLowerCase();
  if (lower.startsWith('f')) return 'Female';
  if (lower.startsWith('o')) return 'Other';
  return 'Male';
}

export async function checkStudentByPen(
  pen: string
): Promise<ExistingStudentRecord | null> {
  await requireAuth();

  const cleanedPen = pen.trim();
  if (!cleanedPen) return null;

  const query = `*[_type == "masterData" && pen == $pen][0]{
    _id,
    pen,
    name,
    father_name,
    mother_name,
    dob,
    class,
    gender,
    phone,
    adress,
    admission_number,
    admission_date,
    prev_class,
    "status": coalesce(status, "active")
  }`;

  return sanityClient.fetch<ExistingStudentRecord | null>(
    query,
    { pen: cleanedPen },
    { cache: 'no-store' }
  );
}

export async function createMasterStudent(payload: NewStudentPayload): Promise<{
  success: boolean;
  duplicate?: ExistingStudentRecord;
  error?: string;
}> {
  await requireAuth();

  const cleanedPen = payload.pen?.trim();
  if (
    !cleanedPen ||
    !payload.name?.trim() ||
    !payload.father_name?.trim() ||
    !payload.mother_name?.trim() ||
    !payload.dob ||
    !payload.class ||
    !payload.gender ||
    !payload.admission_number?.trim() ||
    !payload.admission_date
  ) {
    return {
      success: false,
      error: 'Please fill in all required fields marked with *.',
    };
  }

  const existing = await checkStudentByPen(cleanedPen);
  if (existing) {
    return {
      success: false,
      duplicate: existing,
      error: `Student with PEN ${cleanedPen} is already registered in Master Data.`,
    };
  }

  const newDoc = {
    _type: 'masterData',
    pen: cleanedPen,
    name: payload.name.trim(),
    father_name: payload.father_name.trim(),
    mother_name: payload.mother_name.trim(),
    dob: payload.dob,
    class: payload.class,
    gender: payload.gender,
    aadhaar: payload.aadhaar ? payload.aadhaar.replace(/\s+/g, '') : undefined,
    bankAccount: payload.bankAccount
      ? payload.bankAccount.replace(/\s+/g, '')
      : undefined,
    bankName: payload.bankName?.trim() || undefined,
    bankBranch: payload.bankBranch?.trim() || undefined,
    ifscCode: payload.ifscCode
      ? payload.ifscCode.replace(/\s+/g, '').toUpperCase()
      : undefined,
    adress: payload.adress?.trim() || undefined,
    phone: payload.phone?.trim() || undefined,
    bpl: Boolean(payload.bpl),
    aay: Boolean(payload.aay),
    admission_number: payload.admission_number.trim(),
    admission_date: payload.admission_date,
    prev_class: payload.prev_class || 'None',
    status: VALID_STATUSES.has(payload.status) ? payload.status : 'active',
    promotionStatus: 'none',
    remarks: payload.remarks?.trim() || undefined,
  };

  await sanityClient.create(newDoc);

  revalidatePath('/all-students');
  revalidatePath('/fetch-detail');
  revalidatePath('/');

  return { success: true };
}

export async function bulkUpsertMasterStudents(
  rows: Partial<NewStudentPayload>[]
): Promise<{
  success: boolean;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  error?: string;
}> {
  await requireAuth();

  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      success: false,
      createdCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      error: 'No valid rows found in the uploaded Excel file.',
    };
  }

  // Fetch existing PEN -> _id map so matching PENs are updated in place
  const existingDocs = await sanityClient.fetch<{ _id: string; pen: string }[]>(
    `*[_type == "masterData" && defined(pen)]{ _id, pen }`,
    {},
    { cache: 'no-store' }
  );

  const penToIdMap = new Map<string, string>();
  for (const doc of existingDocs) {
    if (doc.pen) {
      penToIdMap.set(doc.pen.trim(), doc._id);
    }
  }

  const tx = sanityClient.transaction();
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    const cleanedPen = String(row.pen || '').trim();
    const cleanedName = String(row.name || '').trim();

    if (!cleanedPen || !cleanedName) {
      skippedCount++;
      continue;
    }

    const fieldsToSet: Record<string, any> = {
      pen: cleanedPen,
      name: cleanedName,
    };

    if (row.father_name !== undefined && String(row.father_name).trim() !== '') {
      fieldsToSet.father_name = String(row.father_name).trim();
    }
    if (row.mother_name !== undefined && String(row.mother_name).trim() !== '') {
      fieldsToSet.mother_name = String(row.mother_name).trim();
    }
    if (row.dob && /^\d{4}-\d{2}-\d{2}$/.test(String(row.dob).trim())) {
      fieldsToSet.dob = String(row.dob).trim();
    }
    if (row.class !== undefined && String(row.class).trim() !== '') {
      fieldsToSet.class = normalizeClassValue(String(row.class));
    }
    if (row.gender !== undefined && String(row.gender).trim() !== '') {
      fieldsToSet.gender = normalizeGenderValue(String(row.gender));
    }
    if (row.aadhaar !== undefined && String(row.aadhaar).trim() !== '') {
      fieldsToSet.aadhaar = String(row.aadhaar).replace(/\D/g, '');
    }
    if (row.bankAccount !== undefined && String(row.bankAccount).trim() !== '') {
      fieldsToSet.bankAccount = String(row.bankAccount).replace(/\D/g, '');
    }
    if (row.bankName !== undefined && String(row.bankName).trim() !== '') {
      fieldsToSet.bankName = String(row.bankName).trim();
    }
    if (row.bankBranch !== undefined && String(row.bankBranch).trim() !== '') {
      fieldsToSet.bankBranch = String(row.bankBranch).trim();
    }
    if (row.ifscCode !== undefined && String(row.ifscCode).trim() !== '') {
      fieldsToSet.ifscCode = String(row.ifscCode)
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
    }
    if (row.adress !== undefined && String(row.adress).trim() !== '') {
      fieldsToSet.adress = String(row.adress).trim();
    }
    if (row.phone !== undefined && String(row.phone).trim() !== '') {
      fieldsToSet.phone = String(row.phone).replace(/\D/g, '');
    }
    if (typeof row.bpl === 'boolean') {
      fieldsToSet.bpl = row.bpl;
    }
    if (typeof row.aay === 'boolean') {
      fieldsToSet.aay = row.aay;
    }
    if (
      row.admission_number !== undefined &&
      String(row.admission_number).trim() !== ''
    ) {
      fieldsToSet.admission_number = String(row.admission_number).trim();
    }
    if (
      row.admission_date &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(row.admission_date).trim())
    ) {
      fieldsToSet.admission_date = String(row.admission_date).trim();
    }
    if (row.prev_class !== undefined && String(row.prev_class).trim() !== '') {
      fieldsToSet.prev_class = normalizePrevClassValue(String(row.prev_class));
    }
    if (row.status !== undefined && String(row.status).trim() !== '') {
      fieldsToSet.status = normalizeStatusValue(String(row.status));
    }
    if (row.remarks !== undefined && String(row.remarks).trim() !== '') {
      fieldsToSet.remarks = String(row.remarks).trim();
    }

    const existingId = penToIdMap.get(cleanedPen);
    if (existingId) {
      tx.patch(existingId, (patch) => patch.set(fieldsToSet));
      updatedCount++;
    } else {
      tx.create({
        _type: 'masterData',
        class: 'Pre-Primary',
        gender: 'Male',
        bpl: false,
        aay: false,
        prev_class: 'None',
        status: 'active',
        promotionStatus: 'none',
        ...fieldsToSet,
      });
      createdCount++;
    }
  }

  if (createdCount > 0 || updatedCount > 0) {
    await tx.commit();
  }

  revalidatePath('/all-students');
  revalidatePath('/fetch-detail');
  revalidatePath('/');

  return {
    success: true,
    createdCount,
    updatedCount,
    skippedCount,
  };
}