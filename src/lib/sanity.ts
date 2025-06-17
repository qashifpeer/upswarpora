import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: 'iz8kzbg5',  // Replace with your project ID
  dataset: 'production',         // or your dataset name
  useCdn: true,
  apiVersion: '2023-01-01',
})