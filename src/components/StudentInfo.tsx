// components/StudentInfo.tsx
'use client'

import { useEffect, useState } from 'react'
import { sanity } from '@/lib/sanity'

type Student = {
  name: string
  fatherName: string
  class: string
}

export default function StudentInfo() {
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    const fetchStudent = async () => {
      const query = `*[_type == "student"][0]{
        name,
       fatherName,
        class->{
    presentClass->{
    name}
  }
      }`
      const result = await sanity.fetch(query)
      setStudent(result)
    }

    fetchStudent()
  }, [])

  if (!student) return <p>Loading...</p>

  return (
    <div className="p-4 bg-white rounded shadow max-w-md">
      <h2 className="text-xl font-bold">Student Info</h2>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Father&apos;s Name:</strong> {student.fatherName}</p>
      {/* <p><strong>Class:</strong> {student.class}</p> */}
    </div>
  )
}
