import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'presentClass',
  title: 'Class',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
     defineField({
      name: 'classId',
      title: 'Class ID',
      type: 'number',
    }),
    defineField({
      name: 'prevClassId',
      title: 'Previous Class Id',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
})
