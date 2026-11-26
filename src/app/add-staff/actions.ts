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

export interface ExistingStaffRecord {
  _id: string;
  teacherCode?: string;
  firstName: string;
  lastName?: string;
  surname?: string;
  staffCategory?: string;
  designation?: string;
  natureOfEmployment?: string;
  onDeployment?: boolean;
  originalPlaceOfPosting?: string;
  panNumber?: string;
  phone?: string;
  email?: string;
}

export interface NewStaffPayload {
  teacherCode?: string;
  firstName: string;
  lastName?: string;
  surname?: string;
  staffCategory: 'Teaching' | 'Non-Teaching';
  designation: 'Teacher' | 'Head Teacher' | 'Aaya' | 'Cook' | 'Sweeper';
  natureOfEmployment: 'Permanent' | 'Temporary';
  onDeployment: boolean;
  originalPlaceOfPosting?: string;
  dob?: string;
  dateOfAppointment?: string;
  dateOfJoiningSchool?: string;
  panNumber?: string;
  phone?: string;
  email?: string;
  remarks?: string;
}

function normalizeStaffCategory(raw?: string): 'Teaching' | 'Non-Teaching' {
  if (!raw) return 'Teaching';
  return /non/i.test(raw.trim()) ? 'Non-Teaching' : 'Teaching';
}

function normalizeDesignation(
  raw?: string
): 'Teacher' | 'Head Teacher' | 'Aaya' | 'Cook' | 'Sweeper' {
  if (!raw) return 'Teacher';
  const lower = raw.trim().toLowerCase();
  if (lower.includes('head')) return 'Head Teacher';
  if (lower.includes('aaya') || lower.includes('aya')) return 'Aaya';
  if (lower.includes('cook')) return 'Cook';
  if (lower.includes('sweep')) return 'Sweeper';
  return 'Teacher';
}

function normalizeEmploymentNature(raw?: string): 'Permanent' | 'Temporary' {
  if (!raw) return 'Permanent';
  return /temp/i.test(raw.trim()) ? 'Temporary' : 'Permanent';
}

export async function checkExistingStaff(params: {
  teacherCode?: string;
  panNumber?: string;
}): Promise<ExistingStaffRecord | null> {
  await requireAuth();

  const code = params.teacherCode?.trim();
  const pan = params.panNumber?.replace(/\s+/g, '').toUpperCase();

  if (!code && !pan) return null;

  const conditions: string[] = [];
  const queryParams: Record<string, string> = {};

  if (code) {
    conditions.push('teacherCode == $code');
    queryParams.code = code;
  }
  if (pan && pan.length === 10) {
    conditions.push('upper(panNumber) == $pan');
    queryParams.pan = pan;
  }

  if (conditions.length === 0) return null;

  const query = `*[_type == "staffMasterData" && (${conditions.join(' || ')})][0]{
    _id,
    teacherCode,
    firstName,
    lastName,
    surname,
    staffCategory,
    designation,
    natureOfEmployment,
    "onDeployment": coalesce(onDeployment, false),
    originalPlaceOfPosting,
    panNumber,
    phone,
    email
  }`;

  return sanityClient.fetch<ExistingStaffRecord | null>(query, queryParams, {
    cache: 'no-store',
  });
}

export async function createMasterStaff(payload: NewStaffPayload): Promise<{
  success: boolean;
  duplicate?: ExistingStaffRecord;
  error?: string;
}> {
  await requireAuth();

  const cleanedFirstName = payload.firstName?.trim();
  if (!cleanedFirstName || !payload.designation || !payload.staffCategory) {
    return {
      success: false,
      error: 'First Name, Staff Category, and Designation are required.',
    };
  }

  if (payload.onDeployment && !payload.originalPlaceOfPosting?.trim()) {
    return {
      success: false,
      error: 'Original Place of Posting is required when staff is on deployment.',
    };
  }

  const cleanedCode = payload.teacherCode?.trim() || undefined;
  const cleanedPan = payload.panNumber
    ? payload.panNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    : undefined;

  const existing = await checkExistingStaff({
    teacherCode: cleanedCode,
    panNumber: cleanedPan,
  });

  if (existing) {
    return {
      success: false,
      duplicate: existing,
      error: 'A staff record with this Teacher Code or PAN Number already exists.',
    };
  }

  const newDoc = {
    _type: 'staffMasterData',
    teacherCode: cleanedCode,
    firstName: cleanedFirstName,
    lastName: payload.lastName?.trim() || undefined,
    surname: payload.surname?.trim() || undefined,
    staffCategory: normalizeStaffCategory(payload.staffCategory),
    designation: normalizeDesignation(payload.designation),
    natureOfEmployment: normalizeEmploymentNature(payload.natureOfEmployment),
    onDeployment: Boolean(payload.onDeployment),
    originalPlaceOfPosting: payload.onDeployment
      ? payload.originalPlaceOfPosting?.trim() || undefined
      : undefined,
    dob: payload.dob?.trim() || undefined,
    dateOfAppointment: payload.dateOfAppointment?.trim() || undefined,
    dateOfJoiningSchool: payload.dateOfJoiningSchool?.trim() || undefined,
    panNumber: cleanedPan,
    phone: payload.phone ? payload.phone.replace(/\D/g, '') : undefined,
    email: payload.email?.trim() || undefined,
    remarks: payload.remarks?.trim() || undefined,
  };

  await sanityClient.create(newDoc);

  revalidatePath('/fetch-staff-detail');
  revalidatePath('/');

  return { success: true };
}

export async function bulkUpsertMasterStaff(
  rows: Partial<NewStaffPayload>[]
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

  const existingDocs = await sanityClient.fetch<
    { _id: string; teacherCode?: string; panNumber?: string }[]
  >(
    `*[_type == "staffMasterData"]{ _id, teacherCode, panNumber }`,
    {},
    { cache: 'no-store' }
  );

  const codeToIdMap = new Map<string, string>();
  const panToIdMap = new Map<string, string>();

  for (const doc of existingDocs) {
    if (doc.teacherCode?.trim()) {
      codeToIdMap.set(doc.teacherCode.trim().toLowerCase(), doc._id);
    }
    if (doc.panNumber?.trim()) {
      panToIdMap.set(doc.panNumber.trim().toUpperCase(), doc._id);
    }
  }

  const tx = sanityClient.transaction();
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    const cleanedFirstName = String(row.firstName || '').trim();
    if (!cleanedFirstName) {
      skippedCount++;
      continue;
    }

    const cleanedCode = row.teacherCode ? String(row.teacherCode).trim() : '';
    const cleanedPan = row.panNumber
      ? String(row.panNumber)
          .replace(/[^a-zA-Z0-9]/g, '')
          .toUpperCase()
      : '';

    const fieldsToSet: Record<string, any> = {
      firstName: cleanedFirstName,
    };

    if (cleanedCode) fieldsToSet.teacherCode = cleanedCode;
    if (row.lastName !== undefined && String(row.lastName).trim() !== '') {
      fieldsToSet.lastName = String(row.lastName).trim();
    }
    if (row.surname !== undefined && String(row.surname).trim() !== '') {
      fieldsToSet.surname = String(row.surname).trim();
    }
    if (row.staffCategory !== undefined && String(row.staffCategory).trim() !== '') {
      fieldsToSet.staffCategory = normalizeStaffCategory(String(row.staffCategory));
    }
    if (row.designation !== undefined && String(row.designation).trim() !== '') {
      fieldsToSet.designation = normalizeDesignation(String(row.designation));
    }
    if (
      row.natureOfEmployment !== undefined &&
      String(row.natureOfEmployment).trim() !== ''
    ) {
      fieldsToSet.natureOfEmployment = normalizeEmploymentNature(
        String(row.natureOfEmployment)
      );
    }
    if (typeof row.onDeployment === 'boolean') {
      fieldsToSet.onDeployment = row.onDeployment;
      if (!row.onDeployment) {
        fieldsToSet.originalPlaceOfPosting = undefined;
      }
    }
    if (
      row.originalPlaceOfPosting !== undefined &&
      String(row.originalPlaceOfPosting).trim() !== ''
    ) {
      fieldsToSet.originalPlaceOfPosting = String(row.originalPlaceOfPosting).trim();
    }
    if (row.dob && /^\d{4}-\d{2}-\d{2}$/.test(String(row.dob).trim())) {
      fieldsToSet.dob = String(row.dob).trim();
    }
    if (
      row.dateOfAppointment &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(row.dateOfAppointment).trim())
    ) {
      fieldsToSet.dateOfAppointment = String(row.dateOfAppointment).trim();
    }
    if (
      row.dateOfJoiningSchool &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(row.dateOfJoiningSchool).trim())
    ) {
      fieldsToSet.dateOfJoiningSchool = String(row.dateOfJoiningSchool).trim();
    }
    if (cleanedPan) fieldsToSet.panNumber = cleanedPan;
    if (row.phone !== undefined && String(row.phone).trim() !== '') {
      fieldsToSet.phone = String(row.phone).replace(/\D/g, '');
    }
    if (row.email !== undefined && String(row.email).trim() !== '') {
      fieldsToSet.email = String(row.email).trim();
    }
    if (row.remarks !== undefined && String(row.remarks).trim() !== '') {
      fieldsToSet.remarks = String(row.remarks).trim();
    }

    const matchedId =
      (cleanedCode && codeToIdMap.get(cleanedCode.toLowerCase())) ||
      (cleanedPan && panToIdMap.get(cleanedPan));

    if (matchedId) {
      tx.patch(matchedId, (patch) => patch.set(fieldsToSet));
      updatedCount++;
    } else {
      tx.create({
        _type: 'staffMasterData',
        staffCategory: 'Teaching',
        designation: 'Teacher',
        natureOfEmployment: 'Permanent',
        onDeployment: false,
        ...fieldsToSet,
      });
      createdCount++;
    }
  }

  if (createdCount > 0 || updatedCount > 0) {
    await tx.commit();
  }

  revalidatePath('/fetch-staff-detail');
  revalidatePath('/');

  return {
    success: true,
    createdCount,
    updatedCount,
    skippedCount,
  };
}