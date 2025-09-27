import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PropertyPageProps {
  params: {
    propertySlug: string
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await wpApi.posts.getBySlug(params.propertySlug).catch(() => null)

  if (!property) {
    return {
      title: 'Property Not Found - Mansa',
      description: 'The requested property could not be found.',
    }
  }

  return {
    title: `${property.title.rendered} - Mansa`,
    description: property.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  // Get properties category to verify this is a property
  const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)

  const property = await wpApi.posts.getBySlug(params.propertySlug).catch(() => null)

  if (!property || !propertiesCategory) {
    notFound()
  }

  // Verify this post is in the properties category
  const isProperty = property.categories?.includes(propertiesCategory.id)
  if (!isProperty) {
    notFound()
  }

  const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]

  return (
    <div className="min-h-screen pt-24">
      {/* Back to Properties */}
      <section className="py-8" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <Link
          href="/properties"
          className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontSize: '14px' }}
        >
          ← Back to Properties
        </Link>
      </section>

      {/* Property Hero */}
      <section style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          {featuredImage && (
            <div className="relative h-96 lg:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || property.title.rendered}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1
                className="text-4xl lg:text-5xl mb-6"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1.2'
                }}
              >
                {property.title.rendered}
              </h1>

              <div
                className="prose prose-lg max-w-none mb-8"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: property.content.rendered }}
              />
            </div>

            {/* Property Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                >
                  Property Details
                </h3>

                {property.acf && (
                  <div className="space-y-4">
                    {property.acf.location && (
                      <div>
                        <span className="font-semibold text-gray-700">Location:</span>
                        <p className="text-gray-600">{property.acf.location}</p>
                      </div>
                    )}

                    {(property.acf.price || property.acf.price_from) && (
                      <div>
                        <span className="font-semibold text-gray-700">Price:</span>
                        <p className="text-lg font-bold text-black">
                          {property.acf.price || `From ${property.acf.price_from}`}
                        </p>
                      </div>
                    )}

                    {property.acf.status && (
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ml-2 ${
                          property.acf.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.acf.status === 'sold' ? 'bg-red-100 text-red-800' :
                          property.acf.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {property.acf.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4
                    className="font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                  >
                    Interested in this property?
                  </h4>
                  <Link
                    href="/contact"
                    className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center block"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500 }}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-semibold mb-8"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Similar Properties
          </h2>

          <div className="text-center py-8">
            <Link
              href="/properties"
              className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500 }}
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}