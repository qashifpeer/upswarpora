'use client'

import { useState } from 'react'

type AdmissionCategory = 'GEN' | 'OBC'

interface NewAdmissionFormData {
  studentName: string
  fatherName: string
  motherName: string
  classAdmitted: string
  dob: string
  dateOfAdmission: string
  religion: string
  residence: string
  phone: string
  aadhar: string
  bankName: string
  bankAccount: string
  category: AdmissionCategory
  whetherAAY: boolean
  penNumber: string
}

const initialFormData: NewAdmissionFormData = {
  studentName: '',
  fatherName: '',
  motherName: '',
  classAdmitted: '',
  dob: '',
  dateOfAdmission: new Date().toISOString().split('T')[0],
  religion: 'Muslim',
  residence: 'Warpora',
  phone: '',
  aadhar: '',
  bankName: '',
  bankAccount: '',
  category: 'GEN',
  whetherAAY: false,
  penNumber: '',
}

const classOptions = [
  'Nursery',
  'LKG',
  'UKG',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
]

export default function NewAdmissionForm() {
  const [formData, setFormData] = useState<NewAdmissionFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [enrolmentNumber, setEnrolmentNumber] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (
      !formData.studentName ||
      !formData.fatherName ||
      !formData.motherName ||
      !formData.classAdmitted ||
      !formData.dob ||
      !formData.dateOfAdmission ||
      !formData.phone ||
      !formData.aadhar
    ) {
      return 'Please fill all required fields.'
    }

    if (formData.phone.length !== 10) {
      return 'Phone number must be 10 digits.'
    }

    if (formData.aadhar.length !== 12) {
      return 'Aadhar number must be 12 digits.'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEnrolmentNumber('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/new-admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setSuccess('Admission submitted successfully.')
      setEnrolmentNumber(data.enrolmentNumber || '')
      setFormData({
        ...initialFormData,
        dateOfAdmission: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

  const labelClass = 'mb-1 block text-sm font-medium text-slate-700'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Student Details
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Student Name *</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className={labelClass}>Father Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter father name"
              />
            </div>

            <div>
              <label className={labelClass}>Mother Name *</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter mother name"
              />
            </div>

            <div>
              <label className={labelClass}>Class Admitted *</label>
              <select
                name="classAdmitted"
                value={formData.classAdmitted}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select class</option>
                {classOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Date of Admission *</label>
              <input
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Residence</label>
              <input
                type="text"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                maxLength={10}
                placeholder="10 digit phone number"
              />
            </div>

            <div>
              <label className={labelClass}>Aadhar *</label>
              <input
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                className={inputClass}
                maxLength={12}
                placeholder="12 digit Aadhar number"
              />
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="GEN">GEN</option>
                <option value="OBC">OBC</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="whetherAAY"
                  checked={formData.whetherAAY}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Whether AAY
              </label>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Bank & Identity
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>PEN Number</label>
              <input
                type="text"
                name="penNumber"
                value={formData.penNumber}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter PEN number"
              />
            </div>

            <div>
              <label className={labelClass}>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter bank name"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Bank Account</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter bank account number"
              />
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <p>{success}</p>
            {enrolmentNumber ? (
              <p className="mt-1 font-semibold">
                Generated Enrolment Number: {enrolmentNumber}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Submit Admission'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                ...initialFormData,
                dateOfAdmission: new Date().toISOString().split('T')[0],
              })
              setError('')
              setSuccess('')
              setEnrolmentNumber('')
            }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}