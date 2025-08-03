import { groq } from 'next-sanity'
import { client } from './sanity'

export async function getPortfolioPosts() {
  return client.fetch(
    groq`*[_type == "portfolio"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      summary,
      publishedAt,
      tags,
      pdfFile {
        asset-> {
          url,
          originalFilename,
          size
        }
      },
      previewImage {
        asset-> {
          url
        },
        alt
      },
      imageAlt
    }`
  )
}

export async function getPortfolioPost(slug: string) {
  return client.fetch(
    groq`*[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      summary,
      publishedAt,
      tags,
      pdfFile {
        asset-> {
          url,
          originalFilename,
          size
        }
      },
      previewImage {
        asset-> {
          url
        },
        alt
      },
      imageAlt
    }`,
    { slug }
  )
}

export async function getFeaturedPortfolio() {
  return await client.fetch(`
    *[_type == "portfolio" && defined(publishedAt) && featured == true] | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      summary,
      publishedAt,
      tags,
      imageAlt,
      featured,
      previewImage {
        asset->{
          url
        },
        alt
      },
      pdfFile {
        asset->{
          url,
          originalFilename,
          size
        }
      }
    }
  `)
}