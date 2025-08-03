import { getPortfolioPosts, getFeaturedPortfolio } from '../lib/portfolio'
import PortfolioCard from '../components/PortfolioCard'

export default async function PortfolioPage() {
  let posts = []
  let featuredPortfolio = []

  try {
    posts = await getPortfolioPosts()
    featuredPortfolio = await getFeaturedPortfolio()
  } catch (error) {
    console.error('Failed to load portfolio posts:', error)
    return (
      <div className="page-frame">
        <div className="home-window">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load portfolio</h3>
            <p className="text-red-500 max-w-md mx-auto">
              Failed to load portfolio items. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-frame">
      <div className="home-window">
        {/* Hero Section*/}
        <div className="page-hero">
          <div className="page-hero-content">
            <h1 className="page-hero-title">Portfolio</h1>
            <p className="page-hero-text">
              Explore my collection of design work, branding projects, and creative solutions 
              that bring ideas to life through thoughtful visual communication.
            </p>
          </div>
        </div>
        

        
        {/* Featured Portfolio Section */}
        {featuredPortfolio.length > 0 && (
          <>
            <div className="section-divider">Featured Portfolio Projects</div>
            <div className="portfolio-grid-container">
              {featuredPortfolio.map((post) => (
                <PortfolioCard key={post._id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* All Portfolio Section */}
        <div className="section-divider">All Portfolio Projects</div>
        <div className="portfolio-grid-container">
          {posts.map((post) => (
            <PortfolioCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}