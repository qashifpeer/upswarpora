'use server';

import { sanityClient } from '@/lib/sanity';
import { isAuthenticated } from '@/lib/auth';

export interface ActiveRollStudent {
  _id: string;
  class?: string;
  gender?: string;
}

export async function getActiveRollStudents(): Promise<ActiveRollStudent[]> {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error('Unauthorized: Staff authentication required.');
  }

  const query = `*[_type == "masterData" && coalesce(status, "active") == "active"]{
    _id,
    class,
    gender
  }`;

  return sanityClient.fetch<ActiveRollStudent[]>(query, {}, { cache: 'no-store' });
}