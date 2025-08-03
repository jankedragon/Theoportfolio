'use client'

interface QAPost {
  _id: string
  question: string
  answer: string
  slug: { current: string }
  publishedAt: string
  category?: string
}

interface QACardProps {
  post: QAPost
  index: number // Add index prop for staggering
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function QACard({ post, index }: QACardProps) {
  // Use index for staggering but keep question always on left
  const isStaggered = index % 2 === 1

  return (
    <div className={`qa-item ${isStaggered ? 'qa-item-staggered' : ''}`}>
      <div className="qa-question">
        <div>
          <h3>{post.question}</h3>
          {post.category && (
            <div className="qa-meta">
              <span>{post.category}</span>
            </div>
          )}
        </div>
      </div>
      <div className="qa-answer">
        <div>
          <p>{post.answer}</p>
          <div className="qa-footer">
            <span className="qa-date">{formatDate(post.publishedAt)}</span>
            
          </div>
        </div>
      </div>
    </div>
  )
}