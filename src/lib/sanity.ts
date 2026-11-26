import { createClient } from '@sanity/client'

// export const sanity = createClient({
//   projectId: 'iz8kzbg5',  // Replace with your project ID
//   dataset: 'production',         // or your dataset name
//   useCdn: false,
//   apiVersion: '2023-01-01',
// })

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // Required for status mutations
  useCdn: false, // Always fetch the latest status
});