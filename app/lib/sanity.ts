import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  // Set to `true` if you want to require authentication for all queries
  token: process.env.SANITY_API_TOKEN || '',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}

// Helper function to check if Sanity is properly configured
export function isSanityConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
    process.env.NEXT_PUBLIC_SANITY_DATASET
  )
}

// lib/sanity.js (or wherever your Sanity queries are)
export async function getSiteSettings() {
  return await client.fetch(`
    *[_type == "siteSettings"][0]{
      heroLabel,
      name,
      firstName,
      lastName,
      linkedinURL,
      tagline,
      avatar{
        asset->{
          _id,
          url
        },
        alt
      },
      primaryButtonText,
      secondaryButtonText
    }
  `)
}