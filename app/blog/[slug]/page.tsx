import { client } from '../../lib/sanity'
import { urlForImage } from '../../lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
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
      <p className="text-gray-700 mb-4 leading-relaxed" style={{ textAlign: 'justify' }}>{children}</p>
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

// Import the client component
import BackToTopButton from '../../components/BackToTopButton'

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
    <div className="page-frame">
      <article className="bg-white min-h-full">
        <div className="home-window">
        {/* Header Section */}
        <header style={{ marginBottom: '52px', textAlign: 'center' }}>
          {/* Title */}
          <h1 className="hero-name" style={{ fontSize: '80px', marginBottom: '16px' }}>
            {post.title}
          </h1>
          
          {/* Author */}
          {post.author && (
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>
              By {post.author.name}
            </p>
          )}
          
          {/* Date */}
          <time 
            dateTime={post.publishedAt}
            style={{ color: '#999', fontSize: '16px', display: 'block', marginBottom: '24px' }}
          >
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          {/* Divider Line */}
          <div style={{ 
            height: '2px', 
            backgroundColor: '#000', 
            marginBottom: '32px',
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}></div>
        </header>

        {/* Main Image */}
        {post.mainImage && (
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.mainImage.alt || post.title}
              width={0}
              height={0}
              sizes="100vw"
              style={{ 
                width: 'auto', 
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '600px',
                border: '1px solid #000',
                objectFit: 'contain'
              }}
              priority
            />
          </div>
        )}

        {/* Content */}
        <div style={{ 
          marginBottom: '48px',
          width: '70%', // Match divider width
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {post.body && post.body.length > 0 ? (
            <PortableText 
              value={post.body} 
              components={portableTextComponents}
            />
          ) : (
            <div style={{ 
              backgroundColor: '#f0f0f0', 
              padding: '32px', 
              textAlign: 'center',
              border: 'none' // Invisible border
            }}>
              <p style={{ color: '#666', margin: 0 }}>
                This blog post doesn't have any content yet. 
                Edit it in Sanity Studio to add rich content, images, and more!
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <footer style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: '52px',
          width: '100%', // Match divider width
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <Link 
            href="/blog"
            className="cta-button"
            style={{ textDecoration: 'none' }}
          >
            ← Return
          </Link>
          
          <BackToTopButton />
        </footer>
        </div>
      </article>
    </div>
  )
}