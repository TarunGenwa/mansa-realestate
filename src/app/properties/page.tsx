'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import ContactFormSection from '@/src/components/ContactFormSection'
import { useMedia } from '@/src/providers/MediaProvider'
import { wpData } from '@/lib/data/wordpress-loader'

export default function PropertiesPage() {
  const { getImageByTitle } = useMedia()

  const [searchTerm, setSearchTerm] = useState('')

  // Get images from MediaContext
  const fallbackImage = getImageByTitle('Project Tile Fallback')
  const heroBannerImage = getImageByTitle('All Properties Banner')
  const contactImage = getImageByTitle('Contact Us Section')

  // Load properties from static data
  const properties = wpData.properties.getAll()

  // Filter properties based on search term
  const filteredProperties = useMemo(() => {
    if (searchTerm.trim() === '') {
      return properties
    }

    return properties.filter(property =>
      property.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.excerpt.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property as any).acf?.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, properties])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner */}
      <section className="relative mt-24" style={{ height: 'calc(100vh - 96px)' }}>
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
          <div className="text-center text-white w-[90%] mx-auto">
            <h1
              className="text-4xl lg:text-7xl mb-32"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                lineHeight: '1.1',
              }}
            >
              Find Properties
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-[60%] mx-auto">
              <div className="relative flex bg-white rounded-full shadow-lg overflow-hidden">
                {/* Search Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by property name, location, or description..."
                  className="flex-1 px-6 py-5 pr-16 text-black bg-white text-lg focus:outline-none transition-all"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
                  }}
                />

                {/* Search Arrow Button */}
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                  aria-label="Search"
                >
                  <Image
                    src="/right-arrow-black.svg"
                    alt="Search"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20">
        <div className="w-[90%] mx-auto">
          {/* Dynamic Heading */}
          <div className="mb-12 text-center">
            <h2
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 800
              }}
            >
              All Projects
            </h2>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => {
                const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]
                const imageUrl = featuredImage?.source_url || fallbackImage?.source_url || '/placeholder.jpg'
                const imageAlt = featuredImage?.alt_text || property.title.rendered
                const cleanExcerpt = property.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Property Image */}
                    <div className="relative h-80 bg-gray-200">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Property Info */}
                    <div className="p-8">
                      <h2
                        className="text-2xl font-semibold mb-4 group-hover:text-gray-700 transition-colors"
                        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      >
                        {property.title.rendered}
                      </h2>

                      <p
                        className="text-gray-600 mb-4 text-base"
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
                            <p className="text-base font-semibold text-gray-800">
                              {property.acf.price || `From ${property.acf.price_from}`}
                            </p>
                          )}
                          {property.acf.status && (
                            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
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
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <span className="text-black font-semibold group-hover:underline text-base">
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

      {/* Contact Form Section */}
      <ContactFormSection reverseOrder={true} contactImageUrl={contactImage?.source_url || undefined} />

    </div>
  )
}