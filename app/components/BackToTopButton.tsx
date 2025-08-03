'use client'

const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className="cta-button"
      style={{ cursor: 'pointer' }}
    >
      Back to Top
    </button>
  )
}

export default BackToTopButton