'use server';

import { sanityClient } from '@/lib/sanity';
import { isAuthenticated } from '@/lib/auth';

async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error('Unauthorized: Staff authentication required.');
  }
}

export interface MasterStudentDetail {
  _id: string;
  pen?: string;
  name?: string;
  father_name?: string;
  mother_name?: string;
  dob?: string;
  class?: string;
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
  status?: string;
  promotionStatus?: string;
  remarks?: string;
}

export async function fetchStudentsByClass(
  selectedClass: string
): Promise<MasterStudentDetail[]> {
  await requireAuth();

  const filter =
    selectedClass === 'ALL'
      ? `*[_type == "masterData"]`
      : `*[_type == "masterData" && class == $cls]`;

  const query = `${filter} | order(class desc, name asc) {
    _id,
    pen,
    name,
    father_name,
    mother_name,
    dob,
    class,
    gender,
    aadhaar,
    bankAccount,
    bankName,
    bankBranch,
    ifscCode,
    adress,
    phone,
    bpl,
    aay,
    admission_number,
    admission_date,
    prev_class,
    "status": coalesce(status, "active"),
    "promotionStatus": coalesce(promotionStatus, "none"),
    remarks
  }`;

  return sanityClient.fetch<MasterStudentDetail[]>(
    query,
    selectedClass === 'ALL' ? {} : { cls: selectedClass },
    { cache: 'no-store' }
  );
}