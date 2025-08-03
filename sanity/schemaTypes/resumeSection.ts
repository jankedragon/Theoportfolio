export default {
  name: 'resumeSection',
  title: 'Resume Sections',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'e.g., Skills, Education, Awards, etc.'
    },
    {
      name: 'items',
      title: 'Section Items',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Add items for this section'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first'
    },
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      options: {
        list: [
          {title: 'Skills', value: 'skills'},
          {title: 'Education', value: 'education'},
          {title: 'Awards', value: 'awards'},
          {title: 'Languages', value: 'languages'},
          {title: 'Certifications', value: 'certifications'},
          {title: 'Other', value: 'other'}
        ]
      }
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