// sanity.config.ts
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './backend/schemaTypes' // adjust path to your existing schemas

export default defineConfig({
  name: 'default',
  title: 'Upswarpora Studio',

  projectId: 'iz8kzbg5',   // copy from old backend config
  dataset: 'production',        // e.g. 'production'

  basePath: '/studio',              // important for /studio route

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
