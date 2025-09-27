import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Developers - Mansa',
  description: 'Explore our trusted real estate developers and their projects',
}

export default async function DevelopersPage() {
  // First, get the developers category
  const developersCategory = await wpApi.categories.getBySlug('developers').catch(() => null)

  // Fetch posts from developers category
  const developers = developersCategory
    ? await wpApi.posts.getAll({
        per_page: 100,
        categories: [developersCategory.id],
        _embed: true
      }).catch(() => [])
    : []

  const items = developers

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="bg-[#224D56] text-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
            Our Developers
          </h1>
          <p className="text-xl opacity-90" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Trusted partners in real estate development
          </p>
        </div>
      </section>

      {/* Developers Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => {
                const featuredImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url
                const developerSlug = 'slug' in item ? item.slug : ''

                return (
                  <Link
                    key={item.id}
                    href={`/developers/${developerSlug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Developer Image */}
                    <div className="relative h-64 bg-gray-200">
                      {featuredImage ? (
                        <Image
                          src={featuredImage}
                          alt={item.title.rendered}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <span className="text-gray-500 text-lg">No image available</span>
                        </div>
                      )}
                    </div>

                    {/* Developer Info */}
                    <div className="p-6">
                      <h2
                        className="text-2xl font-bold mb-2 group-hover:text-[#224D56] transition-colors"
                        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                      >
                        {item.title.rendered}
                      </h2>

                      {item.excerpt.rendered && (
                        <div
                          className="text-gray-600 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: item.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                          }}
                        />
                      )}

                      {/* View Projects Link */}
                      <div className="mt-4 flex items-center text-[#224D56] font-semibold">
                        <span className="group-hover:mr-2 transition-all">View Projects</span>
                        <svg
                          className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No developers found. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}