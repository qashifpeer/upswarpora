import { defineField, defineType } from 'sanity';

export const masterData = defineType({
  name: 'masterData',
  title: 'Master Data (GMS Warpora)',
  type: 'document',
  fields: [
    defineField({
      name: 'pen',
      title: 'PEN (Permanent Education Number)',
      type: 'string',
      validation: (Rule) => Rule.required().error('PEN is required'),
    }),
    defineField({
      name: 'name',
      title: 'Student Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Student name is required'),
    }),
    defineField({
      name: 'father_name',
      title: "Father's Name",
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mother_name',
      title: "Mother's Name",
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dob',
      title: 'Date of Birth',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'class',
      title: 'Current Class',
      type: 'string',
      options: {
        list: [
          { title: 'Pre-Primary / Nursery', value: 'Pre-Primary' },
          { title: 'Class 1', value: '1' },
          { title: 'Class 2', value: '2' },
          { title: 'Class 3', value: '3' },
          { title: 'Class 4', value: '4' },
          { title: 'Class 5', value: '5' },
          { title: 'Class 6', value: '6' },
          { title: 'Class 7', value: '7' },
          { title: 'Class 8', value: '8' },
          { title: 'Pool (8th Passed)', value: 'Pool' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Male', value: 'Male' },
          { title: 'Female', value: 'Female' },
          { title: 'Other', value: 'Other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aadhaar',
      title: 'Aadhaar Number',
      type: 'string',
      description: '12-digit unique identification number',
      validation: (Rule) =>
        Rule.regex(/^\d{12}$/, {
          name: 'Aadhaar',
          invert: false,
        }).warning('Aadhaar should be exactly 12 digits without spaces'),
    }),
    defineField({
      name: 'bankAccount',
      title: 'Bank Account Number',
      type: 'string',
      description: 'Student or joint guardian bank account number (9 to 18 digits)',
      validation: (Rule) =>
        Rule.regex(/^\d{9,18}$/, {
          name: 'Bank Account Number',
          invert: false,
        }).warning('Bank account number should typically be 9 to 18 digits without spaces'),
    }),
    defineField({
      name: 'bankName',
      title: 'Bank Name',
      type: 'string',
      description: 'e.g., J&K Bank, State Bank of India, J&K Grameen Bank',
    }),
    defineField({
      name: 'bankBranch',
      title: 'Bank Branch',
      type: 'string',
      description: 'Branch name or location',
    }),
    defineField({
      name: 'ifscCode',
      title: 'IFSC Code',
      type: 'string',
      description: '11-character Indian Financial System Code (e.g., JAKA0WARPOR)',
      validation: (Rule) =>
        Rule.regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, {
          name: 'IFSC Code',
          invert: false,
        }).warning('IFSC code should be 11 characters (e.g., JAKA0XXXXXX)'),
    }),
    defineField({
      name: 'adress',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) =>
        Rule.regex(/^[6-9]\d{9}$/, {
          name: 'Indian Mobile Number',
          invert: false,
        }).warning('Enter a valid 10-digit mobile number'),
    }),
    defineField({
      name: 'bpl',
      title: 'BPL (Below Poverty Line)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'aay',
      title: 'AAY (Antyodaya Anna Yojana)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'admission_number',
      title: 'Admission Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'admission_date',
      title: 'Admission Date',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prev_class',
      title: 'Previous Class',
      type: 'string',
      options: {
        list: [
          { title: 'None / Fresh Admission', value: 'None' },
          { title: 'Pre-Primary', value: 'Pre-Primary' },
          { title: 'Class 1', value: '1' },
          { title: 'Class 2', value: '2' },
          { title: 'Class 3', value: '3' },
          { title: 'Class 4', value: '4' },
          { title: 'Class 5', value: '5' },
          { title: 'Class 6', value: '6' },
          { title: 'Class 7', value: '7' },
          { title: 'Class 8', value: '8' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Enrollment Status',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Struck Off', value: 'struck off' },
          { title: 'Left with DC', value: 'left with DC' },
          { title: 'Left without DC', value: 'left without DC' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'promotionStatus',
      title: 'Session Promotion Action',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          { title: 'Pending (Unlocked)', value: 'none' },
          { title: 'Promoted', value: 'promoted' },
          { title: 'Retained', value: 'retained' },
        ],
        layout: 'radio',
      },
      description: 'Freezes the row action as Promoted or Retained until Start Promotion is clicked',
    }),
    defineField({
      name: 'remarks',
      title: 'Remarks',
      type: 'text',
      rows: 2,
      description: 'Additional notes or administrative remarks',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'class',
      admissionNo: 'admission_number',
      status: 'status',
    },
    prepare({ title, subtitle, admissionNo, status }) {
      const statusTag = status && status !== 'active' ? ` [${status.toUpperCase()}]` : '';
      return {
        title: `${title || 'Unnamed Student'}${statusTag}`,
        subtitle: `Class: ${subtitle || 'N/A'} | Adm No: ${admissionNo || 'N/A'}`,
      };
    },
  },
});