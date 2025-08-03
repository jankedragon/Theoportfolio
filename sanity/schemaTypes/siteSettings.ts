// Update your Sanity schema for siteSettings to include separate name fields
// This goes in your Sanity studio schema file

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'heroLabel',
      title: 'Hero Label',
      type: 'string',
      description: 'Small label above the name (e.g., "PORTFOLIO")'
    },
    {
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      description: 'Your first name for the hero section'
    },
    {
      name: 'lastName',
      title: 'Last Name', 
      type: 'string',
      description: 'Your last name for the hero section'
    },
    // Alternative: Keep the single name field if you prefer
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Your full name (alternative to first/last name split)'
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      description: 'Description text below your name'
    },
    {
      name: 'avatar',
      title: 'Hero Avatar',
      type: 'image',
      options: {
        hotspot: true // Enables focal point selection
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string'
    },
    {
      name: 'secondaryButtonText', 
      title: 'Secondary Button Text',
      type: 'string'
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Your LinkedIn profile URL'
    },
    {
      name: 'email',
      title: 'Contact Email',
      type: 'email',
      description: 'Email address that will be displayed in the "Other Ways to Contact" section'
    },
    {
      name: 'contactSectionTitle',
      title: 'Contact Section Title',
      type: 'string',
      description: 'Title for the "Other Ways to Contact" section',
      initialValue: 'Other Ways to Contact'
    },
    {
      name: 'contactSectionDescription',
      title: 'Contact Section Description',
      type: 'text',
      description: 'Description text that appears above the contact methods',
      initialValue: 'Prefer a different way to get in touch? Here are some alternatives:'
    },
  ]
}