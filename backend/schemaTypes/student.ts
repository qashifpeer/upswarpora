import { defineField, defineType } from 'sanity'

function generateRandomString(length = 52) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default defineType({
  name: 'student',
  title: 'Student',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'fatherName',
      title: 'Father Name',
      type: 'string',
    }),

    defineField({
      name: 'motherName',
      title: "Mother's Name",
      type: 'string',
    }),
    defineField({
      name: 'residence',
      title: "Residence",
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    }),
    defineField({
      name: 'class',
      title: 'Class',
      type: 'reference',
      to: { type: 'presentClass' },
    }),
    defineField({
      name: 'admNumber',
      title: 'Admission Number',
      type: 'string',
    }),
    defineField({
      name: 'dob',
      title: 'Date Of Birth',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY', 
        

      },
    }),
    defineField({
      name: 'enrNumber',
      title: 'Enrollment Number',
      type: 'string',
    }),
    defineField({
      name: 'penNumber',
      title: 'PEN',
      type: 'string',
    }),
    defineField({
      name: 'session',
      title: 'Session',
      type: 'reference',
      to: { type: 'session' },
    }),

    defineField({
      name: 'subjects',
      title: 'Subjects',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'subject' } }],
    }),
    defineField({
      name: 'admissionDate',
      title: 'Date Of Admission',
      type: 'datetime',
    }),
  ],
  initialValue: async () => ({
    slug: {
      current: `${generateRandomString()}`
    }
  })

})
