import { getExperience, getResumeSections, getResumeFile } from '../lib/resume'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

export default async function ResumePage() {
  let experience = []
  let resumeSections = []
  let resumeFile = null
  
  try {
    const [experienceData, resumeSectionsData, resumeFileData] = await Promise.all([
      getExperience(),
      getResumeSections(),
      getResumeFile()
    ])
    experience = experienceData
    resumeSections = resumeSectionsData
    resumeFile = resumeFileData
  } catch (error) {
    console.error('Failed to load resume data:', error)
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
              Failed to load resume data. Please try refreshing the page or contact support if the problem persists.
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
              <p className="page-hero-text">
                Explore my professional background, skills, and experience. Discover the journey that has shaped my design expertise and creative capabilities.
              </p>
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
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Image
                              src={job.companyLogo.asset.url}
                              alt={job.companyLogo.alt || `${job.company} logo`}
                              fill
                              style={{
                                objectFit: 'contain',
                                padding: '4px'
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

          {/* PDF Resume Download Section */}
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
                  Download Full Resume
                </div>
                <p style={{
                  color: '#666',
                  fontSize: '16px',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>
                  Get a complete PDF version of my resume for your records.
                </p>
                <a 
                  href={resumeFile.url} 
                  download={resumeFile.originalFilename || 'resume.pdf'}
                  className="resume-download-btn"
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
                    boxShadow: '0 4px 12px rgba(139,15,15,0.3)',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF Resume
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}