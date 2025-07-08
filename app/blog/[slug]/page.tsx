import { client } from '../../lib/sanity'
import { urlForImage } from '../../lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Define the blog post type
interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  body: any[] // Portable Text content
  mainImage?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  author?: {
    name: string
    image?: {
      asset: {
        _ref: string
      }
    }
  }
}

// Fetch a single blog post
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch(`
      *[_type == "post" && slug.current == $slug && defined(publishedAt)][0] {
        _id,
        title,
        slug,
        publishedAt,
        body,
        mainImage {
          asset,
          alt
        },
        author-> {
          name,
          image {
            asset
          }
        }
      }
    `, { slug })
    
    console.log('Fetched post:', post) // Debug log
    return post || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await client.fetch(`
      *[_type == "post"] {
        slug
      }
    `)
    
    return posts.map((post: any) => ({
      slug: post.slug.current,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Portable Text components for rich content rendering
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null
      
      return (
        <div className="my-8">
          <Image
            src={urlForImage(value).width(800).height(450).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            className="rounded-lg object-cover"
          />
          {value.caption && (
            <p className="mt-2 text-sm text-gray-600 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-gray-900 mt-5 mb-2">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),
  },
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        {post.mainImage && (
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <Image
              src={urlForImage(post.mainImage).width(1200).height(675).url()}
              alt={post.mainImage.alt || post.title}
              width={1200}
              height={675}
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-white text-sm">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {post.author.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {post.body && post.body.length > 0 ? (
            <PortableText 
              value={post.body} 
              components={portableTextComponents}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                This blog post doesn't have any content yet. 
                Edit it in Sanity Studio to add rich content, images, and more!
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}