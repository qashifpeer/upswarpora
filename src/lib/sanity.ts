import { createClient } from '@sanity/client'

// export const sanity = createClient({
//   projectId: 'iz8kzbg5',  // Replace with your project ID
//   dataset: 'production',         // or your dataset name
//   useCdn: false,
//   apiVersion: '2023-01-01',
// })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing-project-id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();


// Public read-only client (no token or session credentials)
export const sanityReadClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: false,
  withCredentials: false,
});

// Authenticated client for Server Actions (create, patch, delete)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  ...(token ? { token } : {}),
});