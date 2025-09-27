import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Properties - Mansa',
  description: 'Explore our curated selection of premium properties in Dubai',
}

export default async function PropertiesPage() {
  // Get properties category
  const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)

  // Fetch all properties
  const properties = propertiesCategory
    ? await wpApi.posts.getAll({
        per_page: 100,
        categories: [propertiesCategory.id],
        _embed: true
      }).catch(() => [])
    : []

  // Get fallback image
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 20 }).catch(() => [])
  const fallbackImage = mediaImages.find(img => img.title.rendered.toLowerCase().includes('project_tile'))

  return (
    <div className="min-h-screen pt-24">
      {/* Header Section */}
      <section className="py-16" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-5xl lg:text-6xl mb-6"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              lineHeight: '1.2'
            }}
          >
            Our Properties
          </h1>
          <p
            className="text-xl text-gray-700 max-w-3xl"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              lineHeight: '1.6'
            }}
          >
            Discover exceptional properties in Dubai's most prestigious locations.
            Each property is carefully selected to offer the best investment opportunities.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="pb-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => {
                const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]
                const imageUrl = featuredImage?.source_url || fallbackImage?.source_url || '/placeholder.jpg'
                const imageAlt = featuredImage?.alt_text || property.title.rendered
                const cleanExcerpt = property.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 120) + '...'

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Property Image */}
                    <div className="relative h-64 bg-gray-200">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Property Info */}
                    <div className="p-6">
                      <h2
                        className="text-xl font-semibold mb-3 group-hover:text-gray-700 transition-colors"
                        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      >
                        {property.title.rendered}
                      </h2>

                      <p
                        className="text-gray-600 mb-4 text-sm"
                        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      >
                        {cleanExcerpt}
                      </p>

                      {/* Property metadata */}
                      {property.acf && (
                        <div className="space-y-2">
                          {property.acf.location && (
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Location:</span> {property.acf.location}
                            </p>
                          )}
                          {(property.acf.price || property.acf.price_from) && (
                            <p className="text-sm font-semibold text-gray-800">
                              {property.acf.price || `From ${property.acf.price_from}`}
                            </p>
                          )}
                          {property.acf.status && (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              property.acf.status === 'available' ? 'bg-green-100 text-green-800' :
                              property.acf.status === 'sold' ? 'bg-red-100 text-red-800' :
                              property.acf.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {property.acf.status.replace('-', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Details Link */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-black font-semibold group-hover:underline text-sm">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No properties found. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}