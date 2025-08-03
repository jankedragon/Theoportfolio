import { defineField, defineType } from 'sanity'
import { type SchemaTypeDefinition } from 'sanity'

export const portfolio: SchemaTypeDefinition = defineType({
    name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'string'
        }
      ],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'pdfFile',
      title: 'PDF Document',
      type: 'file',
      options: {
        accept: '.pdf'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      description: 'Upload a preview image of your PDF (recommended: first page as JPG/PNG)',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette']
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'imageAlt',
      title: 'Preview Image Alt Text',
      type: 'string',
      description: 'Alternative text for the preview image (for accessibility)'
    },
    defineField({
      name: 'featured',
      title: 'Featured Portfolio',
      type: 'boolean',
      description: 'Check this to feature this portfolio item (max 4 featured items)',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'previewImage',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const { title, media, publishedAt } = selection
      return {
        title,
        media,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'
      }
    }
  }
})