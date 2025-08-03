'use client'
import { useState, useEffect } from 'react'
import { client } from '../lib/sanity' // Adjust the import based on your Sanity client setup


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

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    // Uncomment and adjust this when you have your Sanity client set up
    
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

export default function ContactPage() {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

    useEffect(() => {
        const fetchData = async () => {
          const settings = await getSiteSettings()
          setSiteSettings(settings)
        }
        
        fetchData()
    }, []) // Added dependency array

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus(null)

        // Create FormData object
        const formDataToSend = new FormData()
        formDataToSend.append('access_key', '808a995e-bc99-4c0a-97e6-627b38030eb3') // Replace with your Web3Forms access key
        formDataToSend.append('name', formData.name)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('message', formData.message)
        formDataToSend.append('subject', `New Contact Form Message from ${formData.name}`)
        formDataToSend.append('from_name', 'Portfolio Contact Form')

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataToSend
            })

            const data = await response.json()

            if (data.success) {
                setSubmitStatus('success')
                setFormData({ name: '', email: '', message: '' }) // Reset form
            } else {
                console.error('Form submission error:', data)
                setSubmitStatus('error')
            }
        } catch (error) {
            console.error('Network error:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="page-frame">
            <div className="home-window">
                {/* Hero Section*/}
                <div className="page-hero">
                    <div className="page-hero-content">
                        <h1 className="page-hero-title">Contact</h1>
                        <p className="page-hero-text">
                            Ready to bring your vision to life? Get in touch to discuss your project, ask questions, or explore how we can work together to create something amazing.
                        </p>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="section-divider">
                    Send A Message
                </div>
                
                <div className="main-contact-content" style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: '40px 20px'
                }}>
                    {/* Success Message */}
                    {submitStatus === 'success' && (
                        <div style={{
                            background: '#d4edda',
                            border: '1px solid #c3e6cb',
                            color: '#155724',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            textAlign: 'center'
                        }}>
                            <span style={{ fontSize: '20px', marginRight: '8px' }}>✅</span>
                            Thank you! Your message has been sent successfully. I'll get back to you soon.
                        </div>
                    )}

                    {/* Error Message */}
                    {submitStatus === 'error' && (
                        <div style={{
                            background: '#f8d7da',
                            border: '1px solid #f5c6cb',
                            color: '#721c24',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            textAlign: 'center'
                        }}>
                            <span style={{ fontSize: '20px', marginRight: '8px' }}>❌</span>
                            Sorry, there was an error sending your message. Please try again.
                        </div>
                    )}

                    
                    <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="name" style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#171313'
                            }}>
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #171313',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#EAE3DE'
                                }}
                                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#8b0f0f'}
                                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#171313'}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#171313'
                            }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #171313',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#EAE3DE'
                                }}
                                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#8b0f0f'}
                                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#171313'}
                            />
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label htmlFor="message" style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#171313'
                            }}>
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #171313',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#EAE3DE'
                                }}
                                onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#8b0f0f'}
                                onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#171313'}
                                placeholder="Tell me about your project or any questions you have..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button"
                            style={{
                                width: '100%',
                                padding: '16px 32px',
                                background: isSubmitting ? '#ccc' : '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={(e) => {
                                if (!isSubmitting) {
                                    const target = e.target as HTMLButtonElement
                                    target.style.background = '#333'
                                    target.style.transform = 'translateY(-2px)'
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isSubmitting) {
                                    const target = e.target as HTMLButtonElement
                                    target.style.background = '#000'
                                    target.style.transform = 'translateY(0)'
                                }
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #fff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Other Ways to Contact Section */}
                <div className="section-divider">
                    {siteSettings?.contactSectionTitle || "Other Ways to Contact"}
                </div>

                <div className="other-contact-section" style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: '40px 20px',
                    textAlign: 'center'
                }}>
                    <p style={{ 
                        marginBottom: '32px', 
                        color: '#666',
                        fontSize: '16px',
                        lineHeight: '1.6'
                    }}>
                        {siteSettings?.contactSectionDescription || "Prefer a different way to get in touch? Here are some alternatives:"}
                    </p>

                    <div className="contact-methods" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'center'
                    }}>
                        {/* Email Contact */}
                        {siteSettings?.email && (
                            <a 
                                href={`mailto:${siteSettings.email}`}
                                className="contact-method-link"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px 24px',
                                    backgroundColor: '#171313',
                                    color: '#EAE3DE',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    minWidth: '200px'
                                }}
                                onMouseOver={(e) => {
                                    const target = e.target as HTMLAnchorElement
                                    target.style.backgroundColor = '#333'
                                    target.style.transform = 'translateY(-2px)'
                                }}
                                onMouseOut={(e) => {
                                    const target = e.target as HTMLAnchorElement
                                    target.style.backgroundColor = '#171313'
                                    target.style.transform = 'translateY(0)'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="mono">EMAIL</span>
                            </a>
                        )}

                        {/* LinkedIn Contact */}
                        {siteSettings?.linkedinUrl && (
                            <a 
                                href={siteSettings.linkedinUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="contact-method-link"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px 24px',
                                    backgroundColor: '#0077b5',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    minWidth: '200px'
                                }}
                                onMouseOver={(e) => {
                                    const target = e.target as HTMLAnchorElement
                                    target.style.backgroundColor = '#005885'
                                    target.style.transform = 'translateY(-2px)'
                                }}
                                onMouseOut={(e) => {
                                    const target = e.target as HTMLAnchorElement
                                    target.style.backgroundColor = '#0077b5'
                                    target.style.transform = 'translateY(0)'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                                </svg>
                                <span className="mono">LINKEDIN</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Add spinner animation */}
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    )
}