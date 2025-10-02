import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { wpData } from '@/lib/data/wordpress-loader'
import { getImageUrlByTitle } from '@/src/lib/utils/imageResolver'
import ContactFormSection from '@/src/components/ContactFormSection'

export const metadata: Metadata = {
  title: 'Guides et Actualités - Mansa Real Estate',
  description: 'Découvrez nos guides complets et les dernières actualités sur l\'investissement immobilier à Dubaï',
}

export default function GuidesPage() {
  // Load posts from static data
  const posts = wpData.guides.getAll()

  // Get images from static config
  const heroBannerImageUrl = getImageUrlByTitle('Guides Hero')
  const contactImageUrl = getImageUrlByTitle('Contact Us Section')

  return (
    <>

      <main className="min-h-screen pt-32">
        {/* Hero Section */}
        {heroBannerImageUrl && (
          <div className="relative w-[90%] mx-auto rounded-md h-[280px] mb-8">
            <Image
              src={heroBannerImageUrl}
              alt="Guides et Actualités"
              fill
              className="object-cover rounded-md"
              priority
            />
          </div>
        )}

        {/* All Guides Heading */}
        <div className="w-[90%] mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            All Guides
          </h1>
        </div>

        <div className="w-[90%] mx-auto">
          {/* All guides in a grid of 5 */}
          {posts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {posts.slice(0, 5).map((post) => {
                const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]
                const imageUrl = featuredImage?.source_url || '/placeholder.jpg'
                const imageAlt = featuredImage?.alt_text || post.title.rendered

                // Strip HTML tags from excerpt
                const cleanExcerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

                return (
                  <Link
                    key={post.id}
                    href={`/guides/${post.slug}`}
                    className="rounded-lg overflow-hidden group cursor-pointer flex flex-col bg-[#EDECE3] shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative h-60">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl text-mont-semibold mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {post.title.rendered}
                      </h3>
                      <p className="text-gray-600 text-sm text-mont-regular line-clamp-3 mb-4">
                        {cleanExcerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-start gap-2 mt-auto">
                        <Image
                          src="/mansa-insights.svg"
                          alt="Mansa Insights"
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs text-mont-regular text-gray-600">
                            Mansa Insights
                          </span>
                          <span className="text-xs text-mont-regular text-gray-500">
                            2025
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Aucun guide disponible pour le moment</p>
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Les articles avec la catégorie "guides" apparaîtront ici.</p>
            </div>
          )}
        </div>

      </main>

      {/* Contact Form Section */}
      <ContactFormSection reverseOrder={true} contactImageUrl={contactImageUrl || undefined} />
    </>
  )
}