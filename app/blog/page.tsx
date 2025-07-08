import { client } from '../lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '../lib/sanity'

// Define the blog post type
interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt?: string
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

// Fetch blog posts from Sanity
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(`
      *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
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
    `)
    console.log('Fetched posts:', posts) // Debug log
    return posts || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            {posts.length > 0 
              ? `Explore our latest ${posts.length} blog posts` 
              : 'No blog posts yet. Create your first post in Sanity Studio!'
            }
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No blog posts found
              </h3>
              <p className="text-gray-600 mb-4">
                This means your Sanity CMS isn't connected yet, or you haven't created any blog posts.
              </p>
              <div className="bg-blue-50 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  To test this blog:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Set up your Sanity project</li>
                  <li>2. Configure your environment variables</li>
                  <li>3. Create a blog post in Sanity Studio</li>
                  <li>4. Refresh this page to see your content</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {post.mainImage && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <Image
                      src={urlForImage(post.mainImage).width(400).height(225).url()}
                      alt={post.mainImage.alt || post.title}
                      width={400}
                      height={225}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
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
                        <span>{post.author.name}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link 
                      href={`/blog/${post.slug.current}`}
                      className="hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  )}
                  <Link 
                    href={`/blog/${post.slug.current}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}