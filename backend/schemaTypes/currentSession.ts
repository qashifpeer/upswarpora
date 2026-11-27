import { defineField, defineType } from 'sanity';

export const currentSession = defineType({
  name: 'currentSession',
  title: 'Current Session (GMS Warpora)',
  type: 'document',
  fields: [
    defineField({
      name: 'sessionYear',
      title: 'Session Year',
      type: 'string',
      description: 'e.g., 2026 or 2026-27',
      initialValue: '2026',
      validation: (Rule) => Rule.required().error('Session year is required'),
    }),
  ],
  preview: {
    select: {
      sessionYear: 'sessionYear',
    },
    prepare({ sessionYear }) {
      return {
        title: `Active Session: ${sessionYear || 'Not Set'}`,
        subtitle: 'GMS Warpora Academic Session',
      };
    },
  },
});