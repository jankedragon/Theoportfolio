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
  featured?: boolean // Add featured field
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

// Fetch featured blog posts (up to 4)
async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(`
      *[_type == "post" && defined(publishedAt) && featured == true] | order(publishedAt desc) [0...4] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        featured,
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
    return posts || []
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

// Fetch all blog posts with pagination
async function getAllPosts(page: number = 1, limit: number = 12): Promise<{ posts: BlogPost[], totalPages: number, currentPage: number }> {
  try {
    const offset = (page - 1) * limit
    
    // Get total count for pagination
    const totalCount = await client.fetch(`count(*[_type == "post" && defined(publishedAt)])`)
    const totalPages = Math.ceil(totalCount / limit)
    
    const posts = await client.fetch(`
      *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) [${offset}...${offset + limit}] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        featured,
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
    
    return {
      posts: posts || [],
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return {
      posts: [],
      totalPages: 0,
      currentPage: 1
    }
  }
}

// Pagination component
function Pagination({ currentPage, totalPages, basePath }: { currentPage: number, totalPages: number, basePath: string }) {
  if (totalPages <= 1) return null

  const pages = []
  const showEllipsis = totalPages > 7

  if (showEllipsis) {
    // Show first page
    pages.push(1)
    
    // Show ellipsis if current page is far from start
    if (currentPage > 4) {
      pages.push('...')
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 3) {
      pages.push('...')
    }
    
    // Show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  } else {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  }

  return (
    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '48px' }}>
      {/* Previous button */}
      {currentPage > 1 && (
        <Link 
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="pagination-btn"
          style={{ 
            padding: '8px 16px', 
            border: '1px solid #000', 
            backgroundColor: '#fff', 
            color: '#000',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          ← Previous
        </Link>
      )}

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return <span key={index} style={{ padding: '8px 4px', color: '#666' }}>...</span>
        }
        
        const pageNum = page as number
        const isActive = pageNum === currentPage
        
        return (
          <Link
            key={pageNum}
            href={pageNum === 1 ? basePath : `${basePath}?page=${pageNum}`}
            className={`pagination-btn ${isActive ? 'active' : ''}`}
            style={{
              padding: '8px 12px',
              border: '1px solid #000',
              backgroundColor: isActive ? '#000' : '#fff',
              color: isActive ? '#fff' : '#000',
              textDecoration: 'none',
              minWidth: '40px',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {pageNum}
          </Link>
        )
      })}

      {/* Next button */}
      {currentPage < totalPages && (
        <Link 
          href={`${basePath}?page=${currentPage + 1}`}
          className="pagination-btn"
          style={{ 
            padding: '8px 16px', 
            border: '1px solid #000', 
            backgroundColor: '#fff', 
            color: '#000',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Next →
        </Link>
      )}
    </div>
  )
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1')
  const featuredPosts = await getFeaturedPosts()
  const { posts: allPosts, totalPages } = await getAllPosts(currentPage, 12)

  return (
    <div className="page-frame">
      <div className="main-blog-content">
        {/* Hero Section*/}
        <div className="page-hero">
          <div className="page-hero-content">
            <h1 className="page-hero-title">Blog</h1>
            <p className="page-hero-text">
              Dive deeper into my creative process, design insights, and behind-the-scenes stories from recent projects and collaborative experiences.
            </p>
          </div>
        </div>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <>
            <div className="section-divider">Featured Blog Posts</div>
            <div className="blog-grid featured-grid" style={{ marginBottom: '48px' }}>
              {featuredPosts.map((post) => (
                <Link 
                  key={post._id} 
                  href={`/blog/${post.slug.current}`}
                  className="blog-card"
                >
                  <div className="blog-card-content">
                    {post.mainImage && (
                      <div className="blog-card-image">
                        <Image
                          src={urlForImage(post.mainImage).width(280).height(280).url()}
                          alt={post.mainImage.alt || post.title}
                          width={280}
                          height={280}
                        />
                      </div>
                    )}
                    <div className="blog-card-footer">
                      <h3 className="blog-card-title">{post.title}</h3>
                      <div className="blog-card-meta">
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        {post.author && (
                          <>
                            <span className="blog-card-separator">•</span>
                            <span>{post.author.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* All Posts Section */}
        <div className="section-divider">
          All Posts
        </div>

        {allPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #000', 
              padding: '32px', 
              maxWidth: '600px', 
              margin: '0 auto' 
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                No blog posts found
              </h3>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                This means your Sanity CMS isn't connected yet, or you haven't created any blog posts.
              </p>
              <div style={{ 
                background: '#f0f0f0', 
                padding: '16px', 
                border: '1px solid #000', 
                marginTop: '16px' 
              }}>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Using the same blog-cards class with unified styling */}
            <div className="blog-cards">
              {allPosts.map((post) => (
                <Link 
                  key={post._id} 
                  href={`/blog/${post.slug.current}`}
                  className="blog-card"
                >
                  <div className="blog-card-content">
                    {post.mainImage && (
                      <div className="blog-card-image">
                        <Image
                          src={urlForImage(post.mainImage).width(280).height(280).url()}
                          alt={post.mainImage.alt || post.title}
                          width={280}
                          height={280}
                        />
                      </div>
                    )}
                    <div className="blog-card-footer">
                      <h3 className="blog-card-title">{post.title}</h3>
                      <div className="blog-card-meta">
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        {post.author && (
                          <>
                            <span className="blog-card-separator">•</span>
                            <span>{post.author.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              basePath="/blog" 
            />
          </>
        )}
      </div>
    </div>
  )
}