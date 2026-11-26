import { defineField, defineType } from 'sanity';

export const result2026 = defineType({
  name: 'result2026',
  title: 'Result 2026 (UPS Warpora)',
  type: 'document',
  fields: [
    defineField({
      name: 'pen',
      title: 'PEN (Permanent Education Number)',
      type: 'string',
      validation: (Rule) => Rule.required().error('PEN is required to link student result'),
    }),
    defineField({
      name: 'name',
      title: 'Student Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Student name is required'),
    }),
    defineField({
      name: 'english',
      title: 'English',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'math',
      title: 'Mathematics',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'science',
      title: 'Science',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'sst',
      title: 'Social Science (SST)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'urdu',
      title: 'Urdu',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'kashmiri',
      title: 'Kashmiri',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'total',
      title: 'Total Marks',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'percentage',
      title: 'Percentage (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      pen: 'pen',
      total: 'total',
      percentage: 'percentage',
    },
    prepare({ title, pen, total, percentage }) {
      const pctText = typeof percentage === 'number' ? `${percentage.toFixed(2)}%` : 'N/A';
      return {
        title: title || 'Unnamed Student',
        subtitle: `PEN: ${pen || 'N/A'} | Total: ${total ?? 'N/A'} (${pctText})`,
      };
    },
  },
});