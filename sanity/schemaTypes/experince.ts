export default {
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    {
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave empty if current position'
    },
    {
      name: 'current',
      title: 'Current Position',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string'
    },
    {
      name: 'bulletPoints',
      title: 'Responsibilities & Achievements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Add bullet points for this role'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first'
    }
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    }
  ]
}