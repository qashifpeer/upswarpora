'use server';

import { sanityClient } from '@/lib/sanity';

export interface PublicStudentMatch {
  _id: string;
  pen: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  gender?: string;
  adress?:string;
  dob?: string;
  status?: string;
  class: string;
  prev_class?: string;
  admission_number?: string;
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

export async function searchStudentsByName(
  searchTerm: string
): Promise<PublicStudentMatch[]> {
  const cleaned = searchTerm.trim();
  if (cleaned.length < 2) return [];

  const query = `*[_type == "masterData" && name match $pattern] | order(class asc, name asc)[0...25]{
    _id,
    pen,
    name,
    father_name,
    dob,
    class,
    prev_class,
    admission_number
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
  if (!cleanedPen) return { student: null, result: null };

  const query = `{
    "student": *[_type == "masterData" && pen == $pen][0]{
      _id,
      pen,
      name,
      father_name,
      dob,
      class,
      prev_class,
      admission_number
    },
    "result": *[_type == "result2026" && pen == $pen][0]{
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
    }
  }`;

  return sanityClient.fetch(query, { pen: cleanedPen }, { cache: 'no-store' });
}