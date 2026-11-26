'use server';

import { revalidatePath } from 'next/cache';
import { sanityClient } from '@/lib/sanity';

export type StudentStatus = 'active' | 'struck off' | 'left with DC' | 'left without DC';

const ALLOWED_STATUSES: StudentStatus[] = [
  'active',
  'struck off',
  'left with DC',
  'left without DC',
];

export async function updateStudentStatus(studentId: string, newStatus: StudentStatus) {
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