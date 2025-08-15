export default {
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  icon: () => '💼',
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
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      description: 'Upload a small company logo (recommended: square format, PNG with transparent background)',
      options: {
        hotspot: false, // Disable hotspot since logos don't need it
        accept: '.png,.jpg,.jpeg,.svg' // Accept common logo formats
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the logo for accessibility (e.g., "Acme Corp logo")'
        }
      ]
    },
    {
      name: 'description',
      title: 'Job Description & Achievements',
      type: 'array',
      of: [
        {
          type: 'block',
          // Customize which formatting options are available
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H4', value: 'h4'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'}
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        }
      ],
      description: 'Describe your responsibilities, achievements, and key projects. You can use bullet points, paragraphs, or any combination.'
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