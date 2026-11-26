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

export type StudentStatus = 'active' | 'struck off' | 'left with DC' | 'left without DC';
export type PromotionActionState = 'none' | 'promoted' | 'retained';

export interface StudentUpdatePayload {
  pen: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  dob?: string;
  class: string;
  gender?: string;
  aadhaar?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  adress?: string;
  phone?: string;
  bpl?: boolean;
  aay?: boolean;
  admission_number?: string;
  admission_date?: string;
  prev_class?: string;
  status?: StudentStatus;
  remarks?: string;
}

export interface Result2026Data {
  _id: string;
  pen: string;
  name: string;
  english?: number;
  math?: number;
  science?: number;
  sst?: number;
  urdu?: number;
  kashmiri?: number;
  total?: number;
  percentage?: number;
}

const ALLOWED_STATUSES: StudentStatus[] = [
  'active',
  'struck off',
  'left with DC',
  'left without DC',
];

function getNextPromotionValues(currentClass: string): {
  nextClass: string;
  nextPrevClass: string;
} {
  const normalized = currentClass.trim();

  if (normalized === 'Pre-Primary') {
    return { nextClass: '1', nextPrevClass: 'Pre-Primary' };
  }

  const numeric = parseInt(normalized, 10);
  if (!isNaN(numeric)) {
    if (numeric >= 1 && numeric <= 7) {
      return {
        nextClass: String(numeric + 1),
        nextPrevClass: String(numeric),
      };
    }
    if (numeric === 8) {
      return {
        nextClass: 'Pool',
        nextPrevClass: '8',
      };
    }
  }

  throw new Error(`Student in "${currentClass}" cannot be promoted further.`);
}

// promote student function
export async function promoteStudent(studentId: string, currentClass: string) {
  await requireAuth();

  if (!studentId || !currentClass) {
    throw new Error('Student ID and current class are required.');
  }

  const { nextClass, nextPrevClass } = getNextPromotionValues(currentClass);

  await sanityClient
    .patch(studentId)
    .set({
      class: nextClass,
      prev_class: nextPrevClass,
      promotionStatus: 'promoted',
    })
    .commit();

  revalidatePath('/all-students');
  return {
    success: true,
    class: nextClass,
    prev_class: nextPrevClass,
    promotionStatus: 'promoted' as const,
  };
}

// retain student function
export async function retainStudent(studentId: string, currentClass: string) {
  await requireAuth();

  if (!studentId || !currentClass) {
    throw new Error('Student ID and current class are required.');
  }

  const normalizedClass = currentClass.trim();

  await sanityClient
    .patch(studentId)
    .set({
      class: normalizedClass,
      prev_class: normalizedClass,
      promotionStatus: 'retained',
    })
    .commit();

  revalidatePath('/all-students');
  return {
    success: true,
    class: normalizedClass,
    prev_class: normalizedClass,
    promotionStatus: 'retained' as const,
  };
}

// reset all promotion button
export async function resetAllPromotions() {
  await requireAuth();

  const frozenIds = await sanityClient.fetch<string[]>(
    `*[_type == "masterData" && promotionStatus in ["promoted", "retained"]]._id`,
    {},
    { cache: 'no-store' }
  );

  if (frozenIds.length > 0) {
    const tx = sanityClient.transaction();
    for (const id of frozenIds) {
      tx.patch(id, (patch) => patch.set({ promotionStatus: 'none' }));
    }
    await tx.commit();
  }

  revalidatePath('/all-students');
  return { success: true, resetCount: frozenIds.length };
}

// update students status
export async function updateStudentStatus(studentId: string, newStatus: StudentStatus) {
  await requireAuth();

  if (!studentId || !ALLOWED_STATUSES.includes(newStatus)) {
    throw new Error('Invalid student ID or status value');
  }

  await sanityClient
    .patch(studentId)
    .set({ status: newStatus })
    .commit();

  revalidatePath('/all-students');
  return { success: true, status: newStatus };
}

// updates students all details
export async function updateStudentDetails(
  studentId: string,
  payload: StudentUpdatePayload
) {
  await requireAuth();

  if (!studentId || !payload.pen?.trim() || !payload.name?.trim()) {
    throw new Error('Student ID, PEN, and Name are required');
  }

  const sanitizedData = {
    pen: payload.pen.trim(),
    name: payload.name.trim(),
    father_name: payload.father_name?.trim() || '',
    mother_name: payload.mother_name?.trim() || '',
    dob: payload.dob?.trim() || undefined,
    class: payload.class.trim(),
    gender: payload.gender?.trim() || undefined,
    aadhaar: payload.aadhaar ? payload.aadhaar.replace(/\s+/g, '') : undefined,
    bankAccount: payload.bankAccount ? payload.bankAccount.replace(/\s+/g, '') : undefined,
    bankName: payload.bankName?.trim() || undefined,
    bankBranch: payload.bankBranch?.trim() || undefined,
    ifscCode: payload.ifscCode
      ? payload.ifscCode.replace(/\s+/g, '').toUpperCase()
      : undefined,
    adress: payload.adress?.trim() || undefined,
    phone: payload.phone?.trim() || undefined,
    bpl: Boolean(payload.bpl),
    aay: Boolean(payload.aay),
    admission_number: payload.admission_number?.trim() || '',
    admission_date: payload.admission_date?.trim() || undefined,
    prev_class: payload.prev_class?.trim() || undefined,
    status: payload.status && ALLOWED_STATUSES.includes(payload.status) ? payload.status : 'active',
    remarks: payload.remarks?.trim() || undefined,
  };

  await sanityClient
    .patch(studentId)
    .set(sanitizedData)
    .commit();

  revalidatePath('/all-students');
  revalidatePath('/fetch-detail');
  return { success: true, updated: sanitizedData };
}

// searches student with pen
export async function getStudentResultByPen(pen: string): Promise<Result2026Data | null> {
  await requireAuth();

  if (!pen) return null;

  const query = `*[_type == "result2026" && pen == $pen][0]{
    _id,
    pen,
    name,
    english,
    math,
    science,
    sst,
    urdu,
    kashmiri,
    total,
    percentage
  }`;

  return sanityClient.fetch<Result2026Data | null>(
    query,
    { pen: pen.trim() },
    { cache: 'no-store' }
  );
}

// deletes the student
export async function deleteStudent(studentId: string, confirmationText: string) {
  await requireAuth();

  if (!studentId) {
    throw new Error('Student ID is required.');
  }

  const student = await sanityClient.fetch<{ _id: string; name?: string } | null>(
    `*[_type == "masterData" && _id == $id][0]{ _id, name }`,
    { id: studentId },
    { cache: 'no-store' }
  );

  if (!student || !student.name) {
    throw new Error('Student record not found.');
  }

  const firstName = student.name.trim().split(/\s+/)[0].toLowerCase();
  const expectedPhrase = `delete ${firstName}`;

  if (confirmationText.trim().toLowerCase() !== expectedPhrase) {
    throw new Error(`Confirmation failed. Please type "${expectedPhrase}" exactly.`);
  }

  await sanityClient.delete(studentId);

  revalidatePath('/all-students');
  revalidatePath('/fetch-detail');
  revalidatePath('/');

  return { success: true };
}