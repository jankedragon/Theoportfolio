import { client } from './sanity'

export interface QAPost {
  _id: string
  question: string
  answer: string
  slug: { current: string }
  publishedAt: string
  tags?: string[]
  category?: string
}

export async function getQAPosts(): Promise<QAPost[]> {
  const query = `
    *[_type == "qa" && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      question,
      answer,
      slug,
      publishedAt,
    }
  `
  
  try {
    const posts = await client.fetch(query)
    return posts || []
  } catch (error) {
    console.error('Error fetching Q&A posts:', error)
    throw error
  }
}

export async function getQAPost(slug: string): Promise<QAPost | null> {
  const query = `
    *[_type == "qa" && slug.current == $slug][0] {
      _id,
      question,
      answer,
      slug,
      publishedAt,
    }
  `
  
  try {
    const post = await client.fetch(query, { slug })
    return post || null
  } catch (error) {
    console.error('Error fetching Q&A post:', error)
    throw error
  }
}