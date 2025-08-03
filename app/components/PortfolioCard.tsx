'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface PortfolioPost {
  _id: string
  title: string
  slug: { current: string }
  summary: string
  publishedAt: string
  tags?: string[]
  imageAlt?: string
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

interface Props {
  post: PortfolioPost
}

const PortfolioCard: React.FC<Props> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsLoading(true)
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
  }

  const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <>
      {/* Card */}
      <div
        onClick={openModal}
        className="portfolio-card"
      >
        {/* Image Container */}
        <div className="portfolio-card-image-container">
          <Image
            src={post.previewImage?.asset.url || '/placeholder-image.jpg'}
            alt={post.previewImage?.alt || post.imageAlt || `Preview of ${post.title}`}
            width={400}
            height={224}
            className="portfolio-card-image"
          />
          {/* Overlay */}
          <div className="portfolio-card-overlay" />
          
          {/* Hover content */}
          <div className="portfolio-card-hover-content">
            <div className="portfolio-card-view-button">
              View Project
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="portfolio-card-content">
          <h3 className="portfolio-card-title">
            {post.title}
          </h3>
          <p className="portfolio-card-summary">
            {post.summary}
          </p>
          <div className="portfolio-card-meta">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{formatFileSize(post.pdfFile.asset.size)}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="portfolio-modal-backdrop"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="portfolio-modal-container">
            <div 
              className="portfolio-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="portfolio-modal-header">
                <div className="portfolio-modal-info">
                  <h2 className="portfolio-modal-title">
                    {post.title}
                  </h2>
                  <p className="portfolio-modal-summary">
                    {post.summary}
                  </p>
                  <div className="portfolio-modal-meta">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span>{formatFileSize(post.pdfFile.asset.size)}</span>
                  </div>
                </div>
                
                <div className="portfolio-modal-buttons">
                  <button
                    onClick={() => window.open(post.pdfFile.asset.url, '_blank')}
                    className="portfolio-download-btn"
                  >
                    <svg className="portfolio-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={closeModal}
                    className="portfolio-close-btn"
                  >
                    <svg className="portfolio-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="portfolio-pdf-container">
                {isLoading && (
                  <div className="portfolio-loading-container">
                    <div className="portfolio-loading-content">
                      <div className="portfolio-spinner"></div>
                      <p>Loading PDF...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={`${post.pdfFile.asset.url}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="portfolio-pdf-iframe"
                  onLoad={() => setIsLoading(false)}
                  title={`PDF for ${post.title}`}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .portfolio-card {
          cursor: pointer;
          background: #EAE3DE;
          border: 1px solid #171313;
          border-radius: 0;
          box-shadow: 0 10px 15px -3px rgba(23, 19, 19, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 20rem;
          width: 100%;
          overflow: hidden;
          transform: translateY(0) scale(1);
        }
        
        .portfolio-card:hover {
          box-shadow: 0 25px 50px -12px rgba(23, 19, 19, 0.25);
          transform: translateY(-8px) scale(1.02);
          border-color: #8b0f0f;
        }
        
        .portfolio-card-image-container {
          position: relative;
          height: 14rem;
          width: 100%;
          overflow: hidden;
        }
        
        .portfolio-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .portfolio-card:hover .portfolio-card-image {
          transform: scale(1.1);
        }
        
        .portfolio-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(23, 19, 19, 0.8), transparent, transparent);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .portfolio-card:hover .portfolio-card-overlay {
          opacity: 1;
        }
        
        .portfolio-card-hover-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(1rem);
          transition: all 0.5s ease;
        }
        
        .portfolio-card:hover .portfolio-card-hover-content {
          opacity: 1;
          transform: translateY(0);
        }
        
        .portfolio-card-view-button {
          background: #EAE3DE;
          backdrop-filter: blur(4px);
          padding: 0.5rem 1rem;
          border-radius: 0;
          border: 2px solid #8b0f0f;
          font-size: 0.875rem;
          font-weight: 500;
          color: #171313;
          box-shadow: 0 10px 15px -3px rgba(23, 19, 19, 0.1);
        }
        
        .portfolio-card-content {
          padding: 1.5rem;
        }
        
        .portfolio-card-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #171313;
          line-height: 1.2;
          transition: color 0.3s ease;
          margin-bottom: 0.5rem;
        }
        
        .portfolio-card:hover .portfolio-card-title {
          color: #8b0f0f;
        }
        
        .portfolio-card-summary {
          font-size: 0.875rem;
          color: #171313;
          opacity: 0.7;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }
        
        .portfolio-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #171313;
          opacity: 0.5;
        }
        
        .portfolio-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(23, 19, 19, 0.8);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
        }
        
        .portfolio-modal-container {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .portfolio-modal-content {
          position: relative;
          background: #EAE3DE;
          border: 2px solid #171313;
          border-radius: 0;
          box-shadow: 0 25px 50px -12px rgba(23, 19, 19, 0.4);
          width: 100%;
          max-width: 72rem;
          max-height: 90vh;
          overflow: hidden;
          animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .portfolio-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 2px solid #171313;
        }
        
        .portfolio-modal-info {
          flex: 1;
          padding-right: 1rem;
        }
        
        .portfolio-modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #171313;
          margin-bottom: 0.5rem;
        }
        
        .portfolio-modal-summary {
          color: #171313;
          opacity: 0.7;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        
        .portfolio-modal-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
          color: #171313;
          opacity: 0.6;
        }
        
        .portfolio-modal-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .portfolio-download-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #8b0f0f;
          color: #EAE3DE;
          padding: 0.5rem 1rem;
          border-radius: 0;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .portfolio-download-btn:hover {
          background: #6b0a0a;
          transform: translateY(-1px);
        }
        
        .portfolio-close-btn {
          padding: 0.5rem;
          color: #171313;
          background: transparent;
          border: 2px solid #171313;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .portfolio-close-btn:hover {
          color: #EAE3DE;
          background: #171313;
        }
        
        .portfolio-btn-icon {
          width: 1rem;
          height: 1rem;
        }
        
        .portfolio-pdf-container {
          position: relative;
          height: calc(90vh - 140px);
        }
        
        .portfolio-loading-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EAE3DE;
          z-index: 10;
        }
        
        .portfolio-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .portfolio-loading-content p {
          font-size: 0.875rem;
          color: #171313;
          opacity: 0.7;
          margin: 0;
        }
        
        .portfolio-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid #8b0f0f;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .portfolio-pdf-iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        
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
        
        @media (max-width: 768px) {
          .portfolio-modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }
          
          .portfolio-modal-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .portfolio-modal-info {
            padding-right: 0;
          }
          
          .portfolio-modal-buttons {
            align-self: flex-end;
          }
        }
      `}</style>
    </>
  )
}

export default PortfolioCard
