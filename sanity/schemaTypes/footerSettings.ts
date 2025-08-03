// schemas/footerSettings.js
export default {
  name: 'footerSettings',
  title: 'Footer Settings',
  type: 'document',
  __experimental_actions: [
    // Disable create and delete since we only want one footer settings document
    'update',
    'publish'
  ],
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name displayed in the footer',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, State or full address',
      validation: Rule => Rule.required().max(200)
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Phone number with format like 999-999-9999',
      validation: Rule => Rule.required().regex(/^[\d\s\-\(\)\+\.]+$/, {
        name: 'phone',
        invert: false
      }).error('Please enter a valid phone number')
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Contact email address',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn Profile URL',
      type: 'url',
      description: 'Full LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      }).custom((url) => {
        if (url && !url.includes('linkedin.com')) {
          return 'Please enter a valid LinkedIn URL'
        }
        return true
      })
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email'
    }
  }
}