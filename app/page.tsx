'use client'
import { client } from './lib/sanity'
import { urlForImage } from './lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import PortfolioCard from './components/PortfolioCard'
import { transform } from 'next/dist/build/swc'

// ... [Keep all your existing interfaces the same] ...

interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt?: string
  featured?: boolean
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

interface PortfolioPost {
  _id: string
  title: string
  slug: { current: string }
  summary: string
  publishedAt: string
  tags?: string[]
  imageAlt?: string
  featured?: boolean
  previewImage?: {
    asset: { url: string }
    alt?: string
  }
  pdfFile: {
    asset: {
      url: string
      originalFilename: string
      size: number
    }
  }
}

interface QAPost {
  _id: string
  question: string
  answer: string
  slug: { current: string }
  publishedAt: string
  tags?: string[]
  category?: string
  featured?: boolean
}

interface ExperienceItem {
  _id: string
  jobTitle: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current?: boolean
}

interface SiteSettings {
    heroLabel?: string
    name?: string
    tagline?: string
    avatar?: {
        asset: {
        _ref: string
        url?: string
        }
        alt?: string
    }
    primaryButtonText?: string
    secondaryButtonText?: string
    linkedinUrl?: string
    firstName?: string
    lastName?: string
    // New fields for contact information
    email?: string
    contactSectionTitle?: string
    contactSectionDescription?: string
}

// ... [Keep all your existing async functions the same] ...

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

async function getFeaturedPortfolio(): Promise<PortfolioPost[]> {
  try {
    const portfolio = await client.fetch(`
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
    return portfolio || []
  } catch (error) {
    console.error('Error fetching featured portfolio:', error)
    return []
  }
}

async function getFeaturedQA(): Promise<QAPost[]> {
  try {
    const qaItems = await client.fetch(`
      *[_type == "qa" && defined(publishedAt) && featured == true] | order(publishedAt desc) [0...3] {
        _id,
        question,
        answer,
        slug,
        publishedAt,
        featured
      }
    `)
    return qaItems || []
  } catch (error) {
    console.error('Error fetching featured Q&A:', error)
    return []
  }
}

async function getRecentExperience(): Promise<ExperienceItem[]> {
  try {
    const experience = await client.fetch(`
      *[_type == "experience"] | order(startDate desc) [0...2] {
        _id,
        jobTitle,
        company,
        location,
        startDate,
        endDate,
        current
      }
    `)
    return experience || []
  } catch (error) {
    console.error('Error fetching recent experience:', error)
    return []
  }
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0]{
        heroLabel,
        name,
        tagline,
        avatar{
          asset->{
            _id,
            url
          },
          alt
        },
        primaryButtonText,
        secondaryButtonText,
        linkedinUrl,
        email,
        contactSectionTitle,
        contactSectionDescription
      }
    `)
    return settings || null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

// ... [Keep your existing component functions the same] ...

function HomeQACard({ post, index }: { post: QAPost; index: number }) {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="qa-card-vertical">
      <div className="qa-question-vertical">
        <div>
          <h3>{post.question}</h3>
          {post.category && (
            <div className="qa-meta-vertical">
              <span>{post.category}</span>
            </div>
          )}
        </div>
      </div>
      <div className="qa-answer-vertical">
        <div>
          <p>
            {post.answer.length > 200 
              ? `${post.answer.substring(0, 200)}...` 
              : post.answer
            }
          </p>
          <div className="qa-footer-vertical">
            <span className="qa-date-vertical">{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumePreviewCard({ experience }: { experience: ExperienceItem }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  return (
    <div className="resume-preview-card" style={{
      background: 'var(--primary-white)',
      border: '1px solid var(--primary-black)',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      minWidth: '340px',
      maxWidth: '420px',
      minHeight: '150px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div className="resume-preview-header" style={{ marginBottom: '12px' }}>
        <h4 style={{
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: 'var(--primary-black)',
          lineHeight: '1.3',
        }}>{experience.jobTitle}</h4>
        <div className="resume-preview-date" style={{
          background: 'var(--accent-red)',
          color: 'var(--primary-white)',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'inline-block'
        }}>
          {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate || '')}
        </div>
      </div>
      <div className="resume-preview-company" style={{
        color: 'var(--accent-red)',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '1.4',
      }}>
        {experience.company}
        {experience.location && (
          <span className="resume-location" style={{ color: '#666', fontWeight: '400' }}>
            {' '}• {experience.location}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [featuredPortfolio, setFeaturedPortfolio] = useState<PortfolioPost[]>([])
  const [featuredQA, setFeaturedQA] = useState<QAPost[]>([])
  const [recentExperience, setRecentExperience] = useState<ExperienceItem[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [glitchTrigger, setGlitchTrigger] = useState(false)

  // Mobile class detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const fetchData = async () => {
      const posts = await getFeaturedPosts()
      const portfolio = await getFeaturedPortfolio()
      const qa = await getFeaturedQA()
      const experience = await getRecentExperience()
      const settings = await getSiteSettings()
      setFeaturedPosts(posts)
      setFeaturedPortfolio(portfolio)
      setFeaturedQA(qa)
      setRecentExperience(experience)
      setSiteSettings(settings)
    }

    fetchData()

    // Trigger glitch animation on mount
    const timer = setTimeout(() => {
      setGlitchTrigger(true)
    }, 800)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleNameClick = () => {
    setGlitchTrigger(false)
    setTimeout(() => setGlitchTrigger(true), 50)
  }

  // Get the display name - prefer first/last name split, fallback to full name
  const getDisplayName = () => {
    if (siteSettings?.firstName && siteSettings?.lastName) {
      return `${siteSettings.firstName} ${siteSettings.lastName}`
    }
    return siteSettings?.name || 'Theodore Jolly'
  }

  const displayName = getDisplayName()

  return (
    <div className="page-frame">
      <div className="home-window">
        <div className="fade-transition" id="main-content">
          
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <div className={isMobile ? "hero-text-mobile" : "hero-text"}>
                <div className="hero-label mono">
                  {siteSettings?.heroLabel || 'MARKETING'}
                </div>
                
                {/* Updated hero name with mobile-specific classes */}
                <h1 
                  className={`${isMobile ? 'hero-name-mobile' : 'hero-name'} ${glitchTrigger ? 'glitch-animate' : ''}`}
                  data-text={displayName}
                  onClick={handleNameClick}
                  style={{ cursor: 'pointer' }}
                >
                  {displayName}
                </h1>
                
                <p className={isMobile ? "hero-description-mobile" : "hero-description"}>
                  {siteSettings?.tagline ? (
                    <span dangerouslySetInnerHTML={{ __html: siteSettings.tagline }} />
                  ) : (
                    <>
                      Your tagline description goes here — <em>making complex ideas accessible</em>
                    </>
                  )}
                </p>

                <div className="hero-separators">
                  <div className="separator-main"></div>
                  <div className="separator-accent"></div>
                </div>

                <div className="hero-actions">
                  <Link 
                    href="/contact" 
                    className={`cta-button primary ${isMobile ? 'cta-button-mobile' : ''}`}
                  >
                    {isMobile ? "Let's Work" : (siteSettings?.primaryButtonText || "Let's Work Together")}
                  </Link>
                  <Link 
                    href="/portfolio" 
                    className={`cta-button secondary ${isMobile ? 'cta-button-mobile' : ''}`}
                  >
                    {isMobile ? "View Work" : (siteSettings?.secondaryButtonText || 'View Work')}
                  </Link>
                </div>

                <div className="hero-social">
                  <a 
                    href={siteSettings?.linkedinUrl || "https://linkedin.com/in/yourprofile"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="linkedin-link"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                    </svg>
                    <span className="mono">LINKEDIN</span>
                  </a>
                </div>
              </div>

              <div className="avatar-container">
                <div className="avatar-frame">
                  {siteSettings?.avatar?.asset ? (
                    <img 
                      className="avatar" 
                      src={urlForImage(siteSettings.avatar)
                        .width(450)
                        .height(450)
                        .quality(90)
                        .url()}
                      alt={siteSettings.avatar.alt || displayName || 'Hero Image'} 
                    />
                  ) : (
                    <img 
                      className="avatar" 
                      src="/path-to-your-image.jpg" 
                      alt="Hero Image" 
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Keep all your other sections exactly the same... */}
          {/* Blog Section */}
          <section className="blog-section">
            <div className="section-divider">Featured Blog Posts</div>
            <div className="home-blog-container">
              <div className="home-blog-posts">
                {featuredPosts.length > 0 ? (
                  <div className="home-blog-cards">
                    {featuredPosts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug.current}`}
                        className="home-blog-card"
                      >
                        <div className="home-blog-card-content">
                          {post.mainImage && (
                            <div className="home-blog-card-image">
                              <Image
                                src={urlForImage(post.mainImage).width(400).height(400).url()}
                                alt={post.mainImage.alt || post.title}
                                width={400}
                                height={400}
                              />
                            </div>
                          )}
                          <div className="home-blog-card-footer">
                            <h3 className="home-blog-card-title">{post.title}</h3>
                            <div className="home-blog-card-meta">
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </time>
                              {post.author && (
                                <>
                                  <span className="home-blog-card-separator">•</span>
                                  <span>{post.author.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="home-blog-cards">
                    <div className="home-blog-card" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '260px',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <h3 style={{ color: '#666', textAlign: 'center' }}>
                        No featured posts yet
                      </h3>
                      <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
                        Mark some posts as featured in Sanity Studio
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="home-blog-button">
                <Link 
                  href="/blog" 
                  className="btn-primary home-blog-view-all"
                >
                  View All Posts →
                </Link>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="portfolio-section">
            <div className="section-divider">Featured Portfolio</div>
            <div className="home-portfolio-container">
              <div className="home-portfolio-posts">
                {featuredPortfolio.length > 0 ? (
                  <div className="home-portfolio-cards">
                    {featuredPortfolio.map((post) => (
                      <PortfolioCard key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="home-portfolio-cards">
                    <div className="home-portfolio-placeholder" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '260px',
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      <h3 style={{ color: '#666', textAlign: 'center' }}>
                        No featured portfolio yet
                      </h3>
                      <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
                        Mark some portfolio items as featured in Sanity Studio
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="home-blog-button">
                <Link 
                  href="/portfolio" 
                  className="btn-primary home-blog-view-all"
                >
                  View All Work →
                </Link>
              </div>
            </div>
          </section>

          {/* Resume Section */}
          <section className="resume-section">
            <div className="section-divider">Professional Experience</div>
            <div className="home-blog-container" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              minHeight: 'auto',
              marginTop: '10px',
              marginBottom: '10px'
            }}>
              <div className="home-blog-posts" style={{
                flex: 1,
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0
              }}>
                {recentExperience.length > 0 ? (
                  <div className="resume-preview-cards" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    margin: 0,
                    padding: 0
                  }}>
                    {recentExperience.map((experience) => (
                      <ResumePreviewCard key={experience._id} experience={experience} />
                    ))}
                  </div>
                ) : (
                  <div className="resume-preview-cards" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    margin: 0,
                    padding: 0
                  }}>
                    <div className="resume-preview-placeholder" style={{
                      background: '#f9f9f9',
                      border: '2px dashed var(--primary-black)',
                      padding: '30px',
                      textAlign: 'center',
                      flex: 1,
                      minWidth: '280px'
                    }}>
                      <div className="resume-preview-header">
                        <h4>No Experience Added Yet</h4>
                      </div>
                      <div className="resume-preview-company">
                        Add your work experience through Sanity Studio to display it here.
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="home-blog-button" style={{
                alignSelf: 'center',
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0
              }}>
                <Link 
                  href="/resume" 
                  className="btn-primary home-blog-view-all"
                >
                  View Full Resume →
                </Link>
              </div>
            </div>
          </section>

          {/* Q&A Section */}
          <section className="qa-section">
            <div className="section-divider">Questions & Answers</div>
            <div className="qa-home-container">
              <div className="qa-home-content">
                {featuredQA.length > 0 ? (
                  <div className="qa-cards-row">
                    {featuredQA.slice(0, 2).map((post, index) => (
                      <HomeQACard key={post._id} post={post} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="qa-cards-row">
                    <div className="qa-card-vertical qa-placeholder-vertical">
                      <div className="qa-question-vertical">
                        <div>
                          <h3>No Featured Q&As Yet</h3>
                        </div>
                      </div>
                      <div className="qa-answer-vertical">
                        <div>
                          <p>Mark some Q&A items as featured in Sanity Studio to display them here as a preview.</p>
                        </div>
                      </div>
                    </div>
                    <div className="qa-card-vertical qa-placeholder-vertical">
                      <div className="qa-question-vertical">
                        <div>
                          <h3>Coming Soon</h3>
                        </div>
                      </div>
                      <div className="qa-answer-vertical">
                        <div>
                          <p>More Q&A content will be added here as the site grows and develops.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="home-blog-button">
                <Link 
                  href="/qa" 
                  className="btn-primary home-blog-view-all"
                >
                  View All Q&As →
                </Link>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="contact-section">
            <div className="section-divider">Contact Information</div>
            <div className="contact-simple-container">
              <div className="contact-buttons-row">
                {siteSettings?.email && (
                  <a 
                    href={`mailto:${siteSettings.email}`}
                    className="contact-method-button"
                  >
                    <span>Email</span>
                  </a>
                )}
                
                {siteSettings?.linkedinUrl && (
                  <a 
                    href={siteSettings.linkedinUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-method-button"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}
                
                <Link 
                  href="/contact" 
                  className="contact-method-button contact-form-button"
                >
                  <span>Leave a message</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}