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

export interface StaffUpdatePayload {
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

export async function updateStaffDetails(
  staffId: string,
  payload: StaffUpdatePayload
) {
  await requireAuth();

  if (!staffId || !payload.firstName?.trim()) {
    throw new Error('Staff ID and First Name are required.');
  }

  if (payload.onDeployment && !payload.originalPlaceOfPosting?.trim()) {
    throw new Error('Original Place of Posting is required when on deployment.');
  }

  const sanitizedData = {
    teacherCode: payload.teacherCode?.trim() || undefined,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName?.trim() || undefined,
    surname: payload.surname?.trim() || undefined,
    staffCategory: payload.staffCategory,
    designation: payload.designation,
    natureOfEmployment: payload.natureOfEmployment,
    onDeployment: Boolean(payload.onDeployment),
    originalPlaceOfPosting: payload.onDeployment
      ? payload.originalPlaceOfPosting?.trim() || undefined
      : undefined,
    dob: payload.dob?.trim() || undefined,
    dateOfAppointment: payload.dateOfAppointment?.trim() || undefined,
    dateOfJoiningSchool: payload.dateOfJoiningSchool?.trim() || undefined,
    panNumber: payload.panNumber
      ? payload.panNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
      : undefined,
    phone: payload.phone ? payload.phone.replace(/\D/g, '') : undefined,
    email: payload.email?.trim() || undefined,
    remarks: payload.remarks?.trim() || undefined,
  };

  await sanityClient.patch(staffId).set(sanitizedData).commit();

  revalidatePath('/all-staff');
  revalidatePath('/fetch-staff-detail');
  revalidatePath('/');

  return { success: true, updated: sanitizedData };
}

export async function deleteStaffMember(
  staffId: string,
  confirmationText: string
) {
  await requireAuth();

  if (!staffId) {
    throw new Error('Staff ID is required.');
  }

  const staff = await sanityClient.fetch<{ _id: string; firstName?: string } | null>(
    `*[_type == "staffMasterData" && _id == $id][0]{ _id, firstName }`,
    { id: staffId },
    { cache: 'no-store' }
  );

  if (!staff || !staff.firstName) {
    throw new Error('Staff record not found.');
  }

  const cleanFirstName = staff.firstName.trim().split(/\s+/)[0].toLowerCase();
  const expectedPhrase = `delete ${cleanFirstName}`;

  if (confirmationText.trim().toLowerCase() !== expectedPhrase) {
    throw new Error(`Confirmation failed. Please type "${expectedPhrase}" exactly.`);
  }

  await sanityClient.delete(staffId);

  revalidatePath('/all-staff');
  revalidatePath('/fetch-staff-detail');
  revalidatePath('/');

  return { success: true };
}