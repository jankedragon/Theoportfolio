import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'qa',
  title: 'Q&A',
  type: 'document',
  icon: () => '❓',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(200),
      description: 'The question being asked'
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule) => Rule.required().min(20),
      description: 'The detailed answer to the question'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'question',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the question'
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      description: 'When this Q&A was published'
    },
    {
      name: 'featured',
      title: 'Featured Q&A',
      type: 'boolean',
      initialValue: false,
      validation: Rule => Rule.custom(async (value, context) => {
        if (!value) return true
        const client = context.getClient({apiVersion: '2023-05-03'})
        const count = await client.fetch(
          `count(*[_type == "qa" && featured == true && _id != $id])`,
          {id: context.document._id}
        )
        return count < 2 ? true : 'You can only have 3 featured Q&A posts.'
      }),
      description: 'Check to feature this Q&A (max 2 featured Q&As)',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (optional - will use publish date if not set)'
    }
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }]
    },
    {
      title: 'Question A-Z',
      name: 'questionAsc',
      by: [{ field: 'question', direction: 'asc' }]
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
      description: 'answer'
    },
    prepare({ title, subtitle, description }) {
      return {
        title,
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
        description: description?.substring(0, 100) + '...'
      }
    }
  }
})