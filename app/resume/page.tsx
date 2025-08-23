'use client'

import { getExperience, getResumeSections, getResumeFile } from '../lib/resume'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function ResumePage() {
  const [experience, setExperience] = useState([])
  const [resumeSections, setResumeSections] = useState([])
  const [resumeFile, setResumeFile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(true)

  useEffect(() => {
    async function loadResumeData() {
      try {
        const [experienceData, resumeSectionsData, resumeFileData] = await Promise.all([
          getExperience(),
          getResumeSections(),
          getResumeFile()
        ])
        setExperience(experienceData)
        setResumeSections(resumeSectionsData)
        setResumeFile(resumeFileData)
      } catch (error) {
        console.error('Failed to load resume data:', error)
        setError('Failed to load resume data. Please try refreshing the page.')
      } finally {
        setIsLoading(false)
      }
    }

    loadResumeData()
  }, [])

  useEffect(() => {
    if (isPdfModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isPdfModalOpen])

  const openPdfModal = () => {
    setIsPdfModalOpen(true)
  }

  const closePdfModal = () => {
    setIsPdfModalOpen(false)
    setIsPdfLoading(true)
  }

  if (isLoading) {
    return (
      <div className="page-frame">
        <div className="home-window">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 border-2 border-gray-300 flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-frame">
        <div className="home-window">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--primary-black)' }}>Unable to load resume</h3>
            <p className="max-w-md mx-auto" style={{ color: 'var(--accent-red)' }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const mobileStyles = `
    <style>
      @media (max-width: 968px) {
        .resume-main-grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 40px !important;
          padding: 30px 15px !important;
        }
        
        .experience-section,
        .resume-sections {
          width: 100% !important;
        }
        
        .job-header-mobile {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 16px !important;
        }
        
        .job-date-mobile {
          align-self: flex-start !important;
          font-size: 13px !important;
          padding: 6px 12px !important;
        }
        
        .section-title-mobile {
          font-size: 20px !important;
          margin-bottom: 24px !important;
        }
        
        .job-card-mobile {
          padding: 24px !important;
        }
        
        .job-title-mobile {
          font-size: 20px !important;
          line-height: 1.2 !important;
        }
        
        .company-mobile {
          font-size: 16px !important;
        }
        
        .skills-container-mobile {
          gap: 8px !important;
        }
        
        .skill-tag-mobile {
          padding: 6px 12px !important;
          font-size: 13px !important;
        }
      }
      
      @media (max-width: 640px) {
        .resume-main-grid {
          padding: 20px 10px !important;
          gap: 30px !important;
        }
        
        .job-card-mobile {
          padding: 20px !important;
        }
        
        .section-title-mobile {
          font-size: 18px !important;
        }
        
        .job-title-mobile {
          font-size: 18px !important;
        }
        
        .company-mobile {
          font-size: 15px !important;
        }
        
        .resume-section-card {
          padding: 20px !important;
        }
        
        .section-inner-title {
          font-size: 18px !important;
        }
        
        .job-header-mobile {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 16px !important;
        }
        
        .job-header-mobile > div:first-child {
          width: 50px !important;
          height: 50px !important;
          align-self: flex-start !important;
        }
        
        .resume-pdf-buttons {
          flex-direction: column !important;
          gap: 12px !important;
        }
        
        .resume-pdf-modal-content {
          margin: 0.5rem !important;
          max-height: 95vh !important;
        }
        
        .resume-pdf-modal-header {
          flex-direction: column !important;
          gap: 1rem !important;
        }
        
        .resume-pdf-modal-info {
          padding-right: 0 !important;
        }
        
        .resume-pdf-modal-buttons {
          align-self: flex-end !important;
        }
      }
    </style>
  `

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <div className="page-frame">
        <div className="home-window">
          {/* Hero Section */}
          <div className="page-hero">
            <div className="page-hero-content">
              <h1 className="page-hero-title">Resume</h1>
            </div>
          </div>

          {/* Main Resume Content */}
          <div className="resume-main-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 350px)',
            gap: '60px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px'
          }}>
            {/* Left Column - Experience */}
            <div className="experience-section">
              <div className="section-title-mobile" style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '32px',
                color: 'var(--primary-black)',
                position: 'relative',
                paddingBottom: '12px'
              }}>
                <span style={{
                  position: 'relative',
                  zIndex: 1,
                  background: 'var(--primary-white)',
                  paddingRight: '20px'
                }}>
                  Work Experience
                </span>
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'var(--accent-red)',
                  zIndex: 0
                }} />
              </div>
              
              {experience.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  background: 'var(--primary-white)',
                  border: `2px dashed #ddd`
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--primary-white)',
                    border: `2px solid var(--accent-red)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <span style={{ fontSize: '32px' }}>💼</span>
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: 'var(--primary-black)'
                  }}>
                    No experience added yet
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '16px',
                    lineHeight: '1.5'
                  }}>
                    Experience will appear here once added through Sanity CMS.
                  </p>
                </div>
              ) : (
                <div className="experience-list">
                  {experience.map((job, index) => (
                    <div key={job._id} className="job-card-mobile" style={{
                      marginBottom: '40px',
                      paddingBottom: '40px',
                      borderBottom: index === experience.length - 1 ? 'none' : `1px solid #e5e5e5`,
                      background: 'var(--primary-white)',
                      padding: '32px',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      {/* Job Header with Logo */}
                      <div className="job-header-mobile" style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}>
                        {/* Company Logo */}
                        {job.companyLogo && (
                          <div style={{
                            flexShrink: 0,
                            width: '60px',
                            height: '60px',
                            position: 'relative',
                            background: 'var(--primary-white)',
                            border: '1px solid #f0f0f0',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            <Image
                              src={job.companyLogo.asset.url}
                              alt={job.companyLogo.alt || `${job.company} logo`}
                              width={52}
                              height={52}
                              style={{
                                objectFit: 'contain',
                                maxWidth: '100%',
                                maxHeight: '100%'
                              }}
                              sizes="60px"
                            />
                          </div>
                        )}
                        
                        {/* Job Info Container */}
                        <div style={{ 
                          flex: 1, 
                          minWidth: '0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          {/* Title and Company */}
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <h3 className="job-title-mobile" style={{
                              fontSize: '22px',
                              fontWeight: '700',
                              margin: '0 0 8px 0',
                              color: 'var(--primary-black)',
                              lineHeight: '1.3',
                              wordWrap: 'break-word'
                            }}>
                              {job.jobTitle}
                            </h3>
                            <p className="company-mobile" style={{
                              fontSize: '18px',
                              color: 'var(--accent-red)',
                              margin: '0',
                              fontWeight: '600',
                              wordWrap: 'break-word'
                            }}>
                              {job.company}
                              {job.location && (
                                <span style={{ 
                                  color: '#666', 
                                  fontWeight: '400',
                                  fontSize: '16px',
                                  display: 'block'
                                }}>
                                  {job.location}
                                </span>
                              )}
                            </p>
                          </div>
                          
                          {/* Date Badge */}
                          <div className="job-date-mobile" style={{
                            background: 'var(--accent-red)',
                            color: 'var(--primary-white)',
                            padding: '8px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(139,15,15,0.2)',
                            flexShrink: 0,
                            alignSelf: 'flex-start'
                          }}>
                            {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate)}
                          </div>
                        </div>
                      </div>

                      {/* Job Description */}
                      {job.description && job.description.length > 0 && (
                        <div style={{
                          fontSize: '16px',
                          lineHeight: '1.6',
                          color: '#555'
                        }}>
                          <PortableText 
                            value={job.description}
                            components={{
                              block: {
                                normal: ({children}) => (
                                  <p style={{
                                    margin: '0 0 16px 0',
                                    wordWrap: 'break-word'
                                  }}>
                                    {children}
                                  </p>
                                ),
                                h4: ({children}) => (
                                  <h4 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: 'var(--primary-black)',
                                    margin: '24px 0 12px 0'
                                  }}>
                                    {children}
                                  </h4>
                                )
                              },
                              list: {
                                bullet: ({children}) => (
                                  <ul style={{
                                    listStyle: 'none',
                                    padding: '0',
                                    margin: '0 0 16px 0'
                                  }}>
                                    {children}
                                  </ul>
                                ),
                                number: ({children}) => (
                                  <ol style={{
                                    paddingLeft: '28px',
                                    margin: '0 0 16px 0',
                                    color: '#555'
                                  }}>
                                    {children}
                                  </ol>
                                )
                              },
                              listItem: {
                                bullet: ({children}) => (
                                  <li style={{
                                    position: 'relative',
                                    paddingLeft: '28px',
                                    marginBottom: '12px',
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    color: '#555',
                                    wordWrap: 'break-word'
                                  }}>
                                    <span style={{
                                      position: 'absolute',
                                      left: '8px',
                                      top: '12px',
                                      width: '6px',
                                      height: '6px',
                                      background: 'var(--accent-red)',
                                      flexShrink: 0
                                    }}></span>
                                    {children}
                                  </li>
                                ),
                                number: ({children}) => (
                                  <li style={{
                                    marginBottom: '8px',
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    wordWrap: 'break-word'
                                  }}>
                                    {children}
                                  </li>
                                )
                              },
                              marks: {
                                strong: ({children}) => (
                                  <strong style={{fontWeight: '600'}}>{children}</strong>
                                ),
                                em: ({children}) => (
                                  <em style={{fontStyle: 'italic'}}>{children}</em>
                                ),
                                underline: ({children}) => (
                                  <span style={{textDecoration: 'underline'}}>{children}</span>
                                ),
                                link: ({value, children}) => (
                                  <a 
                                    href={value?.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{
                                      color: 'var(--accent-red)',
                                      textDecoration: 'underline'
                                    }}
                                  >
                                    {children}
                                  </a>
                                )
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Resume Sections */}
            <div className="resume-sections">
              {resumeSections.length === 0 ? (
                <div>
                  <div className="section-title-mobile" style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '32px',
                    color: 'var(--primary-black)',
                    position: 'relative',
                    paddingBottom: '12px'
                  }}>
                    <span style={{
                      position: 'relative',
                      zIndex: 1,
                      background: 'var(--primary-white)',
                      paddingRight: '20px'
                    }}>
                      Additional Information
                    </span>
                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '0',
                      right: '0',
                      height: '2px',
                      background: 'var(--accent-red)',
                      zIndex: 0
                    }} />
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    background: 'var(--primary-white)',
                    border: `2px dashed #ddd`
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--primary-white)',
                      border: `2px solid var(--accent-red)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <span style={{ fontSize: '24px' }}>📝</span>
                    </div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--primary-black)'
                    }}>
                      No sections added yet
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      Skills, education, and other sections will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                resumeSections.map((section, index) => (
                  <div key={section._id} className="resume-section-card" style={{
                    marginBottom: '40px',
                    background: 'var(--primary-white)',
                    padding: '28px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div className="section-inner-title" style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '20px',
                      color: 'var(--primary-black)',
                      position: 'relative',
                      paddingBottom: '8px'
                    }}>
                      <span style={{
                        position: 'relative',
                        zIndex: 1,
                        background: 'var(--primary-white)',
                        paddingRight: '12px'
                      }}>
                        {section.title}
                      </span>
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        background: 'var(--accent-red)',
                        zIndex: 0
                      }} />
                    </div>
                    
                    {section.items && section.items.length > 0 ? (
                      <div>
                        {section.sectionType === 'skills' ? (
                          // Skills as modern tags
                          <div className="skills-container-mobile" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px'
                          }}>
                            {section.items.map((skill, skillIndex) => (
                              <span key={skillIndex} className="skill-tag-mobile" style={{
                                background: 'linear-gradient(135deg, var(--accent-red), #a61515)',
                                color: 'var(--primary-white)',
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 2px 4px rgba(139,15,15,0.2)',
                                transition: 'transform 0.2s ease',
                                wordWrap: 'break-word'
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          // Other sections as clean list
                          <ul style={{
                            listStyle: 'none',
                            padding: '0',
                            margin: '0'
                          }}>
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex} style={{
                                position: 'relative',
                                paddingLeft: '24px',
                                marginBottom: '12px',
                                fontSize: '15px',
                                lineHeight: '1.6',
                                color: '#555',
                                wordWrap: 'break-word'
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  left: '6px',
                                  top: '10px',
                                  width: '6px',
                                  height: '6px',
                                  background: 'var(--accent-red)',
                                  flexShrink: 0
                                }}></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <p style={{ 
                        color: '#999', 
                        fontSize: '14px',
                        fontStyle: 'italic',
                        margin: '0',
                        textAlign: 'center',
                        padding: '20px 0'
                      }}>
                        No items added yet
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PDF Resume Download/Preview Section */}
          {resumeFile && (
            <div style={{
              maxWidth: '1200px',
              margin: '60px auto 0',
              padding: '0 20px',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'var(--primary-white)',
                border: '1px solid #f0f0f0',
                padding: '40px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: 'var(--primary-black)'
                }}>
                  Full Resume PDF
                </div>
                <p style={{
                  color: '#666',
                  fontSize: '16px',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>
                  View my complete resume in PDF format or download it for your records.
                </p>
                <div className="resume-pdf-buttons" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={openPdfModal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'var(--accent-red)',
                      color: 'var(--primary-white)',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(139,15,15,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Preview Resume
                  </button>
                  <a 
                    href={resumeFile.url} 
                    download={resumeFile.originalFilename || 'resume.pdf'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'transparent',
                      color: 'var(--accent-red)',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      border: '2px solid var(--accent-red)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                   
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {isPdfModalOpen && resumeFile && (
        <>
          {/* Backdrop */}
          <div 
            className="resume-pdf-modal-backdrop"
            onClick={closePdfModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(23, 19, 19, 0.8)',
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.3s ease-out'
            }}
          />
          
          {/* Modal Container */}
          <div 
            className="resume-pdf-modal-container"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <div 
              className="resume-pdf-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'var(--primary-white)',
                border: '2px solid var(--primary-black)',
                borderRadius: 0,
                boxShadow: '0 25px 50px -12px rgba(23, 19, 19, 0.4)',
                width: '100%',
                maxWidth: '72rem',
                maxHeight: '90vh',
                overflow: 'hidden',
                animation: 'modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            >
              {/* Header */}
              <div 
                className="resume-pdf-modal-header"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  borderBottom: '2px solid var(--primary-black)'
                }}
              >
                <div 
                  className="resume-pdf-modal-info"
                  style={{
                    flex: 1,
                    paddingRight: '1rem'
                  }}
                >
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--primary-black)',
                    marginBottom: '0.5rem'
                  }}>
                    Resume PDF
                  </h2>
                  <p style={{
                    color: 'var(--primary-black)',
                    opacity: 0.7,
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '0.75rem'
                  }}>
                    Complete resume in PDF format
                  </p>
                </div>
                
                <div 
                  className="resume-pdf-modal-buttons"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <a
                    href={resumeFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resumeFile.originalFilename || 'resume.pdf'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--accent-red)',
                      color: 'var(--primary-white)',
                      padding: '0.5rem 1rem',
                      borderRadius: 0,
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  
                  >
                    <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </a>
                  <button
                    onClick={closePdfModal}
                    style={{
                      padding: '0.5rem',
                      color: 'var(--primary-black)',
                      background: 'transparent',
                      border: '2px solid var(--primary-black)',
                      borderRadius: 0,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    
                  >
                    <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div style={{
                position: 'relative',
                height: 'calc(90vh - 140px)'
              }}>
                {isPdfLoading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--primary-white)',
                    zIndex: 10
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        border: '3px solid var(--accent-red)',
                        borderTop: '3px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--primary-black)',
                        opacity: 0.7,
                        margin: 0
                      }}>
                        Loading PDF...
                      </p>
                    </div>
                  </div>
                )}
                <iframe
                  src={`${resumeFile.url}#view=FitH&toolbar=1&navpanes=1&scrollbar=1`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 0
                  }}
                  onLoad={() => setIsPdfLoading(false)}
                  title="Resume PDF"
                />
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes modalEnter {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </>
  )
}