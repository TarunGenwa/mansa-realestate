import { wpData } from '@/lib/data/wordpress-loader'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrlByTitle } from '@/src/lib/utils/imageResolver'
import ContactFormSection from '@/src/components/ContactFormSection'

// Enable ISR - revalidate every 2 hours for developers page
export const revalidate = 7200

export const metadata: Metadata = {
  title: 'Promoteurs - Mansa Real Estate',
  description: 'Découvrez nos promoteurs immobiliers de confiance et leurs projets à Dubaï',
}

export default async function DevelopersPage() {
  // Load developers from static data
  const developers = wpData.developers.getAll()

  // Get images from static config
  const heroBannerImageUrl = getImageUrlByTitle('Guides Hero')
  const contactImageUrl = getImageUrlByTitle('Contact Us Section')

  console.log('Developers found:', developers.length)

  return (
    <>
      <main className="min-h-screen pt-32">
        {/* Hero Section */}
        {heroBannerImageUrl && (
          <div className="relative w-[90%] mx-auto rounded-md h-[280px] mb-8">
            <Image
              src={heroBannerImageUrl}
              alt="Promoteurs"
              fill
              className="object-cover rounded-md"
              priority
            />
          </div>
        )}

        {/* All Developers Heading */}
        <div className="w-[90%] mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            All Developers
          </h1>
        </div>

        <div className="w-[90%] mx-auto">
          {/* All developers in a grid of 5 */}
          {developers.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {developers.map((developer: any) => {
                const featuredImage = developer._embedded?.['wp:featuredmedia']?.[0]
                const imageUrl = featuredImage?.source_url || '/placeholder.jpg'
                const imageAlt = featuredImage?.alt_text || developer.title.rendered

                // Strip HTML tags from excerpt
                const cleanExcerpt = developer.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

                return (
                  <Link
                    key={developer.id}
                    href={`/developers/${developer.slug}`}
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
                        {developer.title.rendered}
                      </h3>
                      <p className="text-gray-600 text-sm text-mont-regular line-clamp-3 mb-4">
                        {cleanExcerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-start gap-2 mt-auto">
                        <Image
                          src="/mansa-insights.svg"
                          alt="Mansa Developers"
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs text-mont-regular text-gray-600">
                            Mansa Developers
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

          {developers.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Aucun promoteur disponible pour le moment</p>
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Les promoteurs avec la catégorie "developers" apparaîtront ici.</p>
            </div>
          )}
        </div>

      </main>

      {/* Contact Form Section */}
      <ContactFormSection reverseOrder={true} contactImageUrl={contactImageUrl || undefined} />
    </>
  )
}