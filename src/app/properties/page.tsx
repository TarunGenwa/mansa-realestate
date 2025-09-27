'use client'

import { wpApi } from '@/lib/api/wordpress'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [fallbackImage, setFallbackImage] = useState<any>(null)
  const [heroBannerImage, setHeroBannerImage] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Get properties category
        const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)

        // Fetch all properties
        const fetchedProperties = propertiesCategory
          ? await wpApi.posts.getAll({
              per_page: 100,
              categories: [propertiesCategory.id],
              _embed: true
            }).catch(() => [])
          : []

        // Get media images
        const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 100 }).catch(() => [])

        // Get fallback image
        const fallback = mediaImages.find(img => img.title.rendered.toLowerCase().includes('project_tile'))

        // Get hero banner image
        const heroBanner = mediaImages.find(img => img.title.rendered.toLowerCase().includes('allproperties_banner'))

        setProperties(fetchedProperties)
        setFilteredProperties(fetchedProperties)
        setFallbackImage(fallback)
        setHeroBannerImage(heroBanner)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Filter properties based on search term
    if (searchTerm.trim() === '') {
      setFilteredProperties(properties)
    } else {
      const filtered = properties.filter(property =>
        property.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.excerpt.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.acf?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProperties(filtered)
    }
  }, [searchTerm, properties])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner */}
      <section className="relative h-screen pt-24">
        {heroBannerImage ? (
          <Image
            src={heroBannerImage.source_url}
            alt={heroBannerImage.alt_text || "Properties Banner"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-600" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-8">
            <h1
              className="text-5xl lg:text-7xl mb-8"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 700,
                lineHeight: '1.1'
              }}
            >
              Find Properties
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by property name, location, or description..."
                  className="w-full px-6 py-4 pr-20 text-black bg-white text-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 500
                  }}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Results count */}
          <div className="mb-8">
            <p
              className="text-lg text-gray-600"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
            >
              {searchTerm ? `${filteredProperties.length} properties found for "${searchTerm}"` : `${filteredProperties.length} properties available`}
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => {
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