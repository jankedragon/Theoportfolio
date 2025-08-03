import { getQAPosts } from '../lib/qa'
import QACard from '../components/QACard'

export default async function QAPage() {
  let posts = []
 
  try {
    posts = await getQAPosts()
  } catch (error) {
    console.error('Failed to load Q&A posts:', error)
    return (
      <div className="page-frame">
        <div className="home-window">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load Q&A</h3>
            <p className="text-red-500 max-w-md mx-auto">
              Failed to load Q&A items. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-frame">
      <div className="home-window">
        {/* Hero Section */}
        <div className="page-hero">
          <div className="page-hero-content">
            <h1 className="page-hero-title">Questions & Answers</h1>
            <p className="page-hero-text">
              Find answers to frequently asked questions about my work process, approach, and expertise. Get insights into how we can collaborate effectively.
            </p>
          </div>
        </div>
       
        {/* Q&A Section */}
        <div className="section-divider">
          All Questions
        </div>
       
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#f0f0f0',
              border: '1px solid #000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <span style={{ fontSize: '32px' }}>❓</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
              No questions yet
            </h3>
            <p style={{ color: '#666', maxWidth: '400px', margin: '0 auto' }}>
              Q&A items will appear here once they're added. Check back soon for helpful answers!
            </p>
          </div>
        ) : (
          <div className="qa-list">
            {posts.map((post, index) => (
              <QACard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}