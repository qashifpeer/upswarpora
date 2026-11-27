'use server';

import { sanityClient } from '@/lib/sanity';

export interface PublicStudentMatch {
  _id: string;
  pen: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  dob?: string;
  gender?: string;
  class?: string;
  prev_class?: string;
  adress?: string;
  admission_number?: string;
  admission_date?: string;
  status?: string;
}

export interface Result2026Data {
  _id: string;
  pen?: string;
  english?: number;
  urdu?: number;
  math?: number;
  science?: number;
  sst?: number;
  kashmiri?: number;
  total?: number;
  percentage?: number;
}

export async function searchStudentsByName(
  nameQuery: string
): Promise<PublicStudentMatch[]> {
  const cleaned = nameQuery.trim();
  if (cleaned.length < 2) return [];

  const query = `*[_type == "masterData" && name match $pattern] | order(name asc)[0...25]{
    _id,
    pen,
    name,
    father_name,
    mother_name,
    dob,
    gender,
    class,
    prev_class,
    adress,
    admission_number,
    admission_date,
    "status": coalesce(status, "active")
  }`;

  return sanityClient.fetch<PublicStudentMatch[]>(
    query,
    { pattern: `*${cleaned}*` },
    { cache: 'no-store' }
  );
}

export async function getPublicStudentAndResultByPen(pen: string): Promise<{
  student: PublicStudentMatch | null;
  result: Result2026Data | null;
}> {
  const cleanedPen = pen.trim();
  if (!cleanedPen) {
    return { student: null, result: null };
  }

  const studentQuery = `*[_type == "masterData" && pen == $pen][0]{
    _id,
    pen,
    name,
    father_name,
    mother_name,
    dob,
    gender,
    class,
    prev_class,
    adress,
    admission_number,
    admission_date,
    "status": coalesce(status, "active")
  }`;

  const resultQuery = `*[_type in ["result", "result2026"] && pen == $pen][0]{
    _id,
    pen,
    english,
    urdu,
    math,
    science,
    sst,
    kashmiri,
    total,
    percentage
  }`;

  const [student, result] = await Promise.all([
    sanityClient.fetch<PublicStudentMatch | null>(
      studentQuery,
      { pen: cleanedPen },
      { cache: 'no-store' }
    ),
    sanityClient.fetch<Result2026Data | null>(
      resultQuery,
      { pen: cleanedPen },
      { cache: 'no-store' }
    ),
  ]);

  return { student, result };
}