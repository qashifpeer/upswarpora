
// src/app/studio/[[...index]]/page.tsx
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config' // adjust relative path

export const dynamic = 'force-static'

export default function StudioPage() {
  return <NextStudio config={config} />
}
