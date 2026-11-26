// types/newAdmission.ts
export type AdmissionCategory = 'GEN' | 'OBC'

export interface NewAdmissionInput {
  studentName: string
  fatherName: string
  motherName: string
  classAdmitted: string
  dob: string
  dateOfAdmission: string
  religion?: string
  residence?: string
  phone: string
  aadhar: string
  bankName?: string
  bankAccount?: string
  category: AdmissionCategory
  whetherAAY: boolean
  penNumber?: string
}

export interface NewAdmissionDocument extends NewAdmissionInput {
  _id: string
  _type: 'newAdmission'
  enrolmentNumber: string
}