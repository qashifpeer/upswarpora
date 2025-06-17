import { defineField, defineType } from 'sanity'



export default defineType({
  name: 'result2024',
  title: 'Result 2024',
  type: 'document',
  fields: [
     defineField({
      name: 'rollNumber',
      title: 'Roll Number',
      type: 'string',
    }),
     defineField({
      name: 'student',
      title: 'Student',
      type: 'reference',
       to: [{ type: 'student' }],
    }),
    defineField({
      name: 'class',
      title: 'Class',
      type: 'reference',
       to: [{ type: 'presentClass' }],
    }),
    
     defineField({
      name: 'session',
      title: 'Session',
      type: 'reference',
       to: [{ type: 'session' }],
    }),
      defineField({
      name: 'urdu',
      title: 'Urdu',
      type: 'number',
    }),
    defineField({
      name: 'english',
      title: 'English',
      type: 'number',
    }),
   
    defineField({
      name: 'math',
      title: 'Math',
      type: 'number',
    }),
    defineField({
      name: 'science',
      title: 'Science',
      type: 'number',
    }),
    defineField({
      name: 'sst',
      title: 'Social Science',
      type: 'number',
    }),
    defineField({
      name: 'kashmiri',
      title: 'Kashmiri',
      type: 'number',
    }),
   
    defineField({
      name: 'maxMarks',
      title: 'Max Marks',
      type: 'number',
    }),
    defineField({
      name: 'marksObtained',
      title: 'Marks Obtained',
      type: 'number',
    }),
    defineField({
      name: 'percentage',
      title: 'Percentage',
      type: 'number',
    }),
    defineField({
      name: 'finalResult',
      title: 'Result',
      type: 'number',
    }),

    
   
  ],

})
