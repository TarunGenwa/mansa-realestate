import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Developers - Mansa',
  description: 'Browse our trusted real estate developers and their projects.',
}

export default async function DevelopersPage() {
  // Get developers category
  const developersCategory = await wpApi.categories.getBySlug('developers').catch(() => null)

  let developers: any[] = []

  if (developersCategory) {
    // Fetch all posts in the developers category
    developers = await wpApi.posts.getAll({
      categories: [developersCategory.id],
      per_page: 100,
      _embed: true,
      orderby: 'title',
      order: 'asc'
    }).catch(() => [])
  }

  console.log('Developers Category:', developersCategory)
  console.log('Developers found:', developers.length)

  return (
    <div className="min-h-screen pt-24">
      {/* Page Header */}
      <section className="py-12" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-6"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              lineHeight: '1.2'
            }}
          >
            Our Developers
          </h1>
          <p
            className="text-lg md:text-xl text-gray-600 max-w-3xl"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              lineHeight: '1.6'
            }}
          >
            Partner with Dubai's most trusted real estate developers. Explore their portfolios and discover exceptional properties.
          </p>
        </div>
      </section>

      {/* Developers Grid */}
      <section className="py-12" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          {developers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developers.map((developer: any) => {
                const featuredImage = developer._embedded?.['wp:featuredmedia']?.[0]
                const excerpt = developer.excerpt.rendered
                  .replace(/<[^>]*>/g, '')
                  .substring(0, 150)

                return (
                  <Link
                    key={developer.id}
                    href={`/developers/${developer.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Developer Image */}
                    <div className="relative h-64 bg-gray-200">
                      {featuredImage ? (
                        <Image
                          src={featuredImage.source_url}
                          alt={featuredImage.alt_text || developer.title.rendered}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span
                            className="text-gray-400 text-lg"
                            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                          >
                            No Image Available
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Developer Info */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-semibold mb-2 group-hover:text-gray-700 transition-colors"
                        style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        }}
                        dangerouslySetInnerHTML={{ __html: developer.title.rendered }}
                      />

                      {excerpt && (
                        <p
                          className="text-gray-600 mb-4"
                          style={{
                            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                            fontWeight: 400,
                            lineHeight: '1.5'
                          }}
                        >
                          {excerpt}...
                        </p>
                      )}

                      {/* ACF Fields Preview - if available */}
                      {(developer as any).acf && (
                        <div className="space-y-2 text-sm">
                          {(developer as any).acf.established_year && (
                            <div className="flex items-center text-gray-500">
                              <span className="font-medium">Est.</span>
                              <span className="ml-2">{(developer as any).acf.established_year}</span>
                            </div>
                          )}
                          {(developer as any).acf.total_projects && (
                            <div className="flex items-center text-gray-500">
                              <span className="font-medium">Projects:</span>
                              <span className="ml-2">{(developer as any).acf.total_projects}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View Details Link */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span
                          className="text-black font-medium group-hover:underline inline-flex items-center"
                          style={{
                            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          View Developer
                          <svg
                            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p
                className="text-gray-600 text-lg mb-4"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                }}
              >
                No developers found. Please check back later.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500 }}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-3xl font-semibold mb-6"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Can't Find What You're Looking For?
          </h2>
          <p
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              lineHeight: '1.6'
            }}
          >
            Get in touch with our team to learn more about our developer partnerships and available properties.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500 }}
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </div>
  )
}