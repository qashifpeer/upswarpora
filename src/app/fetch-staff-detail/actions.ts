'use server';

import { sanityClient } from '@/lib/sanity';
import { isAuthenticated } from '@/lib/auth';

async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error('Unauthorized: Staff authentication required.');
  }
}

export interface StaffMasterDetail {
  _id: string;
  teacherCode?: string;
  firstName?: string;
  lastName?: string;
  surname?: string;
  staffCategory?: string;
  designation?: string;
  natureOfEmployment?: string;
  onDeployment?: boolean;
  originalPlaceOfPosting?: string;
  dob?: string;
  dateOfAppointment?: string;
  dateOfJoiningSchool?: string;
  panNumber?: string;
  phone?: string;
  email?: string;
  remarks?: string;
}

export async function fetchAllStaffDetails(): Promise<StaffMasterDetail[]> {
  await requireAuth();

  const query = `*[_type == "staffMasterData"] | order(staffCategory asc, designation asc, firstName asc) {
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
    dob,
    dateOfAppointment,
    dateOfJoiningSchool,
    panNumber,
    phone,
    email,
    remarks
  }`;

  return sanityClient.fetch<StaffMasterDetail[]>(query, {}, { cache: 'no-store' });
}