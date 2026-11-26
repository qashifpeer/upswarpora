import { defineField, defineType } from 'sanity';

export const staffMasterData = defineType({
  name: 'staffMasterData',
  title: 'Staff Master Data (GMS Warpora)',
  type: 'document',
  fields: [
    defineField({
      name: 'teacherCode',
      title: 'Teacher Code (Optional)',
      type: 'string',
      description: 'Unique CPIS / Employee / Teacher ID if assigned',
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('First name is required'),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'surname',
      title: 'Surname',
      type: 'string',
    }),
    defineField({
      name: 'staffCategory',
      title: 'Teaching / Non-Teaching',
      type: 'string',
      initialValue: 'Teaching',
      options: {
        list: [
          { title: 'Teaching', value: 'Teaching' },
          { title: 'Non-Teaching', value: 'Non-Teaching' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
      options: {
        list: [
          { title: 'Teacher', value: 'Teacher' },
          { title: 'Head Teacher', value: 'Head Teacher' },
          { title: 'Aaya', value: 'Aaya' },
          { title: 'Cook', value: 'Cook' },
          { title: 'Sweeper', value: 'Sweeper' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'natureOfEmployment',
      title: 'Nature of Employment',
      type: 'string',
      initialValue: 'Permanent',
      options: {
        list: [
          { title: 'Permanent', value: 'Permanent' },
          { title: 'Temporary', value: 'Temporary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'onDeployment',
      title: 'Whether on Deployment',
      type: 'boolean',
      initialValue: false,
      description: 'Enable if the staff member is deployed here from another institution',
    }),
    defineField({
      name: 'originalPlaceOfPosting',
      title: 'Original Place of Posting',
      type: 'string',
      description: 'Required when the staff member is on deployment',
      hidden: ({ document }) => !document?.onDeployment,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const isDeployed = Boolean((context.document as { onDeployment?: boolean })?.onDeployment);
          if (isDeployed && (!value || !value.trim())) {
            return 'Original Place of Posting is required when on deployment';
          }
          return true;
        }),
    }),
    defineField({
      name: 'dob',
      title: 'Date of Birth',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
    }),
    defineField({
      name: 'dateOfAppointment',
      title: 'Date of Appointment',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
    }),
    defineField({
      name: 'dateOfJoiningSchool',
      title: 'Date of Joining This School',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
    }),
    defineField({
      name: 'panNumber',
      title: 'PAN Number',
      type: 'string',
      description: '10-character Permanent Account Number (e.g., ABCDE1234F)',
      validation: (Rule) =>
        Rule.regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, {
          name: 'PAN Number',
          invert: false,
        }).warning('PAN should be 10 characters (5 letters, 4 digits, 1 letter)'),
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
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.email().warning('Enter a valid email address'),
    }),
    defineField({
      name: 'remarks',
      title: 'Remarks',
      type: 'text',
      rows: 2,
      description: 'Additional administrative notes or remarks',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      surname: 'surname',
      designation: 'designation',
      nature: 'natureOfEmployment',
      onDeployment: 'onDeployment',
    },
    prepare({ firstName, lastName, surname, designation, nature, onDeployment }) {
      const fullName = [firstName, lastName, surname].filter(Boolean).join(' ') || 'Unnamed Staff';
      const deployTag = onDeployment ? ' [DEPLOYED]' : '';
      return {
        title: `${fullName}${deployTag}`,
        subtitle: `${designation || 'Staff'} • ${nature || 'N/A'}`,
      };
    },
  },
});