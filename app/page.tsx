import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Test Portfolio</span>{' '}
                  <span className="block text-blue-600 xl:inline">with Sanity CMS</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  This is a test portfolio built to explore Sanity CMS integration. 
                  Use this project to test content management, blog posting, and data fetching.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/blog"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      View Blog
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Test Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What you can test with this portfolio
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  📝
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Content Management
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Test creating and managing blog posts through Sanity Studio
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  🔗
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  API Integration
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Learn how to connect your frontend to Sanity's API
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  🎨
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Rich Content
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Test rich text editing and media management capabilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}